---
title: 記事をサブモジュール化する話
date: 2025-07-30
description: 記事を本レポジトリから分割しました
tags: [GitHub, GitHub Actions]
authors: ['tkgstrator']
---

## 記事のサブモジュール化

記事をサブモジュール化することで、本体のフレームワークと記事情報であるマークダウンを完全に分けることができます。

で、気になるのはここで本体をX、記事をYとするとYを更新したときにXの再ビルドが走らないと、

1. Yを更新
2. Yをプッシュ
3. Xのサブモジュールを更新
4. Xをプッシュ
5. XのWorkflowで自動更新

というとんでもなく手間がかかるフローになってしまいます。

これでは困るので、Yを更新したときにXが自動でサブモジュールを更新し、コミットせずにデプロイだけするようにしたいです。

### GitHub Actions

```yaml
name: Notify Main Repository
on:
  push:
    branches:
      - master
      - main
jobs:
  notify:
    runs-on: ubuntu-24.04
    steps:
      - name: Repository Dispatch
        uses: peter-evans/repository-dispatch@v3
        with:
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          repository: tkgstrator/erudite-blog
          event-type: content-updated
```

まず、Yの方に上のようなGitHub Actionsを定義します。

レポジトリは各自合わせてください。このとき、自分が保有しているレポジトリであったとしても`GITHUB_TOKEN`では権限が足りずに通知が送れないので必ず`PERSONAL_ACCESS_TOKEN`を利用してください。

権限自体は`repo`にチェックが入っていれば問題ありません。

```yaml
name: Deploy to Vercel
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
on:
  push:
    branches:
      - develop
      - master
  pull_request:
    branches:
      - develop
      - master
    types: [closed]
  workflow_dispatch:
  repository_dispatch:
    types: [content-updated]
jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: false
          fetch-depth: 0
      - name: Update submodule to latest
        run: |
          git submodule update --init --remote src/content
      - name: Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install Vercel CLI
        run: bun add -g vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Cache bun dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.bun/install/cache
            ${{ github.workspace }}/.next/cache
            ${{ github.workspace }}/node_modules/.cache
          key: ${{ runner.os }}-nextjs-bun-${{ hashFiles('**/bun.lockb') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
          restore-keys: |
            ${{ runner.os }}-nextjs-bun-${{ hashFiles('**/bun.lockb') }}-
      - name: Install dependencies
        run: bun install --ignore-scripts
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: |
          vercel deploy --archive=tgz --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

一方、XのGitHub Actionsには上記のような内容を書きます。

この例ではVercelにコミットする前提ですが、別にVercelでなくても何でも問題ありません。デプロイ前にサブモジュールを最新に更新することと、通知を受け取るようにしておけば動きます。

## まとめ

これで、コンテンツを更新するだけで本体の再ビルドが走り、自動でウェブサイトが更新されることが確認できました。

記事は以上。
