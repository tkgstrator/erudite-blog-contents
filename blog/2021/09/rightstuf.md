---
title: 北米版のBD販売情報を取得しよう
date: 2021-09-07
description: 北米版BDを扱う最大手のサイトであるRightStufのデータを取得するプログラムを書きました
tags: [Python]
authors: ['tkgstrator']
---

# 北米版 BD

北米版 BD とは正規にライセンスされた企業が、北米（主にアメリカとカナダ）向けに販売する日本アニメの英語字幕付きの BD のこと。

日本語版との違いは以下の通り。

- 梱包が非常に簡素
  - 特典映像とかは基本ない（一部の Limited Edition を除く）
  - NCOP, NCED だけは絶対ついている
- ディスク 1 枚に 6 または 12 話収録されている
  - 日本版は 2, 3 話なのを考えると倍以上
- 基本は BOX として売られている
  - 相当長編でもない限り上下巻で完結する
- 無駄なものが全くないのでとても安い

たとえばゆゆ式の[国内版](https://www.amazon.co.jp/dp/B01321DZ28)は約 19000 円もするが[北米版](https://www.amazon.co.jp/dp/B00JXBLMKO)であれば輸入品（これは輸入手数料などで個人で買うよりも相当高くなっている）であっても 3000 円で買えてしまう。

国内版の豪華な特典などに興味がないのであれば、北米版を買ったほうがスペースは取らないし、たくさん買えるしでいいことづくめなのである。



## 北米版のデメリット

北米版にももちろんデメリットはある。

それがリージョンコードとは別にかけられた「国コード制限」というものであり、カナダまたはアメリカ以外のレコーダーで再生しようとした場合にプログラム的に再生にロックがかかってしまう。

つまり、視聴することができないのだ。

じゃあ意味ないじゃないかと思うかもしれないが、これには回避法がある。この国コード制限に引っかかるのは一般のブルーレイレコーダであり、PS3, PS4, PS5 のようなリージョンに依存しないレコーダであれば設定から国コードを変更することで再生することができる。

デメリットはこれだけである。

## 北米版ライセンス会社

では、早速北米版の情報を手に入れることを考えよう。

北米版は日本の BD が全巻発売されたタイミングくらいででアメリカの企業がライセンスを取得し、それを公式サイトで発表するというのが主な流れになっている。

日本の作品のライセンスを取得している企業は複数あるが、有名なのは以下の四つ。

### Aniplex USA

廉価であることが特徴の北米版ですが、ここの作品は高い（それでも国内版の半額以下ですが）です。

その代わり、吹き替えが豪華だったり、特典が国内版並みについてきたりします。

ここのライセンスとして有名なものに、化物語、ソードアート・オンライン、俺の妹がこんなに可愛いわけがない、凪のあすからなどがあります。

::: warning Aniplex USA について

ここの作品は Amazon ではほとんど取り扱っていません。というのも、ライセンス上 Aniplex USA の作品は日本への発送が禁止されているからです。

Right Stuf ではここの作品を取り扱っていますが、日本へ発送しようとすると「この商品はライセンス上、日本には発送できない」と断られてしまいます。

:::

### Sentai Filmworks

ニッチな作品のライセンスを取得することで有名でここがライセンスを取得したアニメにはゆゆ式、たまこまーけっと、特例措置団体ステラ女学院 C3 などがあります。自分はここの作品を買うことが多いです。

### Funimation

老舗企業で、一度 BOX を発売した二年後くらいに突然上下巻セットの`Complete`や`Essentials`と名付けられた廉価版を販売することで有名です。

::: tip 氷菓

最初は上下巻別でそれぞれ 30 ドルくらいで販売されていたのが、一年後くらいに`Complete`版として 70 ドルで上下巻セットが発売され、その後`Essentials`として 35 ドルで販売されました。

:::

### NIS America

ここがライセンスした作品は北米 Amazon ではなく Right Stuf という通販サイトを通して販売されます。

なので Amazon ばかり見ているとここの作品を見逃しがちになります。ただ、最近では普通に Amazon で販売していることもあります。

### その他

で、記事を書いている段階ではこの四社だけ抑えておけばいいだろとか思っていたのですが、調べてみると有名作品をライセンスしている他の会社が見つかったのでそれもご紹介。

#### SHOUT FACTORY

リズと青い鳥、聲の形、響けユーフォニアムなどをライセンスしている会社です。

ただ、深夜アニメでないよくわからない作品もライセンスしていたりします。

## データを取得する

Amazon から取得してもよいのですが、どうせ Amazon は API などを用意していないので RightStuf の情報を使います。

RightStuf には商品情報取得用の非公開 API である`https://www.rightstufanime.com/api/items`があるのでそれを利用します。

この API に対してクエリパラメータを投げてやれば JSON でデータが返ってきます。先程挙げた五社のブルーレイ作品の情報を取得するには、

```python
params = {
    "c": "546372",
    "country": "US",
    "currency": "USD",
    "custitem_rs_web_class": "Blu-ray",
    "language": "en",
    "fieldset": "details",
    "custitem_rs_publisher": "NIS-AMERICA,ANIPLEX-OF-AMERICA,FUNIMATION,SENTAI-FILMWORKS,SHOUT-FACTORY",
    "limit": limit, #同時取得数 1-100を指定
    "offset": offset #オフセット
}
```

のようなクエリをつければよいです。1-100 番目の情報がほしければ limit=100, offset=0 にし、101-200 番目の情報がほしければ limit=100, offset=100 にすればよいというわけです。

で、そのような Python コードを書いて走らせてみました。API 自体は重いのですが件数もしれているので五分もあれば全データが取れます。

![](https://pbs.twimg.com/media/E-q-ojnVkAAABZ6?format=png&name=4096x4096)

返り値は JSON なのでそのまま JSON として保存しても良かったのですが、今回は単に CSV として保存しました。

### MD に変換

さて、このままだと見てもさっぱりなので CSV を MD に変換して VitePress でブラウザから閲覧できるようにしましょう。

CSV を読み込む Vue コンポーネントをつくっても良かったのですが、めんどくさかったので今回は Python で CSV を MD に変換するコードを書きました。

```python
f.write(f"### [{product.title}](https://www.rightstufanime.com/{product.productId})\n\n")
f.write(f"![]({product.productImageURL})\n\n")
f.write(f"| 製品情報 | 内容 |\n")
f.write(f"| :------: | :--: |\n")
f.write(f"| 言語     | {', '.join(product.spokenLanguages)} |\n")
f.write(f"| 字幕     | {', '.join(product.subtitleLanguages)} |\n")
f.write(f"| 収録時間 | {product.runtime}mins |\n")
f.write(f"| 放送年   | {product.created} |\n")
f.write(f"| 販売元   | {product.publisher} |\n")
f.write(f"| 価格     | ${product.price} |\n\n")
```

行数も知れてるので超適当に書いたんですけど、Markdown を簡単に出力できるライブラリありますかね？

あとはこれを Netlify と連携して、デプロイしてくれるようにすれば終了です。

## 完成したもの

完成したのがこの[北米版 BD 販売予定リスト](https://rightstuf-release.netlify.app/)で、とりあえず今は 2021/09/07 以降に発売される BD を表示しています。

ただ、画像なんか要らないからパッと一覧で見たいという人もいると思うので将来的に切り替えられるようにしようと想います。

販売元ごとにフィルタリングなどができてもいいかもしれませんね、これは次回への宿題ということにします。

### 今後の展望

#### 自動化

GitHub Actions を使って一日に二回くらい自動で更新するようにする

> VitePress のビルドはとても早いので GitHub Actions の無料利用分を使い切らないはず

#### 一覧化

今はただズラーッと並んでいるだけでダサいので修正予定

#### JSON 化

Vue コンポーネントから読み込むのであれば絶対に JSON を利用したほうが良いので JSON に対応予定

記事は以上。


