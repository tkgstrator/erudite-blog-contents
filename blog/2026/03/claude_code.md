---
title: Dev ContainerでClaude Codeを使う 
date: 2026-03-20
description: コンテナ内でClaude Codeを使うとちょっとめんどくさかったので解決法についてまとめる 
tags: [Docker, Dev Container, Claude Code, VSCode]
authors: ['tkgstrator']
---

## 背景

Dev Container内でClaude Codeを使うと、コンテナをビルドするたびに認証が求められてめんどくさい。

それを解消するための方法です。ひょっとしたらCodexも似たような方法で対応できるかも知れません。

### 対応

```json
{
  "remoteEnv": {
    "CLOUDFLARE_API_TOKEN": "${localEnv:CLOUDFLARE_API_TOKEN}",
    "CLOUDFLARE_ACCOUNT_ID": "${localEnv:CLOUDFLARE_ACCOUNT_ID}",
    "WAKATIME_API_KEY": "${localEnv:WAKATIME_API_KEY}"
  },
  "containerEnv": {
    "CLAUDE_CONFIG_DIR": "/home/vscode/.claude"
  },
  "mounts": [
    "source=${env:HOME}/.ssh,target=/home/vscode/.ssh,type=bind,consistency=cached,readonly",
    "source=${env:HOME}/.aws,target=/home/vscode/.aws,type=bind,consistency=cached,readonly",
    "source=${env:HOME}/.claude,target=/home/vscode/.claude,type=bind,consistency=cached"
  ]
}
```

必要な設定は`CLAUDE_CONFIG_DIR`とボリュームマウントでホストマシンと`.claude`のディレクトリを共有することです。キャッシュにしているのでホストかコンテナ、どちらか一方でログインすればログイン情報が保存されます。

ディレクトリを指定しておかないと、ログインしているはずなのにリセットされてしまうという現象が発生したので、多分これは必須です。

### 設定ファイル

