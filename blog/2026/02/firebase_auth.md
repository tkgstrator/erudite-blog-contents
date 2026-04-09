---
title: Docker環境でFirebase Authを利用する 
date: 2026-02-21
description: SSH+Dev ContainersだとFirebase Authが迷子になることがあるのでその備忘録 
tags: [Docker, Firebase]
authors: ['tkgstrator']
---

## 背景

Firebase Authで認証をするときに、いちいちステージングで確認するのがめんどくさいときにローカルでテストしたくなります。

が、Dev Containersで開発しているとブラウザ経由で別のコンテナに対して繋げられないときがあります。

これって困りますよね、では解決方法を考えましょう。

### 解決方法

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - node_modules_cached:/home/vscode/app/node_modules
      - ../:/home/vscode/app:cached
    tty: true
    stdin_open: true

  firebase:
    image: andreysenov/firebase-tools:14.17.0
    environment:
      FIREBASE_TOKEN: $FIREBASE_TOKEN
    command: firebase emulators:start --only auth --import=auth --export-on-exit=auth
    volumes:
      - ./auth:/home/node/auth
      - ./firebase.json:/home/node/firebase.json
      - ./.firebaserc:/home/node/.firebaserc

volumes:
  node_modules:
```

というわけでこういう感じで`.devcontainer/compose.yaml`を作成します。

```json
{
  "forwardPorts": [5173, 9099, 4000],
}
```

更に`.devcontainer/devcontainer.json`に上のようにポートフォワードを明記します。

こうすると**Firebase -> App -> Browser**という感じで接続ができるようになり、ブラウザから正常にlocalhost:9099などに繋げられるようになります。

### 構成

```bash
.
├── auth
│   ├── auth_export
│   │   ├── accounts.json
│   │   └── config.json
│   └── firebase-export-metadata.json
├── compose.yaml
├── devcontainer.json
├── Dockerfile
├── firebase.json
├── postAttachCommand.sh
└── postCreateCommand.sh
```

こういう感じでダミーのアカウントを予めファイルとして出力しておけばローカル環境でログインができます。

連携系のOAuthは機能しないっぽいので、ローカルアカウントを使うとよいです。

## まとめ

Firebase Authは何も考えなくていいから楽ですね。

記事は以上。