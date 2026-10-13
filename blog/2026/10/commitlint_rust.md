---
title: Rust製のcommitlintと、コミットを見張るツールを作りました
date: 2026-10-13
description: Node.js不要で動くcommitlint互換のリンターと、AIエージェントが書いたコミットを見張るツールを作りました
tags: [Rust, Git, GitHub]
authors: ['tkgstrator']
---

## commitlint-rust

https://github.com/tkgstrator/commitlint-rust

commitlintはコミットメッセージがConventional Commitsに沿っているかを検査するツールです。本家はNode.jsで動くので、検査するためだけにNodeを入れておく必要があります。

それをRustで書き直して、単体のバイナリとして動くようにしました。

対応しているのはLinux(muslで静的リンク)とmacOSで、どちらもx86_64とARM64です。Windowsは対応していません。

ただし、macOSのIntel向けはクロスビルドしただけで、実機での動作確認はできてません。めんどくさいからとかじゃないですよ、本当です。

### 本家との違い

一番の違いは、実行にNodeもBunの依存関係が要らないことです。コンテナやCIのイメージにNodeを足さなくても、バイナリを置くだけで動きます。

ついでに起動時間も測ってみました。`fix: ok` を標準入力に流して、本家は20回、Rust版は200回の平均を取っています。

| | 本家 | commitlint-rust |
| --- | --- | --- |
| バージョン | @commitlint/cli 21.2.3 + config-conventional | v0.3.0 |
| 1回あたり | 約207ms | 約1.5ms |
| サイズ | node_modules 60MB | バイナリ 約2.4MB |

100倍以上速いのですが、人間が手でコミットする分には200msでも気になりません。ただ、フックから毎回呼ぶ場合やCIで履歴をまとめて検査する場合には、効いてくるかもしれません。

なお、これは起動時間だけの比較です。本家の `config-conventional` は `header-max-length` が100文字で、Rust版は設定ファイルがなければ後述の固定ポリシーで動くので、検査している内容は同じではありません。

v0.3.0で設定ファイルに対応しましたが、起動時間はv0.2.0と変わりませんでした(同じ環境で測って、どちらも約1.4〜1.5ms)。一方でバイナリはLinux ARM64で約1.4MBから約2.4MBに増えています。

### 固定ポリシー

設定ファイルなしで動かすと、検査内容は固定です。

- Conventional Commitsの形式(type、scope、subject)
- メッセージ全体で128文字以内(本文とトレーラーも含む)
- 印字可能なASCIIだけで、改行はLF

つまり日本語のコミットメッセージは書けません。コミットメッセージを日本語で書くこと、ありますか？ないですよね（強めの主張

```bash
$ printf 'feat: 取得処理にリトライを追加' | commitlint
commitlint: message requires English printable ASCII and LF line endings

$ printf 'update: tweak things' | commitlint
commitlint: unsupported or non-lowercase Conventional Commit type

$ printf 'fix: correct parsing.' | commitlint
commitlint: subject must not end with a full stop

$ printf 'fix: Correct parsing' | commitlint
commitlint: subject must not use sentence/start/pascal/upper case
```

全体で128文字というのが地味に効いていて、`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` というトレーラー(trailer)だけで55文字使います。単体の `commitlint` は今もトレーラーを含めた全体で数えるので、これを付けると、typeとsubjectと本文に使えるのは70文字ほどしか残りません。

v0.3.0では、後述する `commitguard` のほうだけ、最後のトレーラー段落にある正しい形式の `Co-Authored-By` を128文字に数えなくなりました(区切りの空行も数えません)。トレーラー込みで155文字になるメッセージで試すと、`commitlint` は弾いて、`commitguard message` は通しました。v0.2.0の `commitguard` は同じメッセージを弾きます。

ただし、ASCIIとAIクレジットの検査は元のメッセージ全体にかかりますし、`Signed-off-by` などほかのトレーラーは今まで通り数えます。

### 設定ファイル

v0.3.0から設定ファイルが使えるようになりました。v0.2.0の `--config` は `unsupported commitlint options` で弾かれていたものです。

形式はJSONかYAMLで、本家の38ルールすべてを設定できます。

```json
{
  "extends": ["@commitlint/config-conventional"],
  "defaultIgnores": false,
  "rules": {
    "header-max-length": [2, "always", 128]
  }
}
```

```yaml
extends:
  - '@commitlint/config-conventional'
rules:
  header-max-length: [2, always, 128]
```

`--config FILE` で明示的に指定するか、指定しなければカレントディレクトリから親ディレクトリへ向かって `.commitlintrc.json`、`.commitlintrc.yaml`、`.commitlintrc.yml` を探します。一番近いディレクトリのものが使われ、同じディレクトリに複数あるときはJSON、YAML、YMLの順です。

```bash
$ cat .commitlintrc.yaml
extends:
  - '@commitlint/config-conventional'
rules:
  header-max-length: [2, always, 20]

$ printf 'fix: this subject is a bit longer than twenty chars' | commitlint
Error header-max-length: header must not be longer than 20 characters, current length is 51
commitlint: commit message does not satisfy configured rules
```

注意したいのは、設定ファイルが見つかると、前述の固定ポリシーが丸ごと外れることです。ASCII限定も、全体で128文字という制限もなくなって、日本語のメッセージも通ります。親ディレクトリまで探しにいくので、知らないうちに上の階層の設定が効いている、ということもありえます。

なお、`commitguard` はリポジトリの設定ファイルを読まないので、こちらの検査は変わりません。

JavaScriptの設定ファイルやプラグインには、今回も対応していません。ただし、黙って無視するのではなくエラーで拒否します。

```bash
$ commitlint --config commitlint.config.js
commitlint: unsupported commitlint options: JavaScript configuration requires the upstream runtime; use native JSON or YAML
```

「対応していないものを、対応しているふりをしない」というのがこのレポジトリの方針です。

### 本家との一致

本家のcommitlint 21.2.3を実際に動かして期待値を作り、Rust版の結果と突き合わせるテストを用意しています。固定ポリシーでは221ケース、ルール全体では532件のテストを突き合わせています。v0.3.0で増えた設定ファイルの読み込みも、本家のローダーを動かした111ケースと照らし合わせています。

本家を呼ぶのはテストの生成時だけで、配布するバイナリからは呼びません。

## commitguard

同じレポジトリに、もう一つクレートが入っています。コミットメッセージの検査と、Gitの名義の検査は別の責務なので、独立したコマンドに分けました。

`commitguard` は、Gitのフックとして次のことをします。

- コミットのAuthorとCommitterが、`gh` でログインしている人間のgithub.comアカウントと一致するか
- AIのクレジット(`Co-authored-by` や `AI-credit: Codex`)は、認識できるものだけ許可する
- pushするときは、実際のpush先に送られる全コミットを検査する

つまり、BotやAIエージェントが勝手な名前でコミットしたり、pushしたりするのを止められます。メッセージの検査は `commitlint-rust` を内蔵しているので、`commitlint` を別に入れる必要はありません。

v0.3.0からは、普段のチェックでGitHubのAPIを呼ばなくなりました。`commitguard --strict account` で一度オンライン認証をすると、ghの認証情報などに紐づいたキャッシュができて、あとはそれを使います。スタブのghで数えてみたところ、v0.2.0は3回チェックして3回APIを呼び、v0.3.0は最初の1回だけでした。

その代わり、キャッシュがなかったり、認証情報が変わったりしていると、チェックは通らずに拒否されます。pushと `fix --apply` はキャッシュを使わず、毎回オンラインで確認します。サーバー側でトークンが失効しても、次に `--strict` を使うまでは気づけません。

また、GitHubが作って公開済みのマージコミットやsquashコミットは、エージェントが修正したり承認を求めたりせずに、そのまま残す手順になりました。ただし、pushのときの検査が外れるわけではありません。

ただし、これはローカル環境での簡易的なチェックであって、強制力のある仕組みではありません。絶対パスで `/usr/bin/git` を叩かれると素通りしますし、GitHubのAPIで直接書き込まれる場合も対象外です。READMEにもそう書いています。

### fix

ルールを後から入れると、既存のコミットが引っかかります。それを直すのが `commitguard fix` です。

```bash
commitguard fix --range origin/main..HEAD --plan ../fixes.json
# fixes.json の message を編集する(plan_id と source_oid は触らない)
commitguard fix --preview ../fixes.json
commitguard fix --apply ../fixes.json
```

`fix` はやり直したいメッセージをJSONに書き出すだけで、LLMを呼んだりメッセージを自動で切り詰めたりはしません。JSONは自分で直しても、LLMに直させても構いません。

その代わり、適用には条件があります。

- ghでオンライン認証できていて、Gitが2.38以上であること
- まだpushしていない、直線の履歴であること
- 作業ツリーがクリーンで、detached HEADではなくブランチ上にいること
- バックアップのrefを残し、ツリーが元と同じであることを確認する
- pushは絶対にしない

大量のコミットをまとめて書き換える `bulk-write` もあります。`AI-credit: Claude Opus 5.5 x141` のように、同じクレジットが何回もあるときは回数を付けて1行にまとめられます。

`fix` と `bulk-write` は、v0.2.0のバイナリには入っておらず、v0.3.0から使えます。

## インストール

```bash
curl -fsSL https://github.com/tkgstrator/commitlint-rust/releases/latest/download/install.sh | bash
```

Gitとログイン済みの `gh` があれば入ります。ただし、ユーザーのGit設定とエージェントの指示ファイルを書き換えるので、気をつけて下さい。

Homebrewでも入ります。`commitlint` だけ欲しいなら、`commitguard` の行は要りません。

```bash
brew tap tkgstrator/commitlint-rust https://github.com/tkgstrator/commitlint-rust
brew install tkgstrator/commitlint-rust/commitlint
brew install tkgstrator/commitlint-rust/commitguard
commitguard install
```

Homebrewでインストールしただけでは `commitguard` は有効になりません。最後の `commitguard install` を実行して、はじめてGitのフックなどが設定されます。

Dev Container Featureも用意しました。

```json
{
  "features": {
    "ghcr.io/tkgstrator/commitguard:1": {}
  }
}
```

こちらはDebianかUbuntuのイメージが前提で、リンタは `commitlint-rust` という名前で入ります。npmの `commitlint` とコマンド名がぶつからないようにするためです。

注意点が一つあって、コンテナの起動時に有効化が済むまでは、普通のGitがすべてエラーになります。`gh auth login` をしていないとコミットもpushもできません。

## 作り方

計画のレビューとRustへの分割実装、それから差分のレビューはClaude Codeに任せました。Claude Codeの環境にはCargoがなかったので、ネイティブのテストとビルドはCodexにやらせています。コミットのトレーラーにも `Co-authored-by: Claude` や `AI-credit: Codex` が並んでいます。

応答が返ってこなかったレビューについては、レビューをしたとは主張せず、その旨をVERIFICATION.mdにそのまま書き残しました。

## まとめ

本家のcommitlintをRustで書き直して、おまけにコミットの名義を見張るツールも付きました。

AIエージェントにコミットを任せる機会が増えたので、メッセージの形式と名義をツール側で縛れるのは安心感があります。

記事は以上。
