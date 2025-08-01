---
title: ラッシュにおける割り込み効果を調べてみる
date: 2021-01-24
description: ラッシュにおける割り込み効果の検証やキンシャケ出現数を増やす方法について解説します
tags: [Splatoon2, Salmon Run]
authors: ['tkgstrator']
---

## 割り込み効果

ラッシュイベントは本来であればキンシャケは最大でも 30 体しか出現しないのだが、タマヒロイを湧かせることでキンシャケが出現するまでの間隔を短くすることができ、結果としてキンシャケ出現数を増やすことができる。

ラッシュにおいてキンシャケ出現数を増やす方向に働く効果はこの割り込みしか存在しないので、ラッシュで如何に稼ぐかというのはとどのつまりはどうやれば効率的にタマヒロイを割り込ませることができるかという問題に帰結するわけである。

## 検証の困難性

とはいうものの、ラッシュでいくつ金イクラを放置してタマヒロイを割り込ませればいいのかというのは非常に難しい問題である。

というのも「どういう状況であれば割り込みが発生するのか」ということが全く分かっていないためである。さらに言えば、一定の個数の金イクラを放置し続けないといけないということはキンシャケをたおしたときに発生する金イクラを 0 にしなければいけません。

キンシャケは他のオオモノシャケと違って 1 × 3 の金イクラをドロップするため、普段使っているパッチではドロップ個数を 0 にすることはできません、困った。

そこで今回はキンシャケのドロップ個数を変えるのではなく、フィールドに存在できる金イクラの数自体に制限をかけて、それ以上ドロップしないようにしました。本来、この値は 96 で普通に遊んでいる限りは絶対に上限に引っかからないのですが、その数値を敢えて低く設定しようというわけです。

## 検証してみた

検証の方法としては、金イクラを N 個フィールドに放置したまま超広範囲の効果時間が極めて長いジェットパックのジェットでリスキルをするという方法を試みた。

この手法の良いところはジェットパック状態であればシャケの攻撃を全く受けず、ジェットでシャケを攻撃するためにプレイヤーが操作する必要がなく、何度やってもほとんど同じ環境をつくることができる点である。

また、100 秒という短い時間では今回のような確率を伴うデータを正しく検証できないと考え、1WAVE の長さを 600 秒にすることでサンプルを平坦化した。

### 潮位とイベントの制御

イベントは SeedHack を使って WAVE1 が満潮ラッシュとなるような WAVE を厳選した。

```
// SeedHack [tkgling]
@disabled
00208C74 C07280D2
```

潮位に関してはこれも同じようにシード厳選をしても良かったのだが、完全に同一の条件にしたかったため Starlight の Realtime EventChanger を使って強制的に潮位を切り替えた。

### 時間変更

100 秒では割り込みの成否の運に左右されすぎるので、1WAVE あたりの長さを 6 倍の 600 秒として運の要素を可能な限り下げた。

```
// Change WaveTotalFrame [tkgling]
@disabled
005975F8 00949152
```

### 無操作切断チェック

スプラトゥーンでは 60 秒間の無操作が続くと、強制的に通信が切断されてしまうためそれらを無効化するパッチを当てました。

```
// Disable MovelessPlayerChecker [tkgling]
@disabled
00DD5F14 09C28152
```

### 湧き方向固定化

Starlight からも固定化はできるのだが、めんどくさかったのでファイルを作成して RomFS で対応することにした。

`Coop_levels.bprm`内の`76f4783c`の値を 1 に変更することで湧き方向を固定化することができる。

### ジェットパックのパラメータ変更

以下のように設定し、実質的な無限ジェッパとジェットパックのジェットによるリスキルを行った。

| パラメータ |   値   |
| :--------: | :----: |
|  111ebbaf  |  100   |
|  22d7439b  |   18   |
|  35580034  | 300000 |
|  7dc0fbab  | 300000 |
|  b52074db  | 300000 |
|  f8cd525c  |  600   |

## 予想される理論値

ラッシュのパラメータは完全解析できているので、600 秒あれば 30 × 6 = 180 体のキンシャケが出現しなければいけない。

タマヒロイは 213F に一回リスポーンするはずなので、600 秒（36000F）最適なリスキルができていれば放置してある金イクラの数 × 169 体のタマヒロイが湧くはずである。

今回は、満潮のラッシュが何故か稼げないことで有名なトキシラズいぶし工房に絞って検証を行った。

### 通常潮位の場合

|  NT  | Goldie | Snatcher | Power Eggs |
| :--: | :----: | :------: | :--------: |
| N=0  |  178   |    0     |   20299    |
| N=1  |  178   |   136    |   21105    |
| N=5  |  175   |   672    |   24289    |
| N=10 |  192   |   1344   |   28555    |
| N=15 |  190   |   1983   |   32338    |
| N=19 |  157   |   2524   |   35125    |

タマヒロイを湧かせない場合はほぼ理論値の 178 体のキンシャケをたおすことができた。また、足りない 2 体についても 1 体はこちらに向かってきていたが削りきれず、もう 1 体は出現した瞬間にタイムアップとなるので実質 180 体全ての位置は把握できた格好になる。

N=1 ではキンシャケ撃破数こそ同じものの出現ペースは少し遅いように感じた。N=5 になると「ここはキンシャケがでていないな」という間を感じる場面もあった。結果も 175 と、3 体少ないものとなってしまった。

このまま減っていくかと思われたが、なんと N=10 のケースで 192 体出現という、意外すぎる結果を得た。N=15 のときは 100 秒時点では 34 体出現という超ハイペースだったが、上振れだったのか後半は虚無の時間が目立ち、最終的には 190 体出現にとどまった。

## 結果からわかること

ここで注意していただきたいのは、今回の結果がすなわち「金イクラは残せば残すだけ良い」ということにはならないということである、何故か？

というのも、このタマヒロイの割り込みによる効果は「金イクラを放置した数」ではなく「タマヒロイをたおすペース」に依存しているからだ。実際のプレイでは無限ジェッパのようにタマヒロイを極めて効率的にリスキルすることは不可能である。

今回の結果からわかることは 600 秒で 1344 体のタマヒロイをたおすペース（100 秒で 224 体）であれば、600 秒で 12 体のキンシャケを得することを期待しても良さそうだということである。

### 現実的な値に変換してみる

狙い目となるのは N=10 を実際のプレイで再現することである。

N=9 とか N=11 でもっと良い結果が得られるかもしれないが、今回は N=10 を再現することを目標とする。

|  NT  | Goldie | Snatcher | Power Eggs |
| :--: | :----: | :------: | :--------: |
| N=10 |   32   |   224    |    4759    |

ここでまず注目すべきは赤イクラ数 4759 である。87 納品のときでさえ 3469 しか赤イクラを稼げなかったのにこれよりも更に 1300 も稼がなくてはいけないことになる。赤イクラを稼ぐことが目的ではないといえ、かなり稼ぐプレイが求められるのは間違いない。

では、どうすればタマヒロイを 224 回たおすことができるかということだが、仮に出現してから 1 秒でタマヒロイをたおせる環境だったとしよう。すると本来 213F でリスポーンするタマヒロイが平均して 273F で再湧きするわけである。

ラッシュの最初のキンシャケがきて撃破し、金イクラをドロップさせるまでに 10 秒かかるとすると、実際にタマヒロイをリスキルできるのは残りの 90 秒ということになる。

![](https://pbs.twimg.com/media/EsdcB-nU0AA1RXj?format=png)

そこでタマヒロイをたおすまでの要フレームと放置すべき金イクラの数をグラフにしたものが上のものになる。

ここから「ジェットパックのリスキルでも平均して 25F 程度はかかっていそう」ということがわかる。実際にはこれよりももっともっと時間がかかるので 60F 以上と考えても問題なさそうだ。となると、11 ~ 12 個放置しておくというのが良さそうだということになる。

体感的にはもっと少ないほうが上手く割り込みさせられていた気がするので、これは意外な結果になりました。次回やるときは、このくらい放置するのを実際に試してみたいと思います。

記事は以上。
