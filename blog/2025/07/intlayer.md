---
title: 翻訳するならIntLayerがいいっていう話
date: 2025-07-29
description: 今まで翻訳で消耗してたのは何だったのか
tags: [i18n, IntLayer, Vite, React]
authors: ['tkgstrator']
---

## IntLayer

> 保守性と拡張性に重点を置いた国際化（i18n）ソリューション

とのこと。ウェブサイトを多言語対応にするのであればi18n-nextなどが有名だが、導入がちょっとめんどくさかったりJSONでしか翻訳に対応していなかったり不満がありました。

それに対してIntLayerはVite, React, Next等の主要なフレームワークに対応しつつ、TypeScriptで翻訳の定義を書ける上にTypeScriptのTypeSafeな最大にして最強のメリットを享受できるという強みがあります。

それならもう使ってみるしかないって話です。

### 導入

[公式サイトの導入手順](https://intlayer.org/ja/doc/environment/vite-and-react)をそのままなぞるだけで動きます。

特別なことは一切必要ありません。

面白いのが通常の翻訳とは違う書き方ができるところです。

```ts
import { cond, type Dictionary } from "intlayer";

const myConditionalContent = {
  key: "my_key",
  content: {
    myCondition: cond({
      true: "条件がtrueの場合のコンテンツ",
      false: "条件がfalseの場合のコンテンツ",
      fallback: "条件が失敗した場合のコンテンツ", // オプション
    }),
  },
} satisfies Dictionary;

export default myConditionalContent;
```

公式サイトにもありますが、このようにbooleanで分岐させることができます。

```ts
import { insert, type Dictionary } from "intlayer";

const myInsertionContent = {
  key: "my_key",
  content: {
    myInsertion: insert(
      "こんにちは、私の名前は{{name}}で、年齢は{{age}}歳です！"
    ),
  },
} satisfies Dictionary;

export default myInsertionContent;
```

変数展開する場合はこのように書けます。

```ts
import { insert, t, type Dictionary } from "intlayer";

const myInsertionContent = {
  key: "my_key",
  content: {
    myInsertion: insert(t({
      ja: "こんにちは、私の名前は{{name}}で、年齢は{{age}}歳です！",
      en: "Hello, I'm {{name}}, age of {{ age }}!"
    })),
  },
} satisfies Dictionary;

export default myInsertionContent;
```

もし英語にも翻訳したい場合には`t`を`insert`の内部に入れます。

これを利用する場合には、

`content.myInsertion({ name: 'Me', age: '16' })`という感じで使います。文字列を取得した場合には最後に`.value`をつけます。

TypeSafeなので変数の洩れがあった場合にはtscがエラーを返してビルドに失敗します。

## まとめ

いや、これみんな使おう。
