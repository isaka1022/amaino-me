---
title: "RailsでMySQLのクエリをチューニングする"
description: "僕がよくつかうWEBアプリケーションの構成はRuby on Rails + MySQLの組み合わせです。"
pubDate: "2022-07-19"
category: "tech"
tags: ["MySQL", "Ruby on Rails"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/rails-mysql-turning/"
---

僕がよくつかうWEBアプリケーションの構成はRuby on Rails + MySQLの組み合わせです。

MySQLではEXPlAINコマンドを使ってクエリのパフォーマンスをチェックしますが、すこし調べてみると、Railsのコンソールからもパフォーマンスを調べる方法があったのでそのメモ書きです。

## to\_sqlメソッド

まずはto\_sqlメソッドがあります。

Railsのコンソールやログからも、実際に発行されて実行されるSQL文を確認することはできますが、実行前にどんなSQLが実行されるのか確認したい場合にこちらを使うと便利です。

```
[3] pry(main)> Product.where(id: 1).to_sql
=> "SELECT `products`.* FROM `products` WHERE `products`.`id` = 1"
```

さらにメモですが、こちらのコマンドの実行を確認した際にfindメソッドではエラーになるようです。

```
[2] pry(main)> Product.find(1).to_sql
  Product Load (5.6ms)  SELECT `products`.* FROM `products` WHERE `products`.`id` = 1 LIMIT 1
NoMethodError: undefined method `to_sql' for #<Product id: 1>
Did you mean?  to_s
from /usr/local/bundle/gems/activemodel-6.1.4.4/lib/active_model/attribute_methods.rb:469:in `method_missing'
```

## explainメソッド

さらに、expainメソッドを使うと、MySQLで表示されるような結果を返してくれます。

これでパフォーマンスをチューニングしたり、インデックスが機能しているかの確認をRailsのコンソールで完結して行うことができるので便利ですね。

```
[2] pry(main)> Product.where(id: 1).explain
=> EXPLAIN for: SELECT `products`.* FROM `products` WHERE `products`.`id` = 1
+----+-------------+----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table    | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | products | NULL       | const | PRIMARY       | PRIMARY | 8       | const |    1 |    100.0 | NULL  |
+----+-------------+----------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
1 row in set (0.01 sec)
```

## 参考

[https://qiita.com/yn-misaki/items/109bc81a225d04abec76](https://qiita.com/yn-misaki/items/109bc81a225d04abec76)

http://yoshitsugufujii.github.io/blog/2012/03/09/20120309104103/
