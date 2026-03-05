---
title: "% sudo /etc/init.d/networking stop % sudo start networkingがない！"
description: "Virtual box にUbuntu 16.04 LTSで仮想サーバーを導入しようとして、 こちらの記事を参考にしようとしても [https://www.oiax.jp/rails3book/deploy/prepare\_virtualbox.html](https://www.oiax.jp/rails3book/deploy/prepare_virtualbox.html) ネットワークを"
pubDate: "2017-12-20"
category: "uncategorized"
source: "wordpress"
originalUrl: "https://amaino.me/blog/%e6%9c%aa%e5%88%86%e9%a1%9e/post-61/"
draft: true
heroImage: "/blog/wp-content/uploads/2017/12/rails.png"
---

Virtual box にUbuntu 16.04 LTSで仮想サーバーを導入しようとして、 こちらの記事を参考にしようとしても [https://www.oiax.jp/rails3book/deploy/prepare\_virtualbox.html](https://www.oiax.jp/rails3book/deploy/prepare_virtualbox.html) ネットワークを再起動しようとしても、 % sudo /etc/init.d/networking stop % sudo start networking というコマンドが反応してくれない。   調べたら Ubuntu 13から変更になったらしい。 [https://qiita.com/norami\_dream/items/e238562a9560b9e2bab2](https://qiita.com/norami_dream/items/e238562a9560b9e2bab2)

sudo ifdown eth0 && sudo ifup eth0

というコマンドでうまくいきそうだ。   ただし、eth0は変更になっている場合があるので注意。
