---
title: Aivis Engineを本番環境向けにリファクタリングする 
date: 2025-12-31
description: Aivis Engineは個人利用向けなので、大規模アクセスにも対応できるように修正します
tags: [Docker, Python, Aivis Engine]
authors: ['tkgstrator']
---

## 背景

テキストから音声を生成する[AivisSpeech Engine](https://github.com/Aivis-Project/AivisSpeech-Engine)を最近触っているのですが、

> AivisSpeech Engine は CPU のみでも高速に動作させるために ONNX Runtime ベースで開発されていますが、GPU サーバー上での生成速度やスケーラビリティには根本的なボトルネックがあります。
また、VOICEVOX ENGINE との API 互換性を保つトレードオフとして、技術的に新機能の追加や仕様変更が難しく、API 仕様自体が分かりにくいという課題もあります。

> Aivis Cloud API の内部では、GPU サーバーで大量の音声合成リクエストを捌くため、フルスクラッチで新規開発した音声合成 API サーバー製品「Citoras」を活用しています！
音声の生成品質はそのまま、AivisSpeech Engine にはない、エンタープライズ向けに最適化された多彩な機能を備えています。

確かに`run.py`の実装を見ると単一プロセスでしか動作せず、大量のリクエストがきた場合にはパフォーマンスが悪くなってしまいそうな感じがします。

実際にボトルネックになるのはAPIサーバーよりもバックエンドの生成部分なのですが、こちらも複数ワーカーに分けることで多少は改善しそうだったので、LLMの力を借りてリファクタリングしてみました。

### ワーカーの修正

既存の一番の問題はシングルワーカーであることなので、これを複数ワーカーで処理できるように修正します。

そこで`Gunicorn + Uvicorn Workers`の構成に変更します。

```python
"""Gunicorn 設定ファイル

本番環境で Gunicorn + Uvicorn Workers を使用する際の推奨設定
使用方法: gunicorn -c gunicorn_conf.py voicevox_engine.app.application:app
"""

import multiprocessing
import os

# ワーカー設定
# CPU コア数 * 2 + 1 を推奨（環境変数で上書き可能）
workers = int(os.getenv("VV_WORKERS", multiprocessing.cpu_count() * 2 + 1))
worker_class = "uvicorn.workers.UvicornWorker"

# バインドアドレス
bind = os.getenv("VV_BIND", "0.0.0.0:10101")

# タイムアウト設定
timeout = int(os.getenv("VV_TIMEOUT", "120"))  # ワーカータイムアウト（秒）
keepalive = int(os.getenv("VV_KEEPALIVE", "5"))  # Keep-Alive 接続のタイムアウト
graceful_timeout = int(os.getenv("VV_GRACEFUL_TIMEOUT", "30"))  # グレースフルシャットダウン時間

# ログ設定
accesslog = os.getenv("VV_ACCESS_LOG", "-")  # アクセスログ ("-" は stdout)
errorlog = os.getenv("VV_ERROR_LOG", "-")  # エラーログ
loglevel = os.getenv("VV_LOG_LEVEL", "info")  # ログレベル

# プロセス名
proc_name = "aivisspeech-engine"

# プリロード設定（メモリ効率化）
preload_app = True

# 最大リクエスト数（メモリリーク対策）
max_requests = int(os.getenv("VV_MAX_REQUESTS", "1000"))
max_requests_jitter = int(os.getenv("VV_MAX_REQUESTS_JITTER", "50"))

# ワーカー接続数制限
worker_connections = int(os.getenv("VV_WORKER_CONNECTIONS", "1000"))

# Uvicorn 固有の設定（環境変数経由）
# これらは UvicornWorker に渡される
raw_env = [
    f"UVICORN_LIMIT_CONCURRENCY={os.getenv('VV_LIMIT_CONCURRENCY', '100')}",
    f"UVICORN_TIMEOUT_KEEP_ALIVE={os.getenv('VV_TIMEOUT_KEEP_ALIVE', '5')}",
]


def on_starting(server):
    """サーバー起動時のフック"""
    server.log.info(f"Starting Gunicorn with {workers} workers")


def on_reload(server):
    """リロード時のフック"""
    server.log.info("Reloading Gunicorn")


def worker_int(worker):
    """ワーカー中断時のフック"""
    worker.log.info(f"Worker {worker.pid} received INT or QUIT signal")


def worker_abort(worker):
    """ワーカー異常終了時のフック"""
    worker.log.error(f"Worker {worker.pid} received SIGABRT signal")
```

ほぼLLMの生成のコピペなので、コードを読んでそうなんだって納得しているレベルなのですが、まあいいでしょう（何がだ

### パフォーマンス測定

CPU(M3 Max)でAivis Speechを動作させた場合、Discordで送信するくらいの短いテキストであれば0.6秒くらいで生成できます。実際、1ユーザー、1秒に1リクエストで処理させると50%のパーセンタイルは350msくらい、99%で700msくらいになります。

よって、700msあれば99%のリクエストは処理できることになります。

単一ワーカーの場合にはリクエストを受け取ってAPIサーバーが処理する時間とデータを返す時間にはバックエンドのエンジン部分のリソースが余ってしまいます。

といっても、CPUで処理する場合には結局生成の方がボトルネックになるので、ワーカー数はせいぜい一つくらいしか増やせません。

M3 Max程度のスペックでは2.0RPSくらいでカツカツになるので、ワーカー数の調整で恩恵を受けるためにはGPUの利用が必須でしょう。

> `VV_WORKERS=2`にするとCPU仕様率が100%に張り付いてファンがすごい勢いで回りました

