---
title: "Docker + PostgreSQLにてFAILED: Can't locate revision identified by 'hogehoge'エラーでマイグレーションができない"
description: "Alembicを使ってpythonにてDBの開発を行っていたときに、少しだけハマったエラーについて。"
pubDate: "2022-01-24"
category: "tech"
tags: ["PostgreSQL"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/postgres-error-cant-locate-revision/"
---

## はじめに

Alembicを使ってpythonにてDBの開発を行っていたときに、少しだけハマったエラーについて。

一旦DBを初期化しようとしても、エラーが出てしまう。

```
$ alembic downgrade base
container_name_1     | FAILED: Can't locate revision identified by '90b5e2f5aebf'
```

## 解決策

ちょっと調べてみると、解決方法は2つあった。

1.  DB上のバージョン管理ファイルを直接削除する
2.  Dockerのボリュームを削除する

1の方法も試みたが、うまくいかなかったので2の方法で無理やり解決した。

```
$ docker volume rm container_name_db-data
// 再度マイグレーションを実行
$alembic upgrade head
```

1の方法はこちらの記事を参考にさせてもらった。

[https://qiita.com/kitarikes/items/9c5d6cbc557ed62bb512](https://qiita.com/kitarikes/items/9c5d6cbc557ed62bb512)

## 原因

どうやらAlembicにてマイグレーションを作成した時点でのファイルを削除してしまっていた模様。

基本は一度downgradeしてから調整しないといけなさそうだった。

たしかに、Railsなどでもmigrationファイルを編集するとDBのロールバックなどは手こずる。
