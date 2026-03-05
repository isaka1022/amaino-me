---
title: "GraphQLを活用したスキーマ駆動開発を体験した話"
description: "概要 会社でGraphQLを導入するにあたり、スキーマ駆動開発を取りいれた開発を行ってみました。 実際にどのような開発を行ったのか、またやってみてどうだったかをご紹介できればと思います。  一度下記LTにて紹介した内容について少し加筆や修正を行った記事になります。  https://speakerdeck.com/isaka1022/graphql-rubyde-sukimaqu-dong-kai"
pubDate: "2022-12-17"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/graphqlを活用したスキーマ駆動開発を体験した話"
tags: ["Ruby", "Rails", "GraphQL"]
---

# 概要
会社でGraphQLを導入するにあたり、スキーマ駆動開発を取りいれた開発を行ってみました。
実際にどのような開発を行ったのか、またやってみてどうだったかをご紹介できればと思います。

一度下記LTにて紹介した内容について少し加筆や修正を行った記事になります。

https://speakerdeck.com/isaka1022/graphql-rubyde-sukimaqu-dong-kai-fa-woti-gan-sitahua

# GraphQLにおけるスキーマ駆動開発

GraphQLを導入する利点の1つとして「スキーマ駆動」が実現できることがあります。

スキーマ駆動開発についてはこちらのqsonaさんの資料が詳しいです。

https://speakerdeck.com/qsona/schema-driven-development-with-graphql


GraphQLを構築する方法として、コードファーストとスキーマファーストの２つのアプローチがあります。

コードファーストは、APIのスキーマをGraphQLのコードで定義してスキーマを生成する方法です。スキーマを定義するために、GraphQLの型を定義し、それらの型を組み合わせて、クエリを定義します。

スキーマファーストは、APIのスキーマをGraphQLのスキーマで定義してAPIを生成する方法です。スキーマを定義するために、GraphQLのスキーマを使用して、型を定義し、それらの型を組み合わせて、クエリを定義します。

https://www.apollographql.com/blog/backend/architecture/schema-first-vs-code-only-graphql/

今回はGraphQL Rubyを導入してコードファーストの方法でAPIを構築しました。

https://graphql-ruby.org/

## バージョン情報
Ruby: 3.0.2
Ruby on Rail: 6.1
graphql-ruby: 1.13.16


# GraphQLでの実際のスキーマ駆動開発の手順
## 1. Resolverを準備する

この時点で、フロントエンドの人と、受け取る引数や返すデータの方についての認識をすり合わせておきます。

```ruby:contents_resolver.rb
class ContentsResolver < GraphLQ::Schema::Resolver
    type ObjectTypes::ContentType.connection_type, null: false

    argument :keyword, String, required: false
    argument :author_id, ID, required: false

    def resolve(keyword: nil, author_id: nil)
    end
end
```

```ruby:content_type.rb
module ObjectTypes
  class ContentType < BaseObject
    field :press_id, String, null: true
    field :is_published, Boolean, null: false
    field :category_name, String, null: true
  end
end
```

## 2. ダミーデータを返すような実装をする

ロジックを仮で実装して、返す型だけを合わせたダミーデータを返すような実装を一時的に作ります。

```diff_ruby:contents_resolver.rb
class ContentsResolver < GraphLQ::Schema::Resolver
    argument :keyword, String, required: false
    argument :author_id, ID, required: false

    # TODO: ロジックは後で実装
    def resolve(keyword: nil, author_id: nil)
+        Content.first(10)
    end
end
```

```diff_ruby:content_type.rb
module ObjectTypes
  class ContentType < BaseObject
    field :press_id, String, null: true
    field :is_published, Boolean, null: false
    field :category_name, String, null: true
+
+    # TODO: ロジックは後で実装
+    def press_id
+      "1"
+    end
+
+    # TODO: ロジックは後で実装
+    def is_published
+      true
+    end
+
+    # TODO: ロジックは後で実装
+    def category_name
+      "category_name"
+    end
  end
end
```

## 3. マージする

新規で建てるAPIの場合には、この時点でフロントエンド側からレビューをもらい、ダミーデータを返す実装のままマージします。

# フロントエンド・バックエンドで並行して開発を行う

これでフロントエンド側からはダミーデータを返すGraphQLサーバーが扱えるようになったので、そのデータをもとに実装を進めてもらいます。

バックエンド側では先程立てた仮のメソッドの内部の実装を進めて行きます。

もしもフロントエンド側を実装していて、追加でデータやバックエンド側の処理が必要になった場合には相談をもらうか、フロントエンドエンジニアの方で実際にコードを修正してもらって、バックエンド側でレビューをするような形で進めていきます。


# 良かった点

それまでのRESTfulなAPIの開発では、しっかりとした仕様を決めきるのに時間がかかったり、バックエンド側のAPIの実装が終わるまでフロントエンドの手が空いてしまったりと「実装待ち」のような時間が少し発生していました。
しかし、スキーマ駆動開発を導入した結果としてその時間が減ったような体感が得られました。

また、バックエンド側の実装で手間取ってしまっているとどうしても「フロントエンドの人を待たせている」という変なプレッシャーを感じながら実装することもなくなりました。

さらに、以前はJSON形式のキーなどを見ながら話していたのですが、GraphQLを導入したことでスキーマや型の情報を共通言語としてフロントエンド側とコミュニケーションが取れるようになったこともよかったことであると言えます。

# 課題感と反省

今回はスキーマの設計を主にバックエンド側中心で行いました。
その結果、フロントエンド側での実装イメージやデータの使い方についてイメージがしづらいことがあり、フロントエンドの実装段階になってAPIの設計の変更や実装の修正が起きてしまいした。

そうなった場合に、フロントエンド側では自分でAPIを修正できるとよいのですが、今回はRubyにおいて実装していたため、修正の際にもバックエンド側の知識が少し必要なってしまいます。

フロントエンド・バックエンドがお互いにそれぞれの知識を多少持っていたほうが開発がスムーズに進むという印象です。

