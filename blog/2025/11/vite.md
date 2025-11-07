---
title: Vite+ReactをCloudflare Workersにデプロイする 
date: 2025-11-07
description: デプロイするときの注意点についてまとめ
tags: [Vite, React, Cloudflare Workers]
authors: ['tkgstrator']
---

## 背景

最近、モノレポでサービスを作るのにハマっています。モノレポだとZodのスキーマをそのまま再利用できたりして便利です。

プロジェクトを作るのに手こずりましたが、慣れると結構楽しいです。デプロイも一括でできますし。

### 課題

基本的に、プロジェクトをリリースする際には、

- 開発環境
- ステージング環境
- 本番環境

という三段階を踏むと思います。この場合でいう開発環境はローカルのことで、ステージング環境から実際にウェブ上で確かめられるようなイメージです。

通常、ステージング環境はアクセス制限をしたりすると思うのですが、現状めんどくさいのでしていません。大事なデータも別にないですし。ただし、sourcemapは本番環境にしかデプロイしないような仕組みは必要かもしれません。

で、静的サイトをビルドした際にはデプロイ先としてGitHub PagesやFirebase HostingやVercelやCloudflare Pagesなどがあるのですが、個人的にはVercelとCloudfalre Workersを推したいと思っています。

### ホスティングサービス

#### Vercel

言わずとしれたNext.jsに公式対応しているサービスです。

Next.jsで作ったウェブサイトをリリースするならここ一択だと思います。ちょっと調べた感じですとウェブサイトの表示速度はCloudflare PagesやWorkersには劣るようです。

またWeb AnalyticsやSpeed Insightsが使えるのがHobbyプランだと一つのプロジェクトに制限される、という仕様もあります。これの制限がなければNext.jsを使って全部Vercelにデプロイしても良かったのですが......

#### Cloudflare Pages

Cloudflareが運営するホスティングサービスでめちゃくちゃ速いですが、ただホスティングするだけなのでSSGかCSRしか動きません。

どちらも、何らかのコードを実行するのにブラウザを経由する必要がある以上、CORSに引っかかることが多いです。その対策のためにプロクシを立てたりすると非常にめんどくさいです。

#### Cloudfalre Workers

VercelとCloudflare Pagesの両方の問題を解決するのがコレです。

| サービス           | Next.js            | バックエンド | 速度   | 無料プランでの制限 | 
| ------------------ | :----------------- | ------------ | ------ | ------------------ | 
| Vercel             | SSR, SSG, CSR, ISR | ✔           | 高速   | あり               | 
| Cloudflare Pages   | SSG, CSR           | ✘           | 超高速 | なし               | 
| Cloudflare Workers | SSR, SSG, CSR      | ✔           | 超高速 | なし               | 

厳密にはCloudflare Pages/Workersにも無料プランでの制限はあるのですが、Web Analysisが使えないとかSpeed Insightsが使えないとかそんなあからさまなものはありません。Vercelに比べれば無料プランでもなんでもできます。

Cloudflare Workersでウェブサイトをホスティングする最大の理由は「バックエンドも同時にデプロイできる」ということです。Next.jsのSSRは多分そのままでは動かないですが、Honoなどを使ってSSRの仕組みを利用することができます。

ただし、Vercelのバックエンドに比べるとCloudflare Workersができることは限られているので、そこは完全互換とはいかないようです。とはいえ、ブラウザの制約がないので、相当ニッチなことでない限りは大体なんでもできます。

## 環境設定

Cloudflare WorkersにデプロイするときにはWranglerを使うことになるのですが、これは設定ファイルである`wrangler.toml`にいろいろ書き込んでおくことで自動的にドメインやらルートやらを設定できます。

```toml
name = "tkgstrator.blog"
main = "src/index.ts"
compatibility_date = "2025-09-13"
send_metrics = true
compatibility_flags = ["nodejs_compat_v2"]
keep_vars = true

[env.dev]
name = "tkgstrator.blog"
logpush = true
minify = false
preview_urls = false
workers_dev = true
routes = [{ pattern = "blog-dev.tkgstrator.work/api/*", custom_domain = false }]

[env.prod]
name = "tkgstrator.blog"
logpush = true
minify = true
preview_urls = false
workers_dev = true
routes = [{ pattern = "blog.tkgstrator.work/api/*", custom_domain = false }]

[[env.dev.kv_namespaces]]
binding = "CACHE"
id = "8271a5e9846b4a389eef6564d5454ea7"

[[env.prod.kv_namespaces]]
binding = "CACHE"
id = "8271a5e9846b4a389eef6564d5454ea7"

[env.dev.observability]
enabled = true

[env.prod.observability]
enabled = true

[env.dev.observability.logs]
enabled = true

[env.prod.observability.logs]
enabled = true

[dev]
ip = "0.0.0.0"
port = 8787
inspector_port = 9230
```

これはあくまで一例ですが、`env.***`のプレフィックスを付けることで、環境ごとに設定を切り分けておくことができます。

```zsh
wrangler deploy --env dev
```

そしてデプロイするときに`--env ***`をつけることでその環境でデプロイすることができるわけです、便利ですね。

これを自由に変更したい場合には、

```zsh
wrangler deploy --env ${CLOUDFLARE_ENV:-dev}
```

のように`package.json`に書いておくと便利です。

### Vite

ところが、Vite+ReactをWranglerでデプロイしようとすると、その前段階のビルドの時点でコケます。

詳しくは[Cloudflare Environments](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/)に書いてあるのですが、Vite+Reactのプロジェクトをビルドする場合には、環境変数はWranglerではなくViteを経由して`vite.config.ts`に渡す必要があります。

```ts
export default defineConfig(({ mode }) => {
})
```

渡された環境変数は`mode`に入るので、ビルド時に`mode`が渡るように修正します。

```json
"scripts": {
  "dev": "bun --bunx vite --host",
  "build": "tsc -b && vite build --mode ${CLOUDFLARE_ENV:-dev}",
  "deploy": "wrangler deploy"
},
```

こんな感じで先ほどとは違い`wrangler deploy`には引数を渡さず、`vite build --mode ***`で環境を指定します。ここは`wrangler.toml`で指定されているものを同じものを渡して多分大丈夫です。