---
title: "docker compose stopとdocker compose downは何が違うのか"
description: "いつもわからなくなって、いつも調べて納得したような気持ちになるので、定着のためにまとめます。"
pubDate: "2022-08-31"
category: "tech"
tags: ["Docker"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/difference-docker-compose-stop-down/"
heroImage: "/blog/wp-content/uploads/2022/09/技術ブログアイキャッチ-9.jpg"
---

いつもわからなくなって、いつも調べて納得したような気持ちになるので、定着のためにまとめます。

## docker-compose down

公式サイトより、コマンドの説明です。

> Stops containers and removes containers, networks, volumes, and images created by `up`
> 
> https://docs.docker.com/engine/reference/commandline/compose\_down/

「upコマンドによって作成されたコンテナを停止し、削除し、ネットワークとボリューム、イメージを削除する」ということですね。

## docker-compose stop

一方のdocker-compose stopの方です。

> Stops running containers without removing them. They can be started again with `docker compose start`
> 
> https://docs.docker.com/engine/reference/commandline/compose\_stop/

「startコマンドによって再起動したコンテナを削除することなく止める」と説明があります。

## 何が違うのか？

こちらの図がわかりやすかったのでお借りします

![スクリーンショット 2019-01-15 16.03.20.png](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.amazonaws.com%2F0%2F209909%2F99612c11-42b0-9485-7ba4-203b118b9545.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=487b628fe2aaf21d8de97c62947936b9)

引用：https://qiita.com/etaroid/items/b1024c7d200a75b992fc

Dockerとは、この画像のようにコンピュータの内部に仮想的なミドルウェア環境を用意する技術です。

![スクリーンショット 2019-01-15 17.37.22.png](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.amazonaws.com%2F0%2F209909%2F7fbfbe89-81b5-91e8-1efa-31aa48ac4e1c.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&s=893ba0321b3c3a34ba967b771e9cf60b)

引用：https://qiita.com/etaroid/items/b1024c7d200a75b992fc

Docker イメージをもとにしてにしてコンテナが作成されます。

この図を見ればもうおわかりかと思いますが、stopコマンドでは作成されたコンテナを削除せず、停止しておくだけなのに対して、downコマンドでは実行環境をすべて削除するということですね。

## 参考

https://www.ikkitang1211.site/entry/2021/03/09/084833

[https://qiita.com/etaroid/items/b1024c7d200a75b992fc](https://qiita.com/etaroid/items/b1024c7d200a75b992fc)
