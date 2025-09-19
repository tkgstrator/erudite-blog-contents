---
title: Firebase AuthとSharedArrayBuffer
date: 2025-09-19
description: Firebase Authでハマりました
tags: [Firebase Auth]
authors: ['tkgstrator']
---

## 背景

認証周りは自分で作ると大変なのでFirebase Authを使うことが多いです。

今回、めんどくさかったのですが頑張ってXのアカウントを再取得してDeveloper Portalから認証用のキーを作成したりしました。

なんだかんだでXのユーザーは多いので、Xアカウントでログインできるようにしておくと便利です。

### 最初は順調

で、認証自体はめちゃくちゃ簡単に実装できて特に困ったこともありませんでした。

ログイン後に取得したidTokenを使って色々したりもできます。

このあたりは好調で、もうすぐ閑静なのではないかと思っていました。

## 問題発覚

ウェブアセンブリを利用するために`SharedArrayBuffer`という機能を有効にする必要が生じました。

これはスレッド間で参照を共有することができる結構概念がガバガバな存在なのですがSpectreの脆弱性が見つかったせいで、スレッド間値値参照できてしまうことがセキュリティリスクと見なされるようになりました。

よって、ブラウザでは`Cross-origin-isolated`な状態で無い限り、`SharedArrayBuffer`が効かなくなりました。これはつまり、ウェブアプリであればそのウェブアプリのオリジンが他のオリジンから隔離されている必要がある、ということになります。

よって、`Cross-origin-isolated`なウェブサイトは別のウェブサイトのリソースにアクセスできません。ん、考え方によってはこれは困りますね......

ちなみにこれ自体は[Cross-origin isolation overview
](https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation)にもあるようにヘッダーに特別な値をいれるだけで簡単に設定できます。

### Cloudflare Pages

```zsh
/*
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
```

Cloudflareにホストする場合、`public/_headers`に上の内容を書き込んでデプロイすると反映されます。

### Firebase Hosting

```json
{
  "hosting": {
    "public": "dist/client",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cross-Origin-Opener-Policy",
            "value": "same-origin"
          },
          {
            "key": "Cross-Origin-Embedder-Policy",
            "value": "require-corp"
          }
        ]
      }
    ]
  }
}
```

Firebase Hostingの場合には上のように設定すれば有効になります。

自分の環境だけなのかもしれないですが、Cloudflareの場合にはパスごとに設定できなかったのですが、Firebase Hostingの場合にはパスごとに`COOP`と`COEP`が設定できました。

本来そんなわけないだろって気がするので、勘違いかもしれません。

## Isolatedの問題点

`SharedArrayBuffer`を使うために`COOP`と`COEP`を設定しましたが、これを設定するとFirebase Authのリソースにアクセスできなくなり、ログインができなくなります。

これでは何のためにIsolatedにしたかわからないので、解決を目指します。

恐らく、目的は少し違うのですが公式ドキュメントの[サードパーティのストレージ アクセスをブロックするブラウザで signInWithRedirect を使用する場合のベスト プラクティス](https://firebase.google.com/docs/auth/web/redirect-best-practices)が非常に参考になりました。

今回は標準ブラウザなので別にsignInWithRedirectやサードパーティへのストレージアクセスは気にしなくていいのですが、ブロックされるという点では共通しています。

今回作っていたウェブアプリはFirebase Authを使っているくせにFirebase Hostingは使っていないという謎構成だったのですが、一応いろいろ解決方法を書いておきます。

ただ、色々やったのでごっちゃになっている可能性があります、ご了承ください。

### Firebase Hostingを利用する場合

前述したIsolatedな状態にするための設定を`firebase.json`に書き込むだけです。

Hostingされているドメインと認証のドメインが同じなのでIsolatedであることが問題になりません。

って書いてあるのですがFirebase Authを利用するページだけは明示的にNon Isolatedであることを明示しないと動きませんでした。

```json
"headers": [
  {
    "source": "**",
    "headers": [
      {
        "key": "Cross-Origin-Opener-Policy",
        "value": "same-origin"
      },
      {
        "key": "Cross-Origin-Embedder-Policy",
        "value": "require-corp"
      }
    ]
  },
  {
    "source": "/login",
    "headers": [
      {
        "key": "Cross-Origin-Opener-Policy",
        "value": "same-origin"
      },
      {
        "key": "Cross-Origin-Embedder-Policy",
        "value": "same-origin"
      }
    ]
  }
]
```

`signInWithPopup`を使って正常にログインできることを確認しましたが、ポップアップが閉じるまでにちょっと時間がかかりました。


#### カスタムドメインを使っている場合

カスタムドメインを使っている場合にはカスタムドメインを`authDomain`として利用します。

```ts
const firebaseConfig = {
  apiKey: "<api-key>",
  authDomain: "<the-domain-that-serves-your-app>",
  databaseURL: "<database-url>",
  projectId: "<project-id>",
  appId: "<app-id>"
}
```

こんなファイルを読み込んでいると思うのですが、`authDomain`のところをカスタムドメインに書き換えます。

その上で、各アプリのコールバックURLあるいはリダイレクトURLを書き換えます。

最初は`https://xxxxxxxxxx.firebaseapp.com/__/auth/handler`みたいなのを設定したと思うのですが、そこを`https://<the-domain-that-serves-your-app>/__/auth/handler`にします。

で、Googleの場合にはちょっとコツが必要で[GCP](https://console.cloud.google.com/auth/clients)から直接変更する必要があります。

**Google Auth Platform > クライアント**で認証済みリダイレクトURIに`https://<the-domain-that-serves-your-app>/__/auth/handler`を追加します。

ついでに承認済みの JavaScript 生成元にもドメインを追加しておきましたが、こちらは必要かどうかわかりません。

Firebase Hostingにデプロイしたファイルにカスタムドメインからアクセスする場合にはこれで動作すると思います。

### 他のホスティングサービスを使っている場合

他のホスティングサービスを使っている場合には上記の対応に追加して[ログイン ヘルパー コードを自社ドメイン内でホストする](https://firebase.google.com/docs/auth/web/redirect-best-practices?hl=ja#self-host-helper-code)が必要になります。

といってもこの対応自体は簡単で、ログインヘルパーコードはパブリックなものなのでそれをカスタムドメインにホストするだけです。

`public/__/auth`と`public/__/firebase`のディレクトリを作成し、

```zsh
https://<project>.firebaseapp.com/__/auth/handler
https://<project>.firebaseapp.com/__/auth/handler.js
https://<project>.firebaseapp.com/__/auth/experiments.js
https://<project>.firebaseapp.com/__/auth/iframe
https://<project>.firebaseapp.com/__/auth/iframe.js
https://<project>.firebaseapp.com/__/firebase/init.json
```

これらのファイルをダウンロードして配置するだけです。`authDomain`がちゃんと切り替わっていれば、ログインしようとするとカスタムドメインが開き、カスタムドメインを経由して認証が実行されます。

この場合、ホスティングしているオリジンと認証用のオリジンが同じのためIsolatedであることは問題になりません。