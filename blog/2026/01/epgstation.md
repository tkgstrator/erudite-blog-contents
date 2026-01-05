---
title: EPGStationの録画やエンコード設定
date: 2026-01-05
description: 効率的に録画する方法などについて備忘録としてメモしていきます
tags: [EPGStation]
authors: ['tkgstrator']
---

## 背景

EPGStationで録画をしていたのですが、家にあったチューナーを全部利用すると十二番組同時に録画・視聴できるというオーバースペックな録画サーバーが完成しました。

一般的なコンシューマ向けのレコーダーだとフラグシップモデルでも多くても録画は三番組同時というものがおおいので、それの四倍以上、理論上は地上波を全録することも可能です。

> ちなみにこの録画サーバーは結構安く構築できたのでびっくりしました。HDDが高いのさえ解消してくれればなあと思っています。

が、それ故にいろいろ問題が発生してきたのでメモしていきます。

### エンコード

エンコードにはGTX 1070を利用していましたが、1080pのエンコード時に実時間の1.4倍くらいの時間でしか処理できなかったので、二番組同時に録画している場合には変換が間に合わずにエンコードのタスクが溜まってしまうという問題がありました。

この一番の原因はインターレースの解除をCPUで処理していたことで、ここがボトルネックになってしまってNVEncの性能が活かしきれていませんでした。

```zsh
ffmpeg -fix_sub_duration -hwaccel cuda -hwaccel_output_format cuda -i "$INPUT" -map 0:v -map 0:a -map 0:s? -vf "yadif_cuda=mode=1:deint=interlaced,fps=fps=30000/1001,scale_cuda=format=nv12" -vcodec hevc_nvenc -preset p4 -profile:v main -cq 26 -acodec aac -b:a 192k -c:s ass "$OUTPUT"
```

というわけでそれを解消するために`enc_hevc_nvenc.sh`を作成し、このコマンドでエンコードを行うようにしました。

```yaml
recorded:
  - name: recorded
    path: '%ROOT%/recorded'
    limitThreshold: 102400 # MB
    action: remove
  - name: encoded
    path: '%ROOT%/encoded'
recordedTmp: '%ROOT%/recorded_tmp'

encodeProcessNum: 4
concurrentEncodeNum: 4
encode:
  - name: H.265(NVEnc)
    cmd: /bin/bash %ROOT%/config/enc_hevc_nvenc.sh
    suffix: .mkv
    rate: 2.0
  - name: H.265(libx265)
    cmd: /bin/bash %ROOT%/config/enc_hevc_libx265.sh
    suffix: .mkv
    rate: 4.0
```

流石にエンコードが二倍かかることはないだろうということで、実時間の二倍の時間が変換にかかった場合にはエンコードを中止するようにしています。

また、ブラウザ側から`encoded`フォルダを指定して保存できるようにしています。これでエンコード実行時に`OUTPUT`の環境変数に出力先ディレクトリが直接渡るので、余計なことをせずに変換後のデータを`recorded`に退避させることができます。

MKVではM2TSの字幕をそのまま利用することができないらしいので、字幕の変換を入れていますが、そのときに`-fix_sub_duration`をつけておかないと字幕の時間がバグってEPGStationやKonomiTV上で再生ができなくなります。

この設定により、1440x1080pの動画であれば実時間の17倍のスピードで変換できるようになりました。最適化前は1.5倍くらいしかでなかったので、CPUが如何にボトルネックになっていたかがわかりますね。

### Nvidia-Patch

通常、NVEncが実行できるストリームはGPUごとに制限がかかっており、GTX 1070の場合には2なのですが（多くても3程度のようです）、実際には1080p程度のNVEncしか実行しないような場合にはGPUのリソースが余ってしまうので[nvidia-patch](https://github.com/keylase/nvidia-patch)でドライバにパッチを当ててこの制限を解除しています。

```yaml
  epgstation:
    container_name: epgstation 
    build:
      context: epgstation
      dockerfile: nvenc.Dockerfile 
    environment:
      TZ: "Asia/Tokyo"
      NVIDIA_VISIBLE_DEVICES: "all"
      NVIDIA_DRIVER_CAPABILITIES: "compute,video,utility"
    volumes:
      - ./epgstation/config:/app/config
      - ./epgstation/data:/app/data
      - ./epgstation/logs:/app/logs
      - ./epgstation/thumbnail:/app/thumbnail
      - ./epgstation/docker-entrypoint.sh:/usr/local/bin/docker-entrypoint.sh:ro # パッチ
      - ./epgstation/patch.sh:/usr/local/bin/patch.sh:ro # パッチ
    entrypoint: # 立ち上げ時にパッチを毎回実行
      - /usr/local/bin/docker-entrypoint.sh
    command: # Entrypoint後に実行されるコマンドを明示的に指定
      - npm
      - start
    depends_on:
      mirakc:
        condition: service_started
      mariadb:
        condition: service_healthy
    restart: always
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [compute,video,utility]
```

全部書くと長くなるので重要な部分だけ抜粋すると上のような感じになります。

コンテナでCUDAを利用できるようにしたうえで、`patch.sh`と`docker-entrypoint.sh`をコンテナにマウントします。

更に`entrypoint`を修正して、コンテナ立ち上げ時にNvidia-Patchが実行されるようにします。こうすることで自動的にドライバを検知してパッチを当ててくれます。

```zsh
$ docker compose up epgstation --force-recreate
[+] up 3/3
 ✔ Container mirakc     Running                                                                                                                               0.0s 
 ✔ Container mariadb    Running                                                                                                                               0.0s 
 ✔ Container epgstation Recreated                                                                                                                             0.2s 
Attaching to epgstation
Container mariadb Waiting 
Container mariadb Healthy 
epgstation  | Detected nvidia driver version: 570.195.03
epgstation  | libnvidia-encode.so
epgstation  | Attention! Backup not found. Copying current libnvidia-encode.so to backup.
epgstation  | 865c9e71be152c9e0632e4f8012d4ee738206098  /opt/nvidia/libnvidia-encode-backup/libnvidia-encode.so.570.195.03
epgstation  | 865c9e71be152c9e0632e4f8012d4ee738206098  /patched-lib/libnvidia-encode.so.570.195.03
epgstation  | Patched!
epgstation  | /app
epgstation  | 
epgstation  | > epgstation@2.10.0 start
epgstation  | > node dist/index.js
```

また、`entrypoint.sh`は`cmd`で受け取ったものをパッチ後に実行するようにしているので、明示的に`command`でEPGStationを立ち上げる必要があります。

当たり前ですが、パッチには実行権限を与えておきましょう。これで同時に三つのファイルをNVEncで変換できるようになったのですが、実際にやったことがないのでできるのかどうかはわかりません。

### 一時保存

ストレージ上では主に以下の三つの読み書きが発生します。

1. 録画(ファイル書き込み)
2. 変換(ファイル読み書き)
3. 転送(ファイル読み込み)

転送というのはEPGStationからJellyfinのサーバーにコピーする処理で三十分に一回実行しています。

このとき、単純にコピーするとJellyfinがメタデータをちゃんと取得できずに見た目がおかしくなるので、Pythonのコードを使っていい感じにファイル名等を修正しています。

ここはそのうちコードを公開するか、EPGStation側で録画時に修正したほうがいいかなと感じています。

で、最大でこの三つが同時に実行されるのですがその時にHDDの転送速度が遅いせいで全部の処理が遅くなってしまっていたので、録画と変換の読み込みはHDDではなくSSDで実行されるようにしました。

こうすることでHDDに同時にアクセスするプロセスを減らすことで、それぞれの処理を高速化することができました。

## まとめ

本格的にEPGStationを運用し始めたのですが、録画するのにも結構気を使うことがわかりました。

本当はNASも含めてストレージを大規模改修したいのですが、HDDが高すぎるのでしばらく先になりそうです。当時は6TBは13000円位で買えたのに......

記事は以上。