---
title: "RubyのNumbered parameterについて調べたこと"
description: "ある日、レビューしていたRuby on Railsのコードの中で下記のような実装がありまして、所見で何をしているのかわからなかったので調べたことのメモ書きです。"
pubDate: "2022-07-20"
category: "tech"
tags: ["Ruby on Rails"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/numbered-parameter/"
---

ある日、レビューしていたRuby on Railsのコードの中で下記のような実装がありまして、所見で何をしているのかわからなかったので調べたことのメモ書きです。

```
product_shop_attributes.each { product.product_shops.build(_1) }
```

通称「なんぱら」とも言われるこちらの書き方はNumbered parameterという書き方で、Rubyの2.7から導入された機能のようです。

## RubyのNumbered parameter

Numbered parameterとはブロックの仮引数を省略して、「\_」を数字のprefixとした変数で受け取ることができる記法になります。

通常、ブロックの内部で|num|のような形で| |を書くことでその処理に使う値を扱います。

```
[1] pry(main)> (1..10).map { |num| num * 10 }
=> [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```

しかし、Numbered parameterを使うことでこの| |を省略した形で仮引数を扱うことができるようになります。

```
[2] pry(main)> (1..10).map { _1 * 10 }
=> [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
```

もしも仮引数を複数扱いたい場合も、以下のように書くことができそうです。

```
[4] pry(main)> (1..10).map.with_index { { _2 => _1 * 10} }
=> [{0=>10}, {1=>20}, {2=>30}, {3=>40}, {4=>50}, {5=>60}, {6=>70}, {7=>80}, {8=>90}, {9=>100}]
```

## 参考

https://tech.smarthr.jp/entry/2019/11/07/112556

[https://qiita.com/pink\_bangbi/items/deeb5bf958c449e57987](https://qiita.com/pink_bangbi/items/deeb5bf958c449e57987)

[https://rails-study.net/proc-block/](https://rails-study.net/proc-block/)
