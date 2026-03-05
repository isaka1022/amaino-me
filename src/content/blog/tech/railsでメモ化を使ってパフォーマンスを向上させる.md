---
title: "Railsでメモ化を使ってパフォーマンスを向上させる"
description: "TL;DR  Railsでメモ化というテクニックを使えば一度のリクエストに対して同じ処理が複数走る箇所のパフォーマンスを改善できます。    ruby @hoge ||=  重い処理      このようにインスタンス変数の自己代入を使ってメモ化すれば、2回目以降の呼び出しはインスタンス変数に格納された値を使ってその後の処理を実行できます。    解決したい課題  次のようなProductモデルを考"
pubDate: "2022-12-16"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/railsでメモ化を使ってパフォーマンスを向上させる"
tags: ["Ruby", "Rails", "パフォーマンス", "メモ化"]
---
# TL;DR

Railsでメモ化というテクニックを使えば一度のリクエストに対して同じ処理が複数走る箇所のパフォーマンスを改善できます。
```ruby
@hoge ||= #重い処理 
```
このようにインスタンス変数の自己代入を使ってメモ化すれば、2回目以降の呼び出しはインスタンス変数に格納された値を使ってその後の処理を実行できます。

# 解決したい課題

次のようなProductモデルを考えてみます。
```ruby:product.rb
# == Schema Information
#  id   :bigint           not null, primary key
#  name :string(255)      not null
#
class Product < ApplicationRecord
    has_many :shops, through: :malls
    has_many :malls

    def has_shops?
      # 内容は省略
      # 要件を満たしたshopかどうかを判定して真偽値を返す
    end
end
```

こちらの`Product`に対してnameの検索を行うような`Searchable`モジュールの`search`メソッドを考えてみます。

```ruby:product_filterable.rb
module ProductFilterable
    def filter(query)
         target_products = Product.all.inlcludes(malls: :shops).select(&:has_shop?)
         target_products.select { |product| product.name == "query" }
    end
end
```

対象となる商品(`products`)から`name`が文字列`query`と一致するものを抽出するようなメソッドです。
ただし、検索対象として予め要件で決められた`shop`をアソシエーションで持っている`product`から抽出したいです。
（本番環境で`Product.all`を使うとメモリを圧迫する可能性がありますが、今回はサンプルとしています）


# ２回目の呼び出し以降も同じ結果を返すならば無駄な処理が走る

このコードの問題として、検索の度に引数として渡されたすべての`Product`に対して`has_shop?`という判定がされていまいます。
もしも`Product`レコードが頻繁に追加されることがなく、抽出元となる対象がかわらないのであれば、　`filter`の実行の度に全件に対しての判定処理は無駄になってしまいます。


# メモ化を使って初回の実行結果をキャッシュする

そんなときに使えるのがメモ化のテクニックです。

## メモ化とは

メモ化をWikipediaで調べると下記のような説明があります。

> メモ化（英: memoization）とは、プログラムの高速化のための最適化技法の一種であり、サブルーチン呼び出しの結果を後で再利用するために保持し、そのサブルーチン（関数）の呼び出し毎の再計算を防ぐ手法である。メモ化は構文解析などでも使われる（必ずしも高速化のためだけとは限らない）。キャッシュはより広範な用語であり、メモ化はキャッシュの限定的な形態を指す用語である。

https://ja.wikipedia.org/wiki/%E3%83%A1%E3%83%A2%E5%8C%96

    今回のケースで言うと、メモ化とは同じ処理を走らせる場合に、1回目の処理で返したレスポンスをキャッシュとして残しておくことで2度目以降の処理が走らないようにしてパフォーマンスを向上させるテクニックだと言えます。


## メモ化を使ったパフォーマンス改善

実際に上記のコードは下記のように書き換えることができます。


```ruby
def fitler(query)
     @target_products ||= Product.all.inlcludes(malls: :shops).select(&:has_shop?)
     @target_products.select { |product| product.name == "query" }
end
```

# メモ化の効果 

こうすることで、最初の実行時のみ
```ruby
Product.all.inlcludes(:shop).select(&:has_shop?)
```
こちらの処理が呼ばれてインスタンス変数`@target_products`に格納されます。二度目以降はインスタンス変数がそのまま使われて`select`の処理が実行されます。

ちなみに、`||=`という書き方はRubyの自己代入という仕組みで「左辺が偽か未定義ならば右辺を代入する」という意味です。

https://docs.ruby-lang.org/ja/latest/doc/spec=2foperator.html#selfassign

# 参考

https://qiita.com/kt215prg/items/3c0fd89468dcfe6075df
