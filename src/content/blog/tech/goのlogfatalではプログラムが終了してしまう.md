---
title: "Goのlog.Fatalではプログラムが終了してしまう"
description: "TL;DR  Go言語の例外発生時に下記のような処理を行うことがあると思います。    go if err := hogeFunction; err != nil {     // エラー処理 }      エラー処理のところでログ出力のために log.Fatal(err) を使っていたところ、意図せずプログラムが終了してしまいました。 処理を継続したければ log.Print(err) を使うの"
pubDate: "2022-12-17"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/goのlogfatalではプログラムが終了してしまう"
tags: ["Go", "Rails", "ログ", "エラーハンドリング"]
---
# TL;DR

Go言語の例外発生時に下記のような処理を行うことがあると思います。
```go
if err := hogeFunction; err != nil {
    // エラー処理
}
```

エラー処理のところでログ出力のために`log.Fatal(err)`を使っていたところ、意図せずプログラムが終了してしまいました。
処理を継続したければ`log.Print(err)`を使うのがよさそうです。

# 解決したい課題

Ruby on RailsのRakeタスクから、別のRuby on Railsアプリケーションにリクエストを送り、Goのコードを実行して外部のAPIを呼び出すシステムを構築をしていました。

(1) Ruby on Rails
↓ GraphQLにてリクエスト
(2) Ruby on Rails
↓コマンド実行
(3) Go
↓リクエスト
(4) 外部API

実行するRakeタスクについてはもとのRuby on Railsにある`Category`モデルのフェッチ対象を抽出する処理が書かれています。`ApiClient.new.request_to_fetch`に対象の`category_id`を渡すことでGraphQLを用いて別のRailsのエンドポイントに対してリクエストを送っています。
```ruby:fetch_categories.rb
desc 'APIへのリクエスト'
  task requestl: :environment do |_task, _args|
    Rails.logger.info "===== start fetch(#{Time.zone.now}) ====="

    Category.where(is_fetch_tareget: true).find_each do |category|
        ApiClient.new.request_to_fetch(category.fetch_id)
      end
    end

    Rails.logger.info "===== end fetch(#{Time.zone.now}) ====="
  end
end
```

GraphQL経由で受け取った`category_id`を引数として渡して`fetch_by_category_id.go`というGoのコードを実行します。それぞれの処理を並行して実行したかったためGoを使っています。

```ruby:fetch_by_category_id.rb
class Mutations::FetchByCategoryId < Mutations::BaseMutation
  argument :category_id, String, required: true

  field :status, String, null: true
  field :errors, [Types::ErrorType], null: true

  def resolve(category_id:)
    # NOTE: バックグラウンド実行
    system("nohup sh -c 'cd /app/go && ./bin/fetch_by_category_id #{category_id}' &")
    status = true

    {
      status: status && 'ok',
      errors: errors || nil
    }
  end
end

```
`fetch_by_category_id.go`の内部では、さらに他のサードパーティ製のAPIに`category_id`を渡して得られた結果を元に処理を行うようなコードが実装されていました。

APIのフェッチ部分では下記のような処理が書かれていました。（一部抜粋）
```go:fetch_by_category_id.go
items, err := client.SearchItems(categoryId)
if err != nil {
    log.Fatal(err)
}
```


# 課題の原因

(1)のシステムでバッチを回した際に正常終了すれば`===== end fetch(#{Time.zone.now}) =====`がログに出力されるはずですが、こちらが出力されないで終了されている問題が起きていました。


その原因として、`log.Fatal`で書かれていたため、サードパーティ製のAPIから意図しない結果やエラーが帰ってきた際にプログラムが終了してしまっていたため(1)と(2)の間の接続が切断されてしまっていることが原因のようでした。

`log.Fatal`のドキュメントの説明を調べてみると、`Print()`の後に`os.Exit(1)`を呼び出すのと変わらないという内容が書かれているため、エラーがあったさいにアプリケーションが終了されてしまいます。

> Fatal is equivalent to Print() followed by a call to os.Exit(1).

https://pkg.go.dev/log#Fatal


# 課題を解決する技術、手法

今回は(1)のバッチの段階ですべてのカテゴリについて一度回しきりたいという要求があったため、(3)の取得の際にエラーが起きても処理を継続するようにしました。

エラーを受けとったさいに内容をログに出力して、処理は継続するようにするために`log.Print(err)`を使うようにしました。

# 参考

https://qiita.com/ryokky59/items/19fa212d1898dcb4bcfd

https://qiita.com/neko_the_shadow/items/70642e57723d42b8514c

