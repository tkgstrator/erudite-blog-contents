---
title: Outline Wikiをセルフホストする 
date: 2026-01-12
description: オンラインドキュメントエディタをセルフホストすることにしました
tags: [Docker, Outline]
authors: ['tkgstrator']
---

## 概要

## 構築 

Docker Composeで実装する方法を解説します。

以下、コピペで動きます。

```yaml
services:
  outline:
    image: docker.getoutline.com/outlinewiki/outline:latest
    volumes:
      - outline_data:/var/lib/outline/data
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      DATABASE_HOST: postgres
      DATABASE_NAME: $POSTGRES_DB
      DATABASE_PASSWORD: $POSTGRES_PASSWORD
      DATABASE_USER: $POSTGRES_USER
      DISCORD_CLIENT_ID: $DISCORD_CLIENT_ID 
      DISCORD_CLIENT_SECRET: $DISCORD_CLIENT_SECRET 
      DISCORD_SERVER_ID: $DISCORD_SERVER_ID 
      DISCORD_SERVER_ROLES: $DISCORD_SERVER_ROLES 
      ENABLE_UPDATES: "false"
      FORCE_HTTPS: "true"
      NODE_ENV: "production" 
      PGSSLMODE: "disable"
      PORT: 3000
      REDIS_URL: redis://redis:6379
      SECRET_KEY: $SECRET_KEY
      URL: https://DOMAIN_NAME # 必ず公開するURLと合わせること
      UTILS_SECRET: $UTILS_SECRET

  redis:
    image: redis:latest
    volumes:
      - redis_data:/data
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 10s
      timeout: 10s
      retries: 5

  postgres:
    image: postgres:latest
    volumes:
      - postgres_data:/var/lib/postgresql
    environment:
      POSTGRES_USER: $POSTGRES_USER
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      POSTGRES_DB: $POSTGRES_DB
    healthcheck:
      test: [ "CMD", "pg_isready", "-d", "${POSTGRES_DB}", "-U", "${POSTGRES_USER}" ]
      interval: 10s
      timeout: 10s
      retries: 5

  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command:
      - tunnel
      - run
    environment:
      TUNNEL_TOKEN: $TUNNEL_TOKEN

volumes:
  outline_data:
    driver: local
  redis_data:
    driver: local
  postgres_data:
    driver: local
```

Cloudflare Tunnelでホスティングしていたのですが、最初DNS解決が遅すぎてちゃんと動いているのか不安になりました。

### 環境変数について

- `POSTGRES_USER`
- `POSTGRES_DB`
- `POSTGRES_PASSWORD`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_SERVER_ID`
- `DISCORD_SERVER_ROLES`
- `TUNNEL_TOKEN`

`SECRET_KEY`と`UTILS_SECRET`はコマンドで生成します。

```bash
$ openssl rand -hex 32
ca0941238c15d311a5bbbfb5276e63d2e604f1e374ec8091fb3658b53a27d4a6
```

これを二回実行して生成されたランダムなハッシュを設定しましょう。当然、シークレットなので外部には洩らさないように。

`TUNNEL_TOKEN`は人によっては不要ですが、Cloudflare Tunnelで外部にサーバーを公開したい場合には必要です。OutlineはどうやらHTTPSでの動作を標準としているみたいで、HTTPのままだと動作が不安定でした。

`POSTGRES`系の環境変数は適当に設定すればよいです。[公式ドキュメント](https://docs.getoutline.com/s/hosting/doc/docker-7pfeLP5a8t)ではDB名は`outline`が指定されていましたが、結局`outline`のサービスにも環境変数を渡すので、何でも良いようです。

redisのデータは[公式ドキュメント](https://docs.getoutline.com/s/hosting/doc/docker-7pfeLP5a8t)だと保存しない設定になっていたのですが、念の為保存するようにしています。

### 認証方法

Outlineは様々な認証が利用できるのですが、個人的にはDiscord OIDCが便利かと思います。

[Discord OIDC](https://github.com/tkgstrator/discord-oidc-worker)は別途作っていたのですが、それとは別に設定することをオススメします。

自分は適当にアプリケーションを作成して、Outline専用の認証アプリとして実装しました。

これも、[公式ドキュメント](https://docs.getoutline.com/s/hosting/doc/discord-g4JdWFFub6)をそのまま読めばいいのかと思います。

サーバーを設定すると、Outlineのサーバー自体の初期設定にDiscordのサーバーの設定がそのまま反映されていました。

Discordログインを許可していれば、サーバーに参加していて特定のロールがあるユーザーは自由に参加できるので便利でした。

## まとめ

Outlineって便利だなって。