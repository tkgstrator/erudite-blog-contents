---
title: WakaTimeを自動で設定して欲しい件
date: 2025-11-19
description: コンテナを立ち上げるたびにAPIを訊かれるのを何とかする 
tags: [WakaTime, Dev Container, VSCode]
authors: ['tkgstrator']
---

## 背景

[WakaTime](https://wakatime.com/)という、自分がどれだけどの作業をしているかを集計してくれるサービスがあります。

無料でもそこそこ使えて便利なのですが、ずっとローカルマシンで開発するならローカル設定しておけばいいのですが、コンテナで開発する場合にはコンテナ側にもWakaTimeの拡張機能をインストールしておく必要があります。

> ローカルに入れておいて、ローカルから立ち上げればいいという話ではないっぽい（わからない

で、そうするとコンテナを立ち上げ直すたびに環境変数のデータがとぶので`devcontainer.json`を編集するとAPIキーを再入力する必要が生じます。

これはめんどくさい。

### 対応

```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "WakaTime.vscode-wakatime"
      ],
    }
  },
  "remoteEnv": {
    "WAKATIME_API_KEY": "${localEnv:WAKATIME_API_KEY}"
  },
}
```

`.devcontainer/devcontainer.json`に`WakaTime.vscode-wakatime`を指定して、立ち上げ時に自動でインストールされるようにします。

また`remoteEnv`を設定してコンテナ内の環境変数`WAKATIME_API_KEY`にローカルの環境変数`WAKATIME_API_KEY`が配置されるようにします

こうすることで、自動で環境変数が渡るようになります。

```zsh
$ vi ~/.zshrc
```

最後に、ローカルでターミナルを立ち上げたときに自動で環境変数を読み込むようにします。

APIキーは[ここ](https://wakatime.com/settings/account)にあるのでアカウントを作成しておきましょう。

```zsh
export WAKATIME_API_KEY="xxxxxxxxxxxxxxxx"
```

こういう内容を追記したら保存して、

```zsh
$ source ~/.zshrc
$ printenv | grep WAKA
WAKATIME_API_KEY=xxxxxxxxxxxxxxxx
```

と表示されたら成功です。

> `source ~/.zshrc`をしないと再読込されないので注意。

このあとVSCodeを再起動するとこの設定が読み込まれます。それを忘れてコンテナを立ち上げ直して、環境変数が何も渡っていなくて困惑していたのはここだけの秘密です。

## まとめ

WakaTimeに限らず、自分が何をやっているかをチェックしてちゃんとデータとして出してくれるのは、自分の性格的に振り返りができていい感じです。

GitHubの方で上手いこと設定しておけば[プロフィール](https://github.com/tkgstrator)でどれだけ作業がしたかがわかります。

記事は以上。