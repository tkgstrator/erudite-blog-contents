---
title: NWでもカタパッドは片翼放置するのは避けるべきか
date: 2022-10-06
description: 前作ではカタパッドは無意味に放置するのは全く意味がないという結論に達した。今作ではそれがどのように変わったのかを検討してみます。
tags: [Splatoon3, Salmon Run]
authors: ['tkgstrator']
---

## 本記事を読むにあたって

本記事ではあくまでも統計を前提に話をします。本記事の内容に対して感情論で言いたいことはあるかもしれませんが、統計は裏切りません。サイコロを何度も振ればどの目も大体 1/6 に収束していくのと同じです。

ただし、NW は解析が進んでいないこともありいくつかの前提を仮定せずに議論をすすめることができませんでした。仮定は尤もらしいものを採用していますが、今後の解析の発展などで誤りが見つかる可能性があります。その場合、本記事の内容は修正する必要がでてくるでしょう。

### 仮定

- オオモノシャケの出現確率は同様に確からしい
- 同一オオモノシャケは同時に三体までしか出現できない

今作ではオオモノシャケは 4 種類増えて、全部で 11 種類になりました。もし、これらの出現確率が同様に確からしいのであれば、それぞれ出現確率は 1/11 ということになります。

> 今作では`Calc Appear Priority`というパラメータが追加されているため、出現確率が等しくない可能性が示唆されている

同一のオオモノシャケが同時に三体までしか出現できないというのは、内部データ解析からも恐らく正しいと思われます。

> `Maximum on Field`という値が 4 に設定されていることが確認されています

### 何故カタパッドを片翼放置するのか

そもそも何故カタパッドを片翼放置するのか、という点について片翼推奨派の主な理由は以下の三つです。これ以外にあったら教えて下さい。

#### 再湧きの懸念

ボム二発、インク 150%を消費してたおしたのに再湧きするとたおすのが大変だという懸念です。

#### 代替オオモノシャケへの期待

同一オオモノシャケが三体いる場合、そのオオモノシャケの代わりに別のオオモノシャケが出現します。カタパッドの金イクラは運びにくいので、運びやすい金イクラになりがちなテッパンやモグラに変化してくれたら嬉しい、という期待です。

#### 片翼カタパッドはミサイルが半分で安全

片方の射出口から四発撃つので、片方を潰しておけば脅威が半減するというわけです。

### 前作においてカタパッドを積極的にたおすべき理由

では上記の至極真っ当そうに見える片翼放置する理由を差し置いてでもカタパッドたおすべきなのかを述べます。

その前に全体的なフローチャートを載せておきます。それぞれのメリットとデメリットを客観的に挙げてみました。

![](https://pbs.twimg.com/media/FeW1LQTaMAEgh5U?format=jpg&name=large)

#### 再湧きの懸念

前作ではオオモノシャケの種類は七種類でした。たおしたカタパッドが再湧きするというのは「放置していれば上限の三体しかでなかったのに、たおしたばかりに出現を阻止できたはずの四体目が出現した」ということになります。

よって「たおしたばかりに損をする確率」は「カタパッドが四体以上出現するような WAVE の発生確率」と等しいです。これはどのくらいなのでしょうか？

この確率自体は二項分布というものに従うので、エクセルなどでも簡単に計算できます。すると、キケン度 MAX ノルマ 25 でオオモノシャケが 24 体出現する、最も四体目のカタパッドがでやすそうな条件でさえも四体以上カタパッドが出現する確率はおよそ 45%ということがわかります。

つまり、たおせるカタパッドを無意味に片翼放置する作戦は 50%以上の確率でメリット 0 のデメリットしかない作戦ということになります。

#### 代替オオモノシャケへの期待

上の理由に関係するのですが、そもそも四体目のカタパッドの出現確率が 50%以下なので、代替オオモノシャケに期待するだけ無駄です。

代替オオモノシャケによる期待できるような効果は存在しません。

#### 片翼カタパッドはミサイルが半分で安全

ここは少し感情論も入ります。ミサイルが半分になったからといって安全ではないです。たおして 0 にしている方がよほど安全です。

以上の理由から、たおせるカタパッドを無意味に片翼放置するメリットは皆無なことがわかります。

で、これも何度も何度も言っているのですが「たおす余裕があるならわざわざ放置する必要はない」と言っているだけで、何が何でもたおさなければいけないという主張ではないです。

> 何故かこの手の記事を書くと「どんなときでも、どんな湧き位置でもカタパッドたおすのですか」みたいなツッコミがくるのだが、そんなことはどこにも書いていない。片翼主義者が主張するようなメリットは存在しない、と言っているだけである。

ノルマが足りないなら片翼のカタパッドは無視して納品すべきですし、コンテナ周りにオオモノシャケがたくさんいるならそちらを優先すべきです。

## NW では片翼作戦は有効か

NW では環境がガラッと変わりました。特に以下の三つが前作の違いだと考えています。

- ノルマの増加
- オオモノシャケの追加
- 出現するオオモノシャケの増加

それぞれについて解説しましょう。

### ノルマの増加

前作では最大 25 だったノルマが 10 増えて 35 になりました。

捉え方によっては「納品が重要視され、余裕があっても片翼のカタパッドを落とすメリットが下がった」と考えることができます。しかしながら別の視点から見れば「ノルマ分のイクラを確保するために、無意味に生存している片翼カタパッドをたおして金イクラに変換することのメリットが上がった」と考えることもできます。

これはどちらが正しいとかではなく、どちらの効果もあると思います。どちらの効果が大きいのかなど、どのような状況ならどういう立ち回りをするかなどについては結論を出すのはまだ早いのではないかと考えています。

しかしながら「序盤のカタパッドは落としたほうが良い」についてはまず間違いなく正しくなったと思われます。序盤は出現できるシャケの数が少ない、塗りが広げられていないため WAVE 後半に比べれば圧倒的にプレイヤー側有利となります。

今作ではこの有利な状況で可能な限り納品を進めておくことが、クリアを近づけるために必要な立ち回りであることは間違いありません。よって、今作では序盤のカタパッドは何体湧こうが全部たおして金イクラに変換し、可能な限り納品したほうが良いです。

> 序盤というのがどのあたりを指すのかは非常に難しいのですが、70 秒くらいまでのカタパッドは全部落として大丈夫だと思います

### オオモノシャケの追加

オオモノシャケが四種類追加されたため、そもそもカタパッドが出現しにくくなりました。

これはつまり再湧きの可能性が減ったということになり「カタパッドをたおすことのメリットが上がった」ということになります。

### 出現するオオオモノシャケの増加

今作ではキケン度が前作の 200%から 333%まで大幅強化され、難易度も格段に上がっています。最高難易度ではオオモノシャケが最大 35 体出現します。

出現するオオモノシャケが増えたということは、再湧きの可能性が上がり「カタパッドを片翼放置するメリットが上がった」ということになります。

では、オオモノシャケの追加とオオモノシャケの増加、どちらの影響が大きいのでしょうか？

## NW では片翼放置すべきかどうか

NW では先述したように最大キケン度が大きく上がったので、とりあえず前作と同じレベルでの話と、それ以上での話とに分けて考えましょう。

### 0%~200%

前作での MAX、キケン度 200%を比較してみました。NW でいえば最大ノルマ 30 なのでこの辺りで躓いている方も多いのではないでしょうか。

実は NW はノルマ以外の殆どのパラメータは前作と共通です。よって、単純に前作と比較しても大きな齟齬は発生しません。

|            |     前作     |     今作     |
| :--------: | :----------: | :----------: |
|  キケン度  |     200%     |     200%     |
|   レート   | たつじん 600 | でんせつ 200 |
| 最大ノルマ |      25      |      30      |
| 最大出現数 |      24      |      24      |
| 再湧き確率 |   45.495%    |   16.911%    |

表を見てわかるように、ノルマが上がっただけでオオモノの出現数は同じです。出現数は変わらないのにノルマが増えたということは、積極的に納品しないといけないですし、納品のために金イクラを出さないといけないことになります。

つまり、無意味に浮いているカタパッドすらたおせば貴重な金イクラとなるわけです。最大出現数が変わらないのですから、処理という側面においてゲーム自体の難易度は変わっていません。前作でキケン度 MAX がクリアできたのであれば NW のキケン度 200% のクリアは難しくないはずです。

> もちろんオオモノの種類が増えたとかそんな事を言いだしたら比較ができないのでそこは無視する

注目すべきはカタパッドの再湧き確率で、前作の 45%から大きく減ってたったの 17%程度になりました。つまり、キケン度 200%でいえばガンガン落としてしまっても再湧きするのは 100 回遊んで 17 回だということです。

#### 考え方

さて、100 回に 17 回再湧きするという、現実を目の当たりにして何を思っただろうか？概ね以下のどれかなのではないかと思う。

1. 100 回に 17 回なら無視できる、どんどんたおそう
2. 100 回に 17 回なら 83 回は得できる、17 回を引くとつらいけどどんどんたおそう
3. どんどんたおした 83 回もクリアできるとは限らないので 17 回確実に得できるなら片翼もありかなあ

「無視できるな」と思った方はわかりやすい方で、どんどんたおせば良いと思います。17 回の損を考えられる方は思慮深い方で、後述する内容についてもしっかり読んでほしいと思います。最後の考え方をした方は、考えていそうに見えていろいろ考えるところが足りていないです。

まず最初に、再湧きを阻止することはクリアする条件ではありません。もし仮に四体目のカタパッドが出現し、片翼放置により再湧きを阻止した瞬間にクマサンの温情で特別にノルマ未達成でもクリア判定になったとしましょう。正直、このレベルにまでなっても片翼放置が優秀かどうかは微妙なところです。

第一に、カタパッドが再湧きする確率はたったの 17%です。要するに 100 回遊んでこの条件でクリアできるのはたったの 17 回です。残りの 83%は無意味にミサイルがとんできます。ミサイルがない状況でプレイするのと、無意味にミサイルがとんでくるのと、どっちがクリアが楽か、よく考えてみてください。

で、当たり前ですがたおし続ける戦略をとったからといって再湧きした瞬間に負けるわけではありません。なんか再湧きしたら即ち損みたいに考えている人が多いのですが、何が損なのかよくわかりません。カタパッドをもう一度たおさないといけないという点では損かもしれませんが、たおしたおかげで金イクラを余計に納品できていたのですから、むしろ得だと思うのですが。

カタパッドが再湧きしたから負けじゃないし、再湧き阻止したからって勝ちというわけではない、ということをまず理解してください。オオモノシャケをたおして、金イクラを運んでノルマを達成し、100 秒間生き残れば勝ちなのです。

片翼放置というのは自身のインク消費を避け、一時的に生存の確率を上げる、オオモノ処理をするための手段の一つであって目的ではないということです。

というか、片翼放置って四体目が出現しなければ完全にメリット 0 ですよね？100 回やって 83 回メリット 0 の作戦を採用する意味が全くわからないのですが。

> ここでは完全にカタパッドを片翼放置する立ち回りについて述べている

### 200%~333%

場合によります。エアプなので実際どうなのかよくわかっていません。

## 条件付き確率のまやかし

最後に条件付き確率のまやかしについてちょっとだけ解説。

大前提なのはオオモノシャケが 24 体出現し、出現確率が同様に確からしいのであれば 17%の確率でしか四体目のカタパッドは出現しない、ということです。

これは絶対で、前提が崩れない限り変わることはありません。何度でもいいますが、意味もなく片翼放置する作戦は 100 回やって 83 回デメリットしかない作戦です。

> 例えば確率が同様に確からしくないとかそういうの

![](https://pbs.twimg.com/media/FeWn4OxacAEqiV2?format=jpg&name=4096x4096)

で、これに対して[一般論として正しいが実践的ではない](https://poached-tamago.notion.site/NW-da26700a00354e8584b3db956236aa49)という指摘を頂いたのでこれについても解説。

先程述べたようにキケン度 200%の WAVE3 ならカタパッドが四体以上湧く確率は 16.9%なのだが、例えば序盤にカタパッドが三体出現したような場合では 16.9%については考える意味がない、というもの。

つまり、例えば最初の方に出現したオオモノ 6 体のうち 3 体がカタパッドであるような場合には、残りの 18 体のうちカタパッドが 0 体である確率は低い(大体 18%くらい)ので、4 体目のカタパッドが出現する確率は 82%もあり、そもそも前提の 16.9%という値が使えないのではないかというもの。

![](https://pbs.twimg.com/media/FeW1LQWaEAEH8eE?format=png&name=large)

で、これは条件付き確率というやつである。確かに、サーモンランを長く遊んでいると序盤にカタパッドがたくさん出るような場面に遭遇したプレイヤーもたくさんいると思う。すると「本当に四体目のカタパッドが出る確率は低いのか」と気になっている人もそれなりにいるのではないかと思う。

なので今回はこの条件付き確率について少し述べる。繰り返すが、カタパッドが四体以上出る確率はキケン度 200%なら 16.9%であり、これは覆すことのできない事実である。

### 確率は 82%か 17%か

![](https://pbs.twimg.com/media/FeW1LQWaYAEexLB?format=jpg&name=large)

結論から言えば、考え方によってはどちらも正しい。ただし、条件付き確率はまやかしを生みやすいのも事実である。

どちらも正しいが「キケン度 MAX でもカタパッドが再湧きする確率は 17%」というのは現在のところ最も信用して良い値である。

> 満潮だとテッキュウがでないらしいので、確率はもうちょっと上がる。今回は割愛させていただいた。
> 「最初の方にカタパッドがたくさんでたら、WAVE 全体としてカタパッドが三体以下である確率が低いので確率論による議論は実践的ではない」というのは「宝くじの最初の五桁が一致していたら、最後の一桁は 10%(0~9 のどれかなので)で一致するから宝くじは当たりやすい」と言っているのと同じである。これ、意義のある確率ですか？

要するに「〜だったら」という"条件付きの"部分がレアケースなので、全体として見れば微々たるレベルだということである。

とはいえ、僅かな確率でもワーストケースを引いた場合に何も策がないというのも気になる。低い確率ではあるが、カタパッドがうじゃうじゃでてくる WAVE はたしかに存在するのだ。

せっかくなので最初の N 体のオオモノ出現でカタパッドが三体以上出る確率を計算した。「以上」を計算しているので上の表とは違う数字になっていることに注意されたい。

| 最初の N 体のオオモノ | 残り秒数 | 三体以上出る確率 |
| :-------------------: | :------: | :--------------: |
|           6           |  90~80   |      1.21%       |
|           7           |  80~70   |      1.98%       |
|           8           |  80~70   |      2.96%       |
|           9           |  80~70   |      4.15%       |
|          10           |  70~60   |      5.54%       |
|          11           |  70~60   |      7.11%       |
|          12           |  70~60   |      8.87%       |
|          13           |  60~50   |      10.78%      |
|          14           |  60~50   |      12.83%      |
|          15           |  60~50   |      15.01%      |

するとオオモノの数が 11 体を超えてきたあたりからなんとなく「ありそう」な確率になってくる。

> とはいえ、100 回やって 10 回もこないので、レアケースだとは言えるのだが。ちなみに、出現秒数については[@Minaraii](https://twitter.com/Minaraii/status/1572234777746608128)氏のツイートを参考にさせていただいた。

### ワーストケースに遭遇した場合、どうすべきか

逆に、あと何体のオオモノ湧きがあればカタパッドが一体出現する確率が 50%を超えるかを考えてみよう。

この状況であれば「カタパッドをたおして再湧きされるよりも少し我慢して放置したほうがよい」というある種の基準になるはずだ。

で、計算してみたところ、残りのオオモノ出現枠が七体であればカタパッドの再湧きの確率は 48.68%となり、50%を下回ることがわかった。つまり、「残りのオオモノ出現枠が八体以上ある」「カタパッドが三体埋まっている」という状況であれば、カタパッドを落とすことが将来的に再湧きされることでプレイヤーにとって損になる確率のほうが高くなるというわけである。

じゃあ「残り八体はどのタイミングなのか」ということが重要になってくる。先程参考にさせていただいた@Minaraii 氏のツイートによればキケン度にも依るが、およそ 50~45 秒のタイミングが残り八体の目安になるようだ。

#### ここまでのまとめ

- 条件付き確率は幻想、17%という数字だけを信用しろ
- とはいえレアケースにも可能な限り対応したい
- カタパッドが三体埋まっているならたおすのが損になるタイミングがある
- それは残りオオモノが八体以上いるパターンで、およそ残り 50 秒のタイミング

ここで注意していただきたいのは、上の条件を満たすためにカタパッドを片翼放置しておけと言っているわけではないということである。

カタパッドは積極的にたおすべきだが、タワーやテッキュウなどのようにカタパッドと同じくらいの脅威があるオオモノがいれば、片翼のカタパッドを落とすよりもそちらを優先した方が良いケースも多い。もしそのような状況になって、カタパッドが三体埋まっている状態が続く、あるいは続きそうであれば再湧きの可能性を減らすためにも 50 秒までは落とすのを控えた方が得になる可能性がある、と言っているだけである。

残り 28 秒で新しくオオモノは湧かなくなるので 28 秒というのは一つの目安とされているが、それと同様に立ち回りの転換期として 50 秒というのも意識してみて良いかもしれない。

## まとめ

- 負けたいという目的がない限りカタパッドを無意味に片翼放置する意味はない
- 負けたいのであれば落とせるカタパを放置しよう
- 片翼カタパッドを落とすよりはタワーやテッキュウを優先したい
- それ以上にノルマを優先したい
- カタパが処理しきれない場合は 50 秒まで片翼で放置というのを意識してみよう

記事は以上。
