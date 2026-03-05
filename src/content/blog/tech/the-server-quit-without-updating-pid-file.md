---
title: "【MySQL】$sudo mysql.server startするとThe server quit without updating PID fileというエラーが出る"
description: "Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。"
pubDate: "2019-10-21"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/the-server-quit-without-updating-pid-file/"
draft: true
---

## 背景

Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。

Railsプロジェクトを作成し、

```
$sudo mysql.server start
```

をしたときに発生したエラー。

## 開発環境

日付：2019/10/19

Ruby ：2.5.1 
Rails ：6.0.0

## エラー内容

```
. ERROR! The server quit without updating PID file (/usr/local/var/mysql/xxxxx.local.pid).
```

意味的には「PIDファイルが更新されずにサーバーが終了した」というエラーでした。

## 解決方法

```
$ sudo chown -R _mysql:_mysql /usr/local/var/mysql
```

にて解決しました。

mysql以下のファイルを更新するための権限の問題だったようです。

## 参考サイト

[https://qiita.com/mogetarou/items/e34ca51d3756d55d7800](https://qiita.com/mogetarou/items/e34ca51d3756d55d7800)
