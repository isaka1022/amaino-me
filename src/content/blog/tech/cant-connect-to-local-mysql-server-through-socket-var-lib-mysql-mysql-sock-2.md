---
title: "【Ruby on Rails】rails sするとCan't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)"
description: "Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。"
pubDate: "2019-10-21"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/cant-connect-to-local-mysql-server-through-socket-var-lib-mysql-mysql-sock-2/"
---

## 背景

Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。

Railsプロジェクトを作成し、

```
$ rails s
```

をしたときに発生したエラー。

## 開発環境

日付：2019/10/19

Ruby ：2.5.1  
Rails ：6.0.0

## エラー内容

```
Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (2)
```

意味的には「ローカルのmysqlサーバーにつながらないよ」というエラーでした。

## 解決方法

```
$ sudo mysql.server start
```

にて解決しました。

MySQLのインストールはしていたのですが、起動するのを忘れていたようです。

## 参考サイト

[https://qiita.com/hondy12345/items/d32ed749fb49e9da7de6](https://qiita.com/hondy12345/items/d32ed749fb49e9da7de6)
