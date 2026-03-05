---
title: "【Ubuntu仮想サーバー】/etc/network/interfaces: Permission denied"
description: "こんにちは。Amaneです。"
pubDate: "2017-12-26"
category: "uncategorized"
source: "wordpress"
originalUrl: "https://amaino.me/blog/%e6%9c%aa%e5%88%86%e9%a1%9e/post-78/"
draft: true
heroImage: "/blog/wp-content/uploads/2017/12/rails.png"
---

こんにちは。Amaneです。

## 問題

Virtual BoxでUbuntu server 16.04をインストールしようとしていましたが、 /etc/network/interfaces: Permission denied で弾かれてしまいました。

## 解決

vim /etc/network/.interfaces.swp とすることで解決できました。
