---
title: Aivis EngineをDiscordで利用する 
date: 2026-01-01
description: Aivis Engineでテキストチャットを読み上げるBotを作りました
tags: [Docker, TypeScript, Aivis Engine]
authors: ['tkgstrator']
---

## 背景

[VOISCORD](https://voiscord.net/)という[VOCALOID](https://aivoice.jp/about/)を使ってDiscordのチャットを読み上げるサービスがあります。

これは当サーバーでも利用させていただいているのですが、選べるキャラクターが少なく、例えば琴葉茜と琴葉葵が同時に使えないので（というか、琴葉茜は利用できない）ちょっと不便なところがありました。

キャラクターも増えていない（間違っていたらすみません）ので、好きなキャラクターに喋らせたいというカスタマイズ性には欠けていました。また、OSSではないため自分用にカスタマイズするということもできません。

そこで、OSSの[AivisSpeech Engine](https://github.com/Aivis-Project/AivisSpeech-Engine)を使って、VOISCORDのようなBotをサーバーに導入できる仕組みを作ることにしました。

### 仕様

[AivisSpeech-Engine-Discord-Bot](https://github.com/tkgstrator/AivisSpeech-Engine-Discord-Bot)

基本的にはVOISCORDの仕様を踏襲し、辞書登録やユーザーごとの話者設定をできるようにしています。

スラッシュコマンド等にも対応しているので、VOISCORDを使い慣れている方なら同じように使えると思います。

導入はDocker Composeを前提としており、それ以外の導入方法はサポートしていません。実行すると`AivisSpeech-Engine-Dev`のディレクトリが自動で作成されるので、利用したいモデルデータを`AivisSpeech-Engine-Dev/Models`にコピーすれば利用できます。

特に理由はありませんが、デフォルトのモデルは選択されないようにしているので使うことはできません。

### おまけ

今回のBot作成ですが、ほぼほぼ私はコードを書いていません。Claude Opus 4.5にほぼ任せていて、スラッシュコマンド実装やAivisとの連携もできました。

直したのはZodiosの定義くらいで、それ以外は本当に何も書いていないです。

ここ最近のプロダクトはそんな感じでLLMによるコーディング支援の恩恵がすごく大きいなと感じました。

## 最後に

前回作成したモデルデータを使っているのですが、いい感じで動いているので非常に楽しいです。

記事は以上。