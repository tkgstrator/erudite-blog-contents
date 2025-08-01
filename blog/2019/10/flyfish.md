---
title: 完全版 カタパッド片翼戦法について
date: 2019-10-04
description: サーモンランにおける片翼化は本当に有効なのかをまとめました
tags: [Salmon Run]
authors: ['tkgstrator']
---

## カタパッドの基本性質

まず、カタパッドというオオモノシャケについての知識がないといけません。

プレイヤーから見て「右側が最も近い人」「左側が右側に狙われている人以外からランダム」とよく言われるが、内部的にはそのような記述は見当たらない。

> 大体、このルールだと生存プレイヤーが一人しかいない場合にカタパッドは何を狙うんだ問題が残る

|                  | SakelienCup | SakelienCupTwin  |
| :--------------: | :---------: | :--------------: |
|  ターゲティング  |  パス距離   | ユークリッド距離 |
|        HP        |     160     |       360        |
| 攻撃インターバル |    180F     |       180F       |

内部データによれば右側は最短パス距離のプレイヤーを狙い、左側は最短ユークリッド距離のプレイヤーを狙う、とある。

これが本当なのかどうかを検証するのは簡単なのだが、調べるのもめんどくさいので、まあ今回はランダムだと考える。

> 仮にユークリッド距離だったとして、それをプレイヤーがコントロールし続けるのは無理なのでまあランダムと考えても大差はないとする

### カタパッドの攻撃

カタパッドは片方の射出口から一度に四発のミサイルを発射します。

カタパッドは射出口が二つあるので、一体のカタパッドは無傷であれば一度に八発のミサイルを撃つことになります。

ミサイルは射程が無限で、たおさない限り延々と攻撃され続けるため、同じく射程が無限のタワーと同じく最も厄介なオオモノシャケとして認識されています。

そして、この厄介なカタパッド対策として生まれたのがカタパッド片翼戦法でした。

## 片翼戦法について

カタパッド片翼戦法が生まれたのはトキシラズいぶし工房が解禁された頃でした。トキシラズは 2017 年の年末に実装されているので、片翼戦法自体は五年ほども前の戦法ということになります。

この頃はまだスプラトゥーンがリリースされてから五ヶ月ほどしか経っておらず、プレイヤーの練度も現在と比べてまだまだ未成熟でした。

### 片翼戦法の歴史

どのくらい未成熟だったかというと、今では誰でも知っている「キケン度 MAX は評価合計 2400(平均 600)以上から」「キンシャケ探しの回線手順」「ハコビヤのハイパープレッサー」などの使い方が全く浸透していない時代です。もちろん「カタパッドマップ」なんてものもありません。

> ちなみに、この頃はぼくが初めてキケン度 MAX をクリアして記念にスクショ撮ってたそんなレベルです。

そんなプレイヤーのスキルが未熟な中、生み出されたのが「カタパッド片翼戦法」なのです。当時は全てのオオモノをたおせるほど、プレイヤーが上手ではなかったため、優先度の低いオオモノについては放置せざるを得ませんでした。

そこで、カタパッドの射出口の半分を潰して厄介なカタパッドの脅威レベルを半減させつつ、オオモノ出現数上限三体のロジックを利用して最大 12 発のミサイルに抑える、カタパッド片翼戦法が注目されたわけです。

### 片翼戦法のメリット

Twitter で[片翼カタパ](https://twitter.com/search?q=%E7%89%87%E7%BF%BC%E3%82%AB%E3%82%BF%E3%83%91&src=typed_query&f=live)で検索すると、カタパッド片翼戦法のメリットとして、

1. カタパッドの脅威が半減する
2. 寄せやすいオオモノが出現しやすくなる

という二つが取り上げられていることが多いです。

## 片翼カタパッドの神話を検証する

この二つの理由が正しいなら、カタパッドは片翼放置すべきですが、現状サーモンランで上手いとされている人たちはカタパッドを片翼放置することを無条件に推奨していたりはしません。

となれば、上位勢の考え方が間違っているか、上の二つの理由に考慮されていない欠点があるかのどちらかということになります。

果たしてどちらが正しいのでしょうか？

### 片翼カタパッドは安全である

カタパッド片翼戦法の信仰者に多いのが「片翼カタパッドは安全である」という誤解です。

仮に片翼カタパッドが三体いればとんでくるミサイルの数は 12 発になります。これは無傷のカタパッド(以後、フルカタパとする)二体よりは脅威が少ないですが、決して安全と言えるレベルではありません。

「片翼カタパッドはフルカタパより脅威が少ないが、安全ではない」ということをまずしっかりと理解してください。

つまり、たおす余裕が十分にあるのであれば「たおしてしまったほうがより安全にできる」ということです。

これについては、片翼カタパッドの概念が生まれたであろう 2017 年 11 月の段階で[カタパッド片翼戦法は有効だが、意味もなく残す必要はないかもしれない](https://twitter.com/hatenanWR/status/923018724180770816)ということは言及されています。当時から「意味もなく放置するのは危ないかもしれないよ」と言われているのに、五年も経ってるのに無意味に残そうとするのは立ち回りの選択肢を減らす、もったいない行動です。

### 寄せやすいオオモノが出現しやすくなる

[寄せやすいオオモノが出現しやすくなるのでは](https://twitter.com/SpecialSiber/status/922851291428032512)ということについて(恐らく)初めて触れられたのは 2017 年 10 月末のことです。

これは誤った認識であることは後で述べるのですが、当時はオオモノが何体出現するのかもよくわかっていなかったため、誤った推測をしてしまうのも仕方ありません。というのも、ほぼ一年後となる 2018 年 10 月 3 日までサーモンランのリザルトをイカリング 2 から確認することができなかったからです。

そして 2018 年 10 月 3 日の時点で[オオモノ出現数がノルマ-1 である](https://twitter.com/sato_spla/status/1047443879417413632)であることについては言及されています。これもキケン度によっては正しくない(キケン度が上がれば殆どの場合で正しい)のですが、公式からリザルトを取得できるようになってようやくこの時点で「サーモンランの戦略を考える」ということが可能になりました。

では、次章でカタパッドを片翼で残せば、寄せやすいオオモノはどのくらい増えるのかを考えてみましょう。

## カタパッドの期待値

結果を発表する前に、まず「カタパッド片翼戦法にどのくらいの価値があれば嬉しいか」を考えてみましょう。

そこで、まずは大まかにデメリットをまとめて、それに対するリターンとしてどのくらいメリットがあればよいかを考えてみます。

### 片翼戦法のデメリット

カタパッドを三体わざと放置するのですから、

1. たおしていれば金イクラ九個に変換できた
2. たおしていれば撃たれなくて済むミサイルがある

というのが大きなデメリットになります。後者のデメリットは直感的にわかりにくいですが、前者は簡単です。もしカタパッド片翼戦法をしてノルマが一つ足りずに負けてしまったとしたら「序盤にカタパッドを一体たおしていればそのイクラを納品して勝てていた」となるわけですね。

カタパッド放置で寄せやすいモグラやテッパンになってくれればこのデメリットと相殺できるのですが、どのくらいの期待値があれば相殺できるでしょうか？

これは直感になるのですが、カタパッド片翼戦法をとることで各 WAVE でモグラかテッパンに代わる期待値が 1 以上あれば十分効果がありそうな気がします。

> 期待値 1 以上とは片翼放置することで各 WAVE のモグラとテッパンの出現数合計が 1 増えることを意味する

では、実際にどのくらい期待値があるのか計算してみましょう。

### 片翼戦法のメリット

実際に、三体のカタパッドを片翼で放置し、四体目のカタパッドがモグラまたはテッパンに変化する確率を求めてみましょう。

この戦法を考える上で大事になるのは「カタパッドが四体出る確率はどのくらいあるのか」ということです。何故なら、カタパッドが四体出現しなければ代替オオモノのロジックが発生せず、出現するはずもないモグラとテッパンに期待して完全に無意味にカタパッドを片翼放置していることになります。

> 賢明な読者の方なら気付いているかもしれないが、代替オオモノロジックが発生する条件は「同一オオモノが三体出現している」であるので「カタパッドが三体出現する確率」を求めるべきだと考えるかもしれない。しかし、その条件で考えるのであれば「何体目の出現オオモノでカタパッドが三体になったか」ということが必要になってくる。これは計算がめんどうなので、今回は単純に「カタパッドが四体以上出る湧きのときに、四体目以降がランダムに別のオオモノに変わる」と仮定して計算を進めた。時間があれば、真の値とどのくらい差があるのかを調べてみたい。

下の表はノルマごとの四体目のカタパッドが出現する確率をまとめたものです。言い換えれば「カタパッドをたおして再湧きしてしまう確率」と考えることもできます。

| オオモノ出現数 | ノルマ |   確率   |
| :------------: | :----: | :------: |
|       20       |   21   | 31.7776% |
|       21       |   22   | 35.2324% |
|       22       |   23   | 38.6871% |
|       23       |   24   | 42.1159% |
|       24       |   25   | 45.4957% |

> 計算方法は二項分布でググって参考にしてほしい

見てわかるように、最もオオモノ出現数が多くなるノルマ 25 であっても「カタパッドが再湧きする確率」は 45.5%ほどしかありません。さらに言えばノルマが 21 の場合には 32%しかありません。

つまり、カタパッド片翼戦法をすればノルマ 25 であっても 55%(100-45.5=54.5%)近い確率で「湧きもしない四体目のカタパッドを恐れて、たおして金イクラに変換して無害化できていたはずのカタパッドを無意味に生存させている」戦法になるわけです。

> ノルマ 21 の場合は「湧きもしない再湧きカタパッドにビビってわざわざ放置するというピエロ」になってしまう確率が 70%近くもあります

これが果たして有効な戦法と言えるでしょうか？

#### オオモノ変換期待値

では、上手いことカタパッドが四体以上でたとして、寄せやすいオオモノになってどのくらい得をするかを計算します。感覚的には 1 以上の期待値があればいいな、という話をしたと思うので、それも考慮しながら記事を読んでいただけると幸いです。

なお、全てのノルマに対する期待値を計算するのは大変なのでノルマ 25 の場合だけ考えます。ノルマが下がれば下がるほど期待値が下がるので、これは期待値の上限を求めるものです。

すると以下のような表になります。

| 代替オオモノ数 | 発生確率 |  期待値  |
| :------------: | :------: | :------: |
|       0        | 54.5042% |    0     |
|       1        | 20.2787% | 0.333333 |
|       2        | 13.5191% | 0.666666 |
|       3        | 7.1351%  | 0.999999 |
|       4        | 3.0579%  | 1.333333 |

代替オオモノ数が 0 の場合は変化するカタパッドがいないので期待値は 0 です。代替オオモノが N 体いれば期待値は N\*2/6 なのでその値をまとめたものが上の表です。

> 代替オオモノ数が 5 以上の場合は発生確率が 1%を下回るので考慮しないことにしました

すると、期待値が 1 になるのは代替オオモノ数が 3 の場合、つまり「カタパッドが 6 体以上出るような WAVE」に限られます。そして「カタパッドが 6 体以上でるような WAVE」はノルマ 25 であっても 12%くらいしかありません。

つまり、ノルマ 25 であったとしてもカタパッド片翼戦法を行ってモグラかテッパンが一体以上増える確率は 12%しかないということになります。

## 片翼戦法についての補足

さて、ここまでで

#### カタパッドの脅威が半減する

- 脅威は減るが、安全ではない
- 余裕があるならたおしたほうが良い

#### 寄せやすいオオモノが出現しやすくなる

- ノルマ 25 なら四体目カタパッド出現確率は 45%程度
- ノルマ 21 なら四体目カタパッド出現確率は 32%程度
- 片翼戦法を実践するのは最高ノルマでも 50%以上意味もなく湧きもしない再湧きカタパッドを恐れて無意味に放置する戦法

というように、これら二つのメリットは完全なまやかしであることがわかりました。つまり、たおす余裕があるならばカタパッドを無意味に放置する意味は全くありません。

### 必ずたおせという意味ではない

じゃあカタパッドは優先的に落とす必要があるのかといえばそうではありません。何故なら片翼化したカタパッドをたおす優先度はそんなに高くないからです。「他にやることがないならたおしておいた方が良い」くらいで考えておけばよいです。

「カタパッドは残り 28 秒まで絶対に片翼放置しないといけない」という考えが誤りというだけであって、プレイヤーのスキルによっては他のオオモノをたおすのに手間取ってカタパッドをたおす余裕がない場合もあります。そのときには「とりあえず片翼」にしておいて、手が空いたタイミングでたおせばよいのです。

## 改善案

最後に、改良した片翼戦法を紹介します。

方針は片翼戦法を踏襲しつつ、プレイヤーのスキルを考慮した上でメリットを正しく活かせる戦法になっています。

> 「プレイヤーのスキルを考慮」というのは再湧きしたカタパッドをたおしつづけるだけのプレイングスキルがない人のことを指す

実は何も難しいことはありません、「最初に出現したカタパッドだけはたおして金イクラを三つ納品する」これをするだけでここまで解説した片翼戦法のデメリットを大きく軽減することができます。

何故最初のカタパッドなのかというと、WAVE 開始直後はまだシャケの数が少なく、カタパッドであってもたおして三つ納品するだけの十分な余力がプレイヤー側にあるためです。

> 厳密には一番最初に限定せず「80 秒、70 秒までに湧いたカタパッドはたおす」くらいの大雑把な感じで大丈夫です。また、三つ納品と書きましたが湧き位置、仲間の状況によっては三つ納品が難しい場合もあります。その場合は自分が一つ拾ったとして、、もう一人誰かが拾って納品すれば「大きな得」と考えて最低一つ、目標二つ拾うようにしてください。

### 何故この戦法が優れているか

片翼戦法の最も大きいデメリットは、その作戦が功を奏する確率がどんなに高く見積もっても 45%くらいしかないことにありました。

> 45%というのはカタパッドが四体以上出現する確率である

この作戦の良いところは失敗したところのデメリットを大きく軽減できるところです。従来の片翼戦法ではカタパッドが四体以上湧かなければメリットは完全に 0 でしたが、この戦法は片翼戦法と比較して「カタパッドが一体でも出れば納品数が三つ増える」というところにあります。

カタパッドが一体もでないような WAVE がくる確率は非常に低く、またそのような WAVE であればどんな作戦を用いてもそもそもメリットもデメリットもないため、実質的にこの作戦が従来の片翼作戦よりも得をする確率は 100%であると言えます。

| 出現数 |   確率   | 片翼戦法 |           改善案           |
| :----: | :------: | :------: | :------------------------: |
|   0    | 2.47330% |    -     |             -              |
|   1    | 9.89320% |  無意味  |         金イクラ+3         |
|   2    | 18.9619% |  無意味  |         金イクラ+3         |
|   3    | 23.1757% |  無意味  |         金イクラ+3         |
|   4    | 20.2787% |   代替   |    再湧き+1, 金イクラ+3    |
|   5    | 13.5191% |   代替   | 再湧き+1, 代替, 金イクラ+3 |
|   6    | 11.6980% |   代替   | 再湧き+1, 代替, 金イクラ+3 |

逆にカタパッドが四体出現する場合には湧かなかったはずの再湧きカタパッドがでてしまったので、この戦法が片翼戦法に比べて失敗してしまったと言えます。ただし、その場合でも最初にたおして納品した金イクラがあるので、これらを総合すると一概に失敗したとは言えず、むしろ再湧きの損を考えての結果的に得をしたと考える人もいると思います。

特に根拠もない個人的な主観なのですが、再湧きのデメリットは「最初にたおしたカタパッドの金イクラを納品しなければ損、一つ納品ならトントン、二つ納品なら十分得」と考えています。つまり、最初にたおした金イクラを自分が拾えば少なくとも損をせず、誰か一人が追加で拾ってくれれば「仮に再湧きしたとしても十分成功した」と言えるということです。

この戦法は「カタパッドが四体以上出現した」という条件以外で常に片翼戦法よりも得をし、どれだけ損をしてもカタパッドが余計に一体再湧きするだけなので、非常に効率的な戦法になります。

## まとめ

どんなレベルのプレイヤーであっても片翼戦法は完全に無意味。固定観念から抜け出すべき。

野良カンストできる程度のレベルがあるならカタパッドを積極的にたおす立ち回りにシフトすべき。いきなり全部は無理だと思うので、まずは序盤のカタパッドは積極的にたおすようにする。

記事は以上。
