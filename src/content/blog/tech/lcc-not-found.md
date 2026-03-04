---
title: "ロジクールM570tのLogiCool Control Centerで「Logicool製品が見つかりませんでした。」と出たのでkarabinerで解決した"
description: "開発する際に僕はM570tというロジクールのトラックボールを使っています。"
pubDate: "2021-05-16"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/lcc-not-found/"
---

開発する際に僕はM570tというロジクールのトラックボールを使っています。

新しくMacを買い替えたため、設定をしていました。  
M570tの設定に必要なのは、「Logicool Control Center」というドライバ。  
こちらサイトからインストールして起動したのですが、

**Logicool製品が見つかりませんでした。**

![](http://techblog.amaino.me/wp-content/uploads/2021/05/2021-05-16-22.48のイメージ.jpg)

という表記が出てしまい、どうにも作用しない、、。

ネットを調べるとバージョンのダウングレードや英語版でいけるという記事もあったのですが今回はうまくいきませんでした。

そんなときに使ったのが、[Karabiner](https://karabiner-elements.pqrs.org/)というソフト。  
Macのキーボード割当を変更してくれます。  
僕は英語配列のキーボードを使っているのですが、コマンドキーで変換の役割をさせるようなことができます。

これを使ってトラックボールのボタン割当を変更することできたので、無事解決しました。  
ちなみに進むボタンの「Button5」を「Mission Control」に割り当てています。

一旦これにて無事解決しました。
