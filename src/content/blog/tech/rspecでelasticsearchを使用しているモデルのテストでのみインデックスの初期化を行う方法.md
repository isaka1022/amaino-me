---
title: "RSpecでElasticsearchを使用しているモデルのテストでのみインデックスの初期化を行う方法"
description: "TL;DR  RailsのメソッドをRspecでテストする際に、Elasticsearchを使ったモデルに対してのテストの実行時にのみ、実行前後でElasticsearchのインデックスを初期化する処理を入れる方法です。    やりたかったこと   elasticsearch-rails gemを用いたRailsのアプリケーションにおいて、下記のようにElascticsearchを用いて検索や絞り"
pubDate: "2022-12-11"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/rspecでelasticsearchを使用しているモデルのテストでのみインデックスの初期化を行う方法"
tags: ["Rails", "RSpec", "テスト", "Elasticsearch"]
---
# TL;DR

RailsのメソッドをRspecでテストする際に、Elasticsearchを使ったモデルに対してのテストの実行時にのみ、実行前後でElasticsearchのインデックスを初期化する処理を入れる方法です。

# やりたかったこと

`elasticsearch-rails`gemを用いたRailsのアプリケーションにおいて、下記のようにElascticsearchを用いて検索や絞り込みを行うメソッドを実装しました。

```ruby
class SampleClass < ApplicationRecord
    def search(filter_ids, target_ids: [], min_price: nil, max_price: nil, size: 200)
        __elasticsearch__.search({
                                     size: size,
                                     query: build_query(filter_ids, target_ids, min_price, max_price)
                                   })
    en
end
```

こちらのメソッドに対して、RSpecでテストを書きたかった際にどのようにするか迷ってしまいました。
今回はモデルごとにElasticsearchのインデックスを初期化する方法を使って実装したので、そちらを紹介したいと思います。


# テスト環境で常に使えないか

Elasticsearchではインデックスを作成して検索を実行するのですがこちらのインデックスを複数のテストケースで共有してしまうと、別のテストで作成・更新されたインデックスに対してテストがされてしまうため、実際にテストしたい内容がテストできていなかったり、テスト対象のメソッドは正しいのに意図しない結果が返ってくるというようなことが起きてしまいます。

https://www.elastic.co/guide/jp/elasticsearch/reference/current/gs-create-index.html

そのためテストの前後でインデックスの初期化を行いたいのですが、Elasticsearchを使っていないメソッドの実行前後でも初期化の処理を書く必要はなく、実行時間の観点からもなるべくインデックスの初期化は最小限にしたい意図があります。

# Elasticsearchを使用しているモデルのテストでのみインデックスの初期化を行う

そこで今回は下記の手順で設定し、Elasticsearchを使っているテストやモデルに対してのみインデックスの初期化を行うようにしました、
これ以前にElasticsearchのDockerコンテナは設定されているものとします。

### 1. 環境変数に設定
使用するElasticserachコンテナのhostとportを環境変数に用意します

```yml:test.yml
elasticsearch:
  host: <%= ENV['ELASTICSEARCH_HOST'] || 'localhost' %>
  port: <%= ENV['ELASTICSEARCH_PORT'] || '9200' %>
```


### 2. テスト環境でもElasticsearchコンテナを起動するようにする
1で設定した環境変数のコンテナをテスト環境でも読み込むようにします。
RailsでのElasticsearchクライアントの初期化についての詳細は[elasticsearch-ruby](https://github.com/elastic/elasticsearch-ruby#usage-example)に書いてあります。

```ruby
Elasticsearch::Model.client = Elasticsearch::Client.new(
                                  hosts: [
                                    {
                                      host: Settings.elasticsearch.host,
                                      port: Settings.elasticsearch.port
                                    }
                                  ],
                                  log: true
                               ) if Rails.env.test?
```


### 3. spec_helper.rbにインデックスの初期化処理を追加

RSpecを導入時に作成されるspec_helper.rbにて、それぞれのテストでの共通の処理を記述することができます。

RSpecで定義できるmetadataに応じてテストの前にlasticsearchのインデックスを作成、テスト後にElacticsearchのインデックスを削除する処理を行うようにしました。

```ruby:spec_helper.rb
config.before(:each) do |example|
 Product.__elasticsearch__.create_index! if example.metadata[:elasticsearch]
end

config.after(:each) do |example|
    Product.__elasticsearch__.delete_index! if example.metadata[:elasticsearch] && Product.__elasticsearch__.index_exists?
end
```

## 独立してテストできようになった
こちらの処理を書いたことで、テストするモデルごとにテストの実行前後でElasticsearchのインデックスを初期化することができ、それぞれのテストを独立して実行することができます。

```ruby
RSpec.describe SampleClass, type: :model, elasticsearch: true do
end
```

## 応用：Github Actionsを使ってCIに組み込む

また、今回のようにRspecのmetadetaを使った分岐使用すれば、Github Actionsにも組み込むことができます。
workflowの中でElasticsearchのコンテナを用意して、テストの実行環境から読み込めるようにすればOKです。

```yaml:.github/workflows/test.yml
jobs:
  rspec:
    services:
        elasticsearch:
          image: docker.elastic.co/elasticsearch/elasticsearch:7.16.3
          env:
            discovery.type: single-node
          ports:
            - 9200:9200
steps:
    - name: run rspec
      env:
          ELASTICSEARCH_PORT: ${{ job.services.elasticsearch.ports['9200'] }}
```

# 参考

https://blog.bitjourney.com/entry/2015/05/22/162250

https://qiita.com/tabakazu/items/8d160b28d9aeafe8846e
