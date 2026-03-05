---
title: "Vertual Boxでホストオンリーアダプターを追加する方法"
description: "こんにちは。Amaneです。 今日はVertualboxでホストオンリーアダプターを追加する方法を紹介します。 いつも使っているOSとvertualbox内にインストールしたゲストOSとの通信を実現させたい時にこれを使います。   参考はこちら https://www.oiax.jp/rails3book/deploy/prepare\_virtualbox.html   これ通りに進めて行くと、"
pubDate: "2017-12-13"
category: "uncategorized"
source: "wordpress"
originalUrl: "https://amaino.me/blog/%e6%9c%aa%e5%88%86%e9%a1%9e/post-53/"
draft: true
heroImage: "/blog/wp-content/uploads/2017/12/rails.png"
---

こんにちは。Amaneです。 今日はVertualboxでホストオンリーアダプターを追加する方法を紹介します。 いつも使っているOSとvertualbox内にインストールしたゲストOSとの通信を実現させたい時にこれを使います。   参考はこちら https://www.oiax.jp/rails3book/deploy/prepare\_virtualbox.html   これ通りに進めて行くと、トラブルが。

> ### ネットワークの設定(1)
> 
> ホストOSからゲストOSにアクセスできるようにVirtualBoxのネットワーク設定を変更します。
> 
> - ゲストOSを停止。
> - VirtualBoxで［ファイル］ー［環境設定］メニューを選択。
> - ［ネットワーク］カテゴリを選択。
> - 「ホストオンリーネットワーク」のリストに項目が存在しなければ、右端の「＋」ボタンをクリック。
> - 「ホストオンリーネットワーク」のリストの最初の項目を選択して、右端の「ねじ回し」ボタン（三つ目のボタン）をクリック。
> - 「IPv4 アドレス」の値を記録して、「OK」ボタンをクリック。
> - 「OK」ボタンをクリックして設定ウィンドウを閉じる。
> - ゲストOSを選択して「設定」ボタンをクリック。
> - 「ネットワーク」カテゴリを選択。
> - 「アダプタ2」タブを選択。
> - 「ネットワークアダプタを有効化」にチェック。
> - 「割り当て」を「ホストオンリー アダプタ」に変更。
> - 「OK」ボタンをクリックして設定ウィンドウを閉じる。
> - ゲストOSを選択して「起動」ボタンをクリック。

ここ。ちょっとわかりにくいですよね。 ゲストOSを追加してから、 ![起動画面右上のglobal toolをクリック](/blog/wp-content/uploads/2017/12/スクリーンショット_2017-12-14_8_35_12.jpg)   このGlobal toolをクリックして、   !これで追加できました。
