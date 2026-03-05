---
title: "deviseをi18nを使って日本語化する"
description: "環境 Ruby 2.5.1 Rails 6.0.2    devise.ja.ymlの導入  [こちら](https://qiita.com/you8/items/921e0dd1210eb0d158df)を参考にさせてもらってdeviseを日本語化した際に、いくつか違ったので、メモ書きしておく     gemを導入      gem 'devise-i18n'      上記のgemを導入した後"
pubDate: "2019-12-26"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/deviseをi18nを使って日本語化する"
tags: ["Ruby", "Rails"]
draft: true
---
#環境
Ruby 2.5.1
Rails 6.0.2

# devise.ja.ymlの導入

[こちら](https://qiita.com/you8/items/921e0dd1210eb0d158df)を参考にさせてもらってdeviseを日本語化した際に、いくつか違ったので、メモ書きしておく

## gemを導入

```
gem 'devise-i18n'
```

上記のgemを導入した後に、

```
$rails g devise:views:locale ja
```
これを実行。

>Running via Spring preloader in process 70886
Deprecation warning: Expected string default value for '--controller'; got false (boolean).
This will be rejected in the future unless you explicitly pass the options `check_default_type: false` or call `allow_incompatible_default_type!` in your code
You can silence deprecations warning by setting the environment variable THOR_SILENCE_DEPRECATION.
Could not find generator 'devise:views:locale'. Maybe you meant "devise:i18n:locale"?
Run `rails generate --help` for more options.

Maybe you meant "devise:i18n:locale"?

とのことだったので、改めて
```
$rails g devise:i18n:locale ja
```
こいつを実行した。

これによってdevise.ja.ymlが自動生成された。

#参考文献
[Deviseを日本語化する](https://qiita.com/you8/items/921e0dd1210eb0d158df)
