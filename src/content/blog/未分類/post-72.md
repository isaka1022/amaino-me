---
title: "virtual boxにてeth0が出てこないときの対処法"
description: "こんにちは。Amaneです。 Virtual BoxにてUbuntu server 16.04 LTSをインストールしようとしたのだけれど、途中でエラーにあたってしまったので対処法メモ。"
pubDate: "2017-12-26"
category: "uncategorized"
source: "wordpress"
originalUrl: "https://amaino.me/blog/%e6%9c%aa%e5%88%86%e9%a1%9e/post-72/"
draft: true
heroImage: "/blog/wp-content/uploads/2017/12/rails.png"
---

こんにちは。Amaneです。 Virtual BoxにてUbuntu server 16.04 LTSをインストールしようとしたのだけれど、途中でエラーにあたってしまったので対処法メモ。

## 経過

[こちらのサイト](https://www.oiax.jp/rails3book/deploy/prepare_virtualbox.html)に従ってデブロイしていた。   ところが、 ifconfigでeth0とかいじってるんだけれどもそんなのは出てこない。 enp0s8とかが出てくる。   そこで解決してもらったのが[こちらのサイト](http://www.kakiro-web.com/memo/centos-network-setting-nat-hostonly.html)。 こちらの記事でも解説しているのだが、 Ubuntu13以降では ネットワークインターフェイス 「enp0s3」が「NAT」に、 「enp0s8」が「ホストオンリーアダプター」に 割り当てられているようだ。

## 結論

eno0s8でオッケー。
