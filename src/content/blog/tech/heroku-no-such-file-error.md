---
title: "【Ruby on Rails】Herokuへデプロイして、heroku run db:migrateにてPG::ConnectionBad: could not connect to server: No such file or directoryが出る"
description: "Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。"
pubDate: "2019-10-21"
category: "tech"
tags: ["Ruby on Rails"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/heroku-no-such-file-error/"
---

## 背景

Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。

Herokuへアプリケーションをデプロイした後、

```
$ heroku run rake db:migrate
```

をしたときに発生したエラー。

## 開発環境

日付：2019/10/20

Ruby ：2.5.1  
Rails ：6.0.0  
Production Database: PostgreSQL

## エラー内容

```
PG::ConnectionBad: could not connect to server: No such file or directory 	Is the server running locally and accepting 	connections on Unix domain socket "/var/run/postgresql/.s.PGSQL.5432"? 
```

意味的には「PostgreSQLへの接続ができない」とのこと

## 解決方法

```
$ heroku addons:create heroku-postgresql
```

にて解決しました。  
アドオンを入れる必要があったみたいです。

## 参考サイト

[https://qiita.com/suzuki-x/items/b878723080aea1a673ed](https://qiita.com/suzuki-x/items/b878723080aea1a673ed)
