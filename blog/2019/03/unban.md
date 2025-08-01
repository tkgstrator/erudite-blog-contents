---
title: BAN解除について
date: 2019-03-31
description: ニンテンドースイッチにおけるBAN解除の可能性について
tags: [Nintendo Switch]
authors: ['tkgstrator']
---

## ニンテンドースイッチの BAN の種類

一括りに BAN と言っても実はいくつかの種類が存在します。それらについて調べた結果いろいろわかったので記事にしたいと思います。

> The use of online services on this console is currently restricted by Nintendo.
>
> Please contact Customer Support via Nintendo Support website and quote this error code.
> support.nintendo.com/switch/error

ちなみに、BAN されるとこんなメッセージが表示されたりします。

### Error Code: 2124-4007

俗に言う本体 BAN というもので、本体固有の証明書が取り消されてしまうため一切のニンテンドーネットワークへのアクセスができなくなります。

### Error Code: 2124-4025

証明書 BAN と呼ばれるもの。これは本体固有の証明書ではなく、使っている（主に違法な）ゲームのバックアップの証明書が BAN されたことを意味している。

### Error Code: 2124-4027

スプラトゥーン 2 の永久本体 BAN とのこと。

ゲーム BAN というもので、そのゲームで一切のニンテンドーネットワークへのアクセスができなくなります。

> LFS（Layered FS）を有効化した状態でロビーに入っただけで BAN された。
>
> [https://twitter.com/asasasa98765/status/1031780739845517312](https://twitter.com/asasasa98765/status/1031780739845517312)

> 未実装ステージをプラベで遊ぶ・IPSwitch を有効化した状態（BGM を消す）でオンラインプレイする。
>
> [https://twitter.com/Khangarood/status/1077453421358317569](https://twitter.com/Khangarood/status/1077453421358317569)

BGM を消す（俗に言うミューハ）は相手からすると全くわからないし、良くないことではあるものの全塗りチートなどに比べれば優先度は低そうな気がします。

にもかかわらず BAN してきたということは、任天堂の対策の意気込みの強さが現れていますね。

逆に言うと、単にセーブを改造したりチートをする程度では本体 BAN まではいかないことがわかります。してもいいと思うんですけどねえ...

### Error Code: 2124-4607

スプラトゥーン 2 の永久本体 BAN とのこと。

2124-4027 との違いはよくわかっていない。

## BAN 解除の可能性

結論から言ってしまうと、ない。

というのも、ニンテンドースイッチは本体に固有の ID（実際には証明書）が刻まれており、ニンテンドーネットワークに接続する際にそれを任天堂が検証するため。

これは WiiU のときと違い、NAND に書き込まれているわけではないので NAND を書き換えたからといって BAN 解除できるわけではない。

では、本体のどこに刻まれているかというと CPU 内部の TrustZone という領域である。TrustZone は ARM（ニンテンドースイッチが使っている CPU）のセキュア領域に該当し、一般のアプリケーションから直接アクセスすることはできない。

端末のルート権限を取得していても、である。

つまり、BAN された証明書の書換えは極めて困難です。

仮に（BAN されていない）証明書の書換えに成功したとしても、証明書の共有はすぐに任天堂側に検知される。違う IP で同時に二つの証明書がニンテンドーネットワークに接続してきたらそれは証明書を共有しているとすぐにわかるからです。

ちなみに FW1.0.0 には TrustZone レベルでコードを実行できるバグがあります。

まあ例え証明書を書き換えられたとしてもホワイトリスト方式をとっているので意味がないとは思いますが...

### BAN に対するハッカーの言葉

以下はハッカーである[@OatmealDome](https://twitter.com/OatmealDome)氏、Zewia 氏の言葉の引用である。

- 「UNBAN する唯一の方法は新しいスイッチを買うこと」
- 「証明書の共有は『俺を BAN してくれ』といっているのと同じ」
- 「仮に UNBAN が来ても任天堂はすぐ対策する」

BAN 解除なんかに夢を持たずに二台目のニンテンドースイッチを買ったほうが遥かに早いです。

## BAN されるとできなくなること

1. Nintendo Switch Online へのアクセス
2. eShop へのアクセス
3. ゲームのアップデート
4. システムのアップデート

### eShop

eShop にアクセスできなくなるということは、ダウンロード版のゲームが再ダウンロードできなくなることを意味します。

アカウントを移行すればダウンロード権をもったアカウントを別の BAN されていないニンテンドースイッチに移行できそうですが、アカウント移行には Nintendo Switch Online への接続が必須なのでそれもできなくなります。

つまり、購入したダウンロード版のゲームがすべて無意味なものになるということです。

ニンテンドースイッチを改造するというのはそのくらいリスクのある行為だと言うことをまず認識してください。

### ゲームのアップデート

BAN された本体ではアップデートできなくなりますが、「近くの人とバージョンをそろえる」という機能を使うことで一応アップデートができます。

これはローカル通信ですので、Lan-Play ではアップデートできません。

二台持ちしていればどうとでもなるので、二台持ちがおすすめです。

### システムのアップデート

システムアップデートは俗に言う SuperBAN という一番ヤバいやつをでなければできます。SuperBAN されていても、ChoiDujourNX や Daybreak などでアップデートすることが可能です。
