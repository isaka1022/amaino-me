---
title: "FactoryBotのモデル作成でコールバックをスキップする方法"
description: "RSpecでテストを書いていて、assertされるデータの内容は同じなのに、IDだけが異なっているようなケースがあり、何だろう？とデバッグしていたらcallbackの処理で先に別のレコードが作られていたりしたケースがあった。"
pubDate: "2022-08-31"
category: "tech"
tags: ["Ruby on Rails"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/factory-bot-skip-callback/"
---

RSpecでテストを書いていて、assertされるデータの内容は同じなのに、IDだけが異なっているようなケースがあり、何だろう？とデバッグしていたらcallbackの処理で先に別のレコードが作られていたりしたケースがあった。

そこで、特定のスイートの場合にのみFactoryBotのコールバックをスキップするにはどうすればよいかをまとめます。

## コールバック処理とは

RailsにおけるActiveRecordのコールバックとは、ActiveRecordオブジェクトのライフサイクルになります。オブジェクトが作成・更新・削除をフックにしてデータの処理を実行できます。

例えばユーザーが登録されたタイミングでメールを送りたいときなどには、ユーザーレコードが保存されることをフックとしてメール送信を実行できます。

```
class User < ApplicationRecord
  after_create :send_mail

  private

  def send_mail
    # メール送信処理
  rescue => e
    errors.add(:base, e.message)
    throw :abort
  end
end
```

## テストのタイミングでコールバックをスキップしたい

通常のアプリケーションの内部では非常に便利なコールバックですが、RSpecなどでテストの実行時には予期しない振る舞いになることもあります。

例えば上記のユーザーの保存がされたことを確認したい場合で、本番環境でしかメール送信の仕組みが実装されていない場合にはsend\_emailが例外を投げるので、ユーザーの保存に失敗してしまいます。

こんなときには`skip_callback`を追加すれば、次に`set_callback`が呼ばれるまで指定したコールバック処理をスキップしてあげることができます。

RSpecで使うFactoryBotを使用する際にコールバックをスキップするには下記のように書くことができます。

```
FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    auth { 'admin' }
    email { 'sample@example.com' }

    before(:create) { User.skip_callback(:create, :after, :send_mail) }
    after(:create) { User.set_callback(:create, :after, :send_mail) }
  end
end
```

こうすることで例えばローカルでRSpecでこのUserのインスタンスを使用した際や、send\_mailメソッドそのものをテストする際にコールバックによる挙動を考える必要がなくなります。

## 参考

[https://railsguides.jp/active\_record\_callbacks.html](https://railsguides.jp/active_record_callbacks.html)

[https://qiita.com/nishina555/items/2b4bdcf135fcc551b476](https://qiita.com/nishina555/items/2b4bdcf135fcc551b476)
