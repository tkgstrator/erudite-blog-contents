---
title: EPGStationをCloudflare Tunnel経由でアクセスしたい 
date: 2025-12-28
description: 普通にデプロイすると動かないのでその対応です 
tags: [EPGStation, Cloudflare Tunnel]
authors: ['tkgstrator']
---

## 背景

[EPGStation](https://github.com/l3tnun/EPGStation)ですが、インターネット経由でアクセスするためにCloudflare Tunnelを通すと設定ファイルが読み込めないとかで、うまく動きません。

このことは[issue](https://github.com/l3tnun/EPGStation/issues/670)でも挙げられていますが、公式としてVPN以外はサポートする予定がないので、そういうことなのでしょう。

ちゃんとCloudflare Accessを設定せずにパブリックドメインを設定すると、全世界からアクセス可能になってしまうのでこの判断は賢明と言えます。

ですが、その辺をわかっている人ならちょっと不便だな、となるわけです。

### 対応方法

[EPGstationをCloudflare Tunnelに対応させる](https://qiita.com/MATTENN/items/4527fca1c15e085eeffd)で対応させている人がいたのですが、うちの環境ではこれでは動作しませんでした。

EPGStationをDocker経由で動かしているのが問題なのかも知れません。

とりあえず[ドキュメント](https://github.com/l3tnun/EPGStation/blob/master/doc/conf-manual.md)を読んでみると、明示的に`clientSocketioPort`を指定できるそうなのでこれを使います。

というか、そもそもCloudflare TunnelがTLS対応をしてくれるので`https`の設定は不要です。

```yaml
port: 8888
clientSocketioPort: 8888
mirakurunPath: http://mirakc:40772/
```

うちではMirakurunに代えてMirakcを同一サービスで動かしているので、このように`config.yml`を変更します。変更するところはこれだけです。

```yaml
services:
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
      - ./epgstation/thumbnail:/app/thumbnail
      - ./epgstation/logs:/app/logs
      - ./epgstation/cert:/app/cert:ro
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

NVEncで高速なエンコードを利用したかったので、NVEnc対応のEPGStationをDockerで動かすようにしています。GPUはGTX 1070を使っているのですが、そもそも地上波やBS・CSは基本的に高々FHD画質なのでこれでも十分高速に動作します。4K放送は撤退および撤退予定ですし。

### Cloudflare Tunnel

説明は不要かと思いますが、HTTPプロトコルを指定したうえで`epgstation:8888`を適当なAccessでアクセス制限をかけたドメインに割り当てます。

Accessをちゃんと設定しないと全世界に公開されてしまうので最新の注意を払ってください。その辺りが苦手ならTailscaleでKonomiTVのようにVPNを通してローカルアクセスするのが良いかと思います。

## まとめ

もともと、Tailscaleを導入していてこの作業は不要だったのですが、せっかくなのでドメイン割り当てを試してみました。

記事は以上。