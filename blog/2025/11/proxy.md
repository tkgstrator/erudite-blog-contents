---
title: モノレポで開発したときの備忘録 
date: 2025-11-25
description: 開発中に工夫したところなどをメモ代わりに記述します 
tags: [Vite, React, Cloudflare Workers]
authors: ['tkgstrator']
---

## 背景

現在、Turboを利用したモノレポでの開発をしています。

Cloudflare Workers的には[Monorepos](https://developers.cloudflare.com/workers/ci-cd/builds/advanced-setups/)にあるようにモノレポでの開発を結構考慮してくれているようなので、できればその便利な機能を利用したいと思います。

```zsh
.
├── .devcontainer/
│   ├── devcontainer.json
│   ├── Dockerfile
│   └── compose.yaml
├── workers/
│   ├── api
│   └── app
├── turbo.json
├── package.json
└── tsconfig.json
```

大雑把な構成はこんな感じです。

このとき、ソースコードの全体はworkers以下にあり、全体で使うパッケージをpackage.jsonに記述しておく感じです。

### Proxy

フロントエンドからバックエンドにアクセスするときにブラウザ経由でアクセスするとCORSが問題になってきます。

Cloudflare Workers自体はSSRをサポートしているのでapp自体に実装してもいいのですが、結局最終的に何処かにバックエンドのコードを書く必要があるので、自分の場合にはバックエンドのコードは全てapi側に書いています。

こうやって完全に分けておくことでapp側で`VITE_`のプレフィックスを付けたりして環境変数を切り分けなくていいのがポイントです。ちなみに、app側でほとんど環境変数は利用しない設計になっています。

ステージング環境以上ではapiとappは同一のドメインで動くことになるのですが、開発中はappはlocalhost:5173、apiはlocalhost:8787などのようにポートが異なる場合が多いです。

ただし、localhostはポートが違ってもCORSが問題にならないので、ステージングのドメインが同じであれば開発環境において基本的にこのポートの違いが問題になることはないだろう、と考えていました。

が、ここに大きなミスがありました。

#### Cookie

app側で認証を使う場合、HTTP OnlyなCookieを利用するのが個人的に最適解と考えています。

以下、その理由。

1. HTTP OnlyなCookieはブラウザのJavaScriptから読み込むことができず、XSSに対する耐性が強い
2. Cookieは自動でリクエストヘッダーに付与されるため、クライアント側から認証を明示的に指定する必要がない
3. Secure + SameSiteでCSRF対策が取りやすく、CSRFトークンの仕組みが不要

これらの点はBearer Tokenなどを使う場合だとどこに保存するかなどで困るような問題が発生しないので、開発者としてはとても気が楽です。サーバーサイドでセッションを管理することもできますが、完全にステートレスなCloudflare Workersとは相性が良くないです。

Cloudflare Workersを使っていく以上は、認証はHTTP Only(Secure)なCookieを利用すると覚えておきましょう。

#### 制約

で、当然私が管理するサービスの多くではHTTP OnlyなCookieを利用して認証をしているのですが、開発環境でうまく動かない問題がありました。

なので、開発環境でもステージングのAPIを叩いていたのですが、これは変更がすぐに反映されないのでいろいろ面倒です。

そこで、なんでちゃんと開発環境で動かないのか調べてみることにしました。

## 結果

調べた結果、この認証方式が開発環境で動かないのはオリジンの違いが問題だということがわかりました。

実際にやってないのでそれで上手くいくのかはわからないのですが、`SameSite=None; Secure`をつけないと行けないらしいです。また、開発環境はHTTPSでは動いていないので`Secure`をつけているのも良くないとかなんとか。

まあ、最終的に何が悪いのかはよくわからないのですがポートが違うとCORS等の問題とは違うところで引っかかるみたいです。

### 対応方法

`vite.config.ts`で開発環境ではNode.jsを利用してプロクシを通すようにします。

```ts
export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
          secure: false
        }
      }
    },
  }
})
```

こうすることで本来Viteのドメインである`localhost:5173/api`にアクセスすると`localhost:8787/api`にとばされるので、オリジンの違いを吸収することができます。よって、api側から実行した`setCookie`のようなメソッドがちゃんと動くようになります。

## まとめ

これで、開発環境でステージングの環境に接続せずに、完全に切り離された環境で作業できるようになりました。

今まで何してたんだって感じですね。

記事は以上。