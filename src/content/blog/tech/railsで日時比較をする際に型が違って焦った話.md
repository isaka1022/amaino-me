---
title: "Railsで日時比較をする際に型が違って焦った話"
description: "この記事で伝えたいこと  Railsで日時比較をするときには日付の型を確認しようと言う話をします。    日時に応じて挙動が変わる処理の実装  WEBアプリケーションを開発していると、特定期間のみキャンペーンのバナーを表示させたいというような、期間などの時刻で動作する機能を開発する必要があります。 かつての僕は「その時間になったら手動でデプロイするのかな」と思っていたこともあったのですが、コードの"
pubDate: "2022-12-25"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/railsで日時比較をする際に型が違って焦った話"
tags: ["Ruby", "Rails", "初心者"]
---
# この記事で伝えたいこと

Railsで日時比較をするときには日付の型を確認しようと言う話をします。

# 日時に応じて挙動が変わる処理の実装

WEBアプリケーションを開発していると、特定期間のみキャンペーンのバナーを表示させたいというような、期間などの時刻で動作する機能を開発する必要があります。
かつての僕は「その時間になったら手動でデプロイするのかな」と思っていたこともあったのですが、コードの中に時間による分岐を入れれば自動で機能がアクティブになることを教えてもらいました。

そんな僕が書いたコードが下記のような分岐です。

```ruby
  Time.zone.now.between?(Date.new(2022, 12, 01), Date.new(2022, 12, 31))
```

しかし、2022年12月1日0:00(JST)になってもこれではうまく動作しませんでした。

```ruby
[2] pry(main)> Time.zone.now.between?(Date.new(2022, 12, 01), Date.new(2022, 12, 31))
=> false
```

# RubyとRailsぞれぞれの日時の型

どうしてこうなるのか少し調べてみると、RailsやRubyにはそれぞれたくさんの日時の型があることがわかりました。

> Railsアプリケーションでは「システムまたは環境変数に設定されたタイムゾーン」と「application.rbに設定されたタイムゾーン」の2種類があります。
どちらも同じ設定になっている場合は問題が起きることは少ないですが、設定が異なっていると予期せぬ結果になる場合があります。

https://qiita.com/jnchito/items/cae89ee43c30f5d6fa2c#rails%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%BE%E3%83%BC%E3%83%B3%E3%81%AE%E6%89%B1%E3%81%84%E3%82%92%E6%95%B4%E7%90%86%E3%81%99%E3%82%8B

冒頭の処理で使った`Time.zone.now`と`Date`の型をそれぞれ見てみると異なる型を使っていました。
```ruby
[1] pry(main)> Time.zone.class
=> ActiveSupport::TimeZone
[2] pry(main)> Date.new(2022,12,01).class
=> Date
```

# 型を揃えた分岐にすることで解消

比較する型をどちらかにそろえれば解消できました。

## Time.zone.localに合わせる

`Time.zone.now`に合わせて`ActiveSupport::TimeWithZone`を使うようにすれば解消できました。

```ruby
[1] pry(main)>  Time.zone.now.between?(Time.zone.local(2022, 12, 01), Time.zone.local(2022, 12, 31)
=> true
[2] pry(main)> Time.zone.local(2022, 12, 01).class
=> ActiveSupport::TimeWithZone
```

## Dateに合わせる

または`Date`に合わせる方法もあります。

```ruby
[1] pry(main)> Time.zone.today.between?(Date.new(2022, 12, 01), Date.new(2022, 12, 31))
=> true
[2] pry(main)> Time.zone.today.class
=> Date
```

こうしてどちらかに揃えたことで意図するシステムの動作を担保することができました。

# 感想
今回はタイムゾーンが`Date`型に反映されなかったためエラーになってしまったようですが、どこでその分岐が起きたのかはまだ調査中になります。
仮説としてRailsの`TimeWithZone`での`between`メソッド内部でutcによる比較になっている可能性がありそうでした。

https://github.com/rails/rails/blob/8015c2c2cf5c8718449677570f372ceb01318a32/activesupport/lib/active_support/time_with_zone.rb#L269-L271


ちょっとこのあたりだいぶ複雑でまだまだ理解ができていないと感じています。
もしもこのあたりご知見があるかたいらっしゃればコメントいただけると幸いですmm

# 参考

https://qiita.com/YumaInaura/items/f0db20bc125cada554a1
