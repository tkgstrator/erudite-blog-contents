---
title: Cloudflare R2を削除する話 
date: 2025-08-03
description: S3なら消そうと思ったらすぐ消せるのに、R2はありがたい保護機能がついています
tags: [Cloudflare, R2, S3]
authors: ['tkgstrator']
---

## 背景

昔作ったR2 Object Storageを消そうと思ったら、ファイルがあるとディレクトリから消せません。

それでは困るので、コマンドを使って消せるようにします。

このとき、AWS CLIがあれば簡単に消せます。速度的にはs3cmdとかの方が速い気がしますが、とりあえず今回はAWS CLIを使います。

### 必要なもの

```zsh
home/
└── [USER]/
    └── .aws/
        ├── credentials
        └── config
```

ホームディレクトリ以下に`credentials`と`config`が必要になります。

```zsh
[r2]
aws_access_key_id = 
aws_secret_access_key = 
```

`credentials`はこんな感じでプロファイル名`r2`に対してキーを設定します。

```zsh
[profile r2]
output = json
endpoint_url = https://2488ea57494b2dacae95a6e363e7dcb2.r2.cloudflarestorage.com
region = auto
```

`config`ではエンドポイントとしてCloudflare R2を利用することを指定します。

### 実行

```zsh
aws s3 rm s3://[BUCKET_NAME] --recursive --profile r2
```

再帰的に指定したバケットの中身を削除するコマンドです。1000件以上データはありましたが、すぐに消せました。

### その他

#### [Sync] R2 -> Local

バケットとローカルのディレクトリを同期したい場合にはこのコマンドを使います。

```zsh
## AWS CLI
aws s3 sync s3://[BUCKET_NAME] ./[DIR_NAME] --profile r2

## s3cdm
s3cmd sync s3://[BUCKET_NAME] ./[DIR_NAME]

```

20000件以上データがあったのですが、結構時間がかかりました。

#### 