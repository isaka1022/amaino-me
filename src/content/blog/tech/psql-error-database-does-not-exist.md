---
draft: true
title: "PostgreSQLに接続しようとすると psql: FATAL: database 'username' does not exist で接続できない"
description: "PostgreSQLにて環境構築を行った後に、たしかにユーザーは存在しているのに接続できないエラーが起きた。"
pubDate: "2022-01-24"
category: "tech"
tags: ["PostgreSQL"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/psql-error-database-does-not-exist/"
---

## はじめに

PostgreSQLにて環境構築を行った後に、たしかにユーザーは存在しているのに接続できないエラーが起きた。

```
docker-compose exec db bash
root@1e04746ce311:/# psql
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL: role "root" does not exist
root@1e04746ce311:/# psql -U username
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL: database "username" does not exist
```

## 状況

Dockerのビルド時にしっかりユーザーは作成していそうだった。

```
database_uri = PostgresDsn.build(
 scheme="postgresql",
 user=settings.POSTGRES_USER,
 password=settings.POSTGRES_PASSWORD,
 host=settings.POSTGRES_SERVER,
 path="/path",
)
```

```
# PostgreSQL
POSTGRES_SERVER=db
POSTGRES_USER=username
POSTGRES_PASSWORD=passoword
POSTGRES_DB=app

```

## 解決法

以下Qiita投稿にたどり着き、解決。

\-d オプションで直接DBを指定してログインすることができた。

```
root@1e04746ce311:/# psql -U backend -d app
psql (12.9 (Debian 12.9-1.pgdg110+1))
Type "help" for help.
```

[https://qiita.com/penpenta/items/c993243c4ceee3840f30#migration-%E3%81%AE%E5%AE%9F%E8%A1%8C-1](https://qiita.com/penpenta/items/c993243c4ceee3840f30#migration-%E3%81%AE%E5%AE%9F%E8%A1%8C-1)

## 原因

改めて学んで見ると、PostgreSQLでは以下のようになっていた。

PostgreSQLへのアクセスの実行は以下。

psql -h ホスト名 -p ポート番号 -U ロール名 -d データベース名

- ホスト名のデフォルトはlocalhost
- ポート番号の通常は5432
- ロール名を省略した場合はOSのユーザー名が使用される
- データベース名を省略した場合はロール名と同じ名前のデータベースに接続される

とのことなので、-dを省略した結果、usernameという名前のDBを探しに行ってエラーとなっていた模様でした。
