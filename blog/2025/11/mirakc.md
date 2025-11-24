---
title: TVサーバーを立て直したら動作しなくなった件
date: 2025-11-24
description: TVチューナーをパソコンに取り付けたのですが 
tags: [mirakc, epgstation, konomitv]
authors: ['tkgstrator']
---

## 背景

引っ越し前は地デジ・BS・CSの全てのチャンネルが見れていた（BS・CSに関しては有料放送は未契約）

無料放送は全部見れていたので、便利だった。

引っ越し先だと何故か地デジが全く見れず、EPGにも何も表示されない。

せっかくなので再構成してみることにした

### 必要なもの

- [SCR3310](https://www.amazon.co.jp/dp/B0085H4YZC)
- [B-CAS](https://www.amazon.co.jp/dp/B0CDS1J5R3)
- [PX-S1UD](https://www.amazon.co.jp/dp/B0141NFWSG)

> B-CASカードって本来単品で売ってよいのか、という疑問は残る

### 環境構築

- Ubuntu 24.04.3
- [ISDBSCanner](https://github.com/tsukumijima/ISDBScanner)

```zsh
 lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.3 LTS
Release:        24.04
Codename:       noble
```

ISDBScannerは、`recisdb`のインストールが必須なのでまずはインストールします。

```zsh
wget https://github.com/kazuki0824/recisdb-rs/releases/download/1.2.3/recisdb_1.2.3-1_amd64.deb
sudo apt install ./recisdb_1.2.3-1_amd64.deb
rm ./recisdb_1.2.3-1_amd64.deb
```

```zsh
$ recisdb --version
recisdb 1.2.3
```

コマンドを叩いてバージョンが表示されたらOKです。

