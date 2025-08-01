---
title: チート検索でお金は稼げるか
date: 2021-02-03
description: チートコードを探すことで本当にお金が稼げるのか、業界の事情や可能性について考察しています
tags: []
authors: ['tkgstrator']
---

## 2ch 創設者西村博之氏への質問

@[youtube](https://www.youtube.com/watch?v=fC1PjNLxszU)

まずは一分足らずの上の動画を見ていただきたいのであるが、チートコードを探すのが大好きな投稿者がそのスキルを活かす仕事はあるかどうかを問うているのである。

で、よく見たらその投稿者さんはニンテンドースイッチのチートコードをよく投稿している ZiT 氏でした。

その質問に対して博之氏は「ゲームシステムに対するハッキング・クラッキング技術であればパッケージゲーム（コンシューマ向け）ではなくネットゲーム系のクラックをすればセキュリティ担当として雇われる可能性が高いのでは」と真摯に答えてくれたわけです。

## アンダーグラウンドな事情

ぼくはどこかの会社のセキュリティ担当として働いているわけでもないし、セキュリティ関係に造詣が深いわけではないが「チートコードを探す=お金に換える」をそのまま実現するのは難しいように思う。

というのも、ZiT 氏が言うようにチートコードを掲載する雑誌を販売したり、チートツールやセーブエディタを販売していたサイバーガジェットが摘発されるなど、日本においてはチートをそのまま販売することは難しいと考えられるからだ。

とすれば、以前発行されていたゲームラボの用にチートコードを掲載しつつゲームの紹介をするような雑誌をつくるなりすればよいのではないかと思う。メンバーが複数人いれば月イチで記事の内容を考えること自体は難しくないだろう。

問題はそれを販売する「手段」が限られることだ。それこそ出版業界にアプローチを掛けてそういう雑誌を販売するしかないが、いきなりそんなことは到底無理なので最初はコラムのような感じで誌面の数ページを分けてもらうということになるだろう。

ただ、ゲームラボも休刊してしまっているし、今更そんなアングラな記事を好んで載せたい出版社がどのくらいいるのかはわからない。

となれば、個人で発行して頒布するというのが最も手間がかからなさそうな方法に思える。具体的には同人誌即売会などの活動の場を利用するのだ。同人誌やコミックマーケットときくと 18 禁の二次創作のイメージが付きがちだが、創作物であれば法令を遵守している限りだいたいなんでも頒布できるのが同人誌即売会の魅力だ。

過去にカラオケの採点システムの解析結果などの資料を頒布していた人がいたので、そういった需要も少なからずあると思う。

ただ、本は体積や重さに対して単価が非常に安いので、1 冊 1000 円というそれなりに高価な値段で販売しても 1000 冊売れてやっと 100 万円というレベルである。年に 2 回なら 200 万円だ。もちろん、実際には運搬費や人件費、印刷代などがかかってくる。手とりはいいとこ 140 ~ 150 万円といったところではないだろうか。

大学生ならそれでいいかもしれないが、一般的な社会人がそれではちょっと厳しいものがある。もちろん、もっと大規模になれば十分やっていける可能性はあるので即悲観するのはよくない。

## セキュリティ担当は遙か高み

ある人が残した言葉に「たどり来て未だ山麓」という言葉がある。

遙か高みに登ったの思ったら、それはまだ山麓に過ぎなかったことに気付かされるという意味である。

ニンテンドースイッチのチートコードを見つけることはもちろんすごい。日本人をランダムに 100 人集めて「スイッチのチートコードを探してください」といっても一人もできないだろう。

しかし、そのレベルではまだまだセキュリティ担当になれるほどの技術力がないのである。

そもそも、何故我々はニンテンドースイッチのシステムの全権限を掌握し、好きなパッチをあてたり MOD を作成して遊ぶことができるのだろうか？そして何故、我々はニンテンドースイッチのチートコードを探すことができるのだろうか？

それは全て、ニンテンドースイッチのシステムをハッキングし、システムの暗号化キーを見つけ、そのキーを元にシステムファイルを復号し、解析した人がいたためだ。

そして、セキュリティ担当として必要とされているのは「そのレベルの人」なのである。

### メモリサーチできる時点でセキュリティは崩壊している

本来、ユーザはシステムのメモリにアクセスすることはできず、当然メモリ検索からチートコードを探すことなどできない。

システムセキュリティの観点から見れば、本来秘匿にすべきメモリの値を読み込まれている時点でそのシステムのセキュリティは崩壊しているのだ。

そんなところに「このセキュリティが崩壊しているシステムのメモリを読み込んでチートを見つけられる」というスキルがある人がセキュリティ担当として配属されたとして、もはや意味がないのである。

必要なのはメモリを読まれないためにプログラムのバグを極力減らすこと、一つの鍵が漏れても即システムが崩壊することに繋がらないような安全な設計を開発すること、そして物理的なクラッキングに対する耐性を設計すること、などである。

ニンテンドースイッチの未対策基板がセキュリティ的に崩壊して意味のなさないものになっているからこそ、任天堂は脆弱性を塞いだ新たなニンテンドースイッチを販売したのだ。

が、もちろんこれは本線から逸脱している。ZiT 氏は「チートコードを見つけるスキルをお金に換える仕事があるか」どうかをきいているのであり「ゲーム会社のセキュリティ担当になりたい」などと一言も言っていない。

ここで言いたいのは博之氏が言うように「チートを見つけるというハッキングができる=セキュリティ担当になれる可能性がある」という理論がそう簡単な話ではないということである。

## まとめ

メモリを読み込んでチートを探したり、メモリの動きから実行ファイルのアルゴリズムを推察したり、逆アセンブラからオリジナルのコードを復元したりは、たしかに類稀なるスキルである。

しかし、そのレベルをもってしてもプログラミングの奥深さを海に例えるとまだまだ足のつくところまでしか進めていないようなものなのだ。

だが、セキュリティ担当にまでは至らないもののエンジニアとしての付加価値として「メモリサーチなどのローレベルなこともできる」というのは十分な魅力になるのではないかとも思う。チートコード一本で生計を立てる、というのは「アンダーグラウンドな事情」の章でも解説したようにすぐには難しいかもしれないが、エンジニアとしてであれば（もちろんプログラミング言語を扱える必要はあるが）働き口には困らないだろう。

### おまけ

ゲームのハッキング・クラッキングで生計を立てていこうとするのはプロゲーマーやプロ野球選手になるのと同じくらい難しいのであんまり夢見ないほうがいい。

余暇として楽しむべし、以上。
