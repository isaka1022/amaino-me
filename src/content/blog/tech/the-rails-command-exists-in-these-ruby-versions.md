---
title: "【Ruby on Rails】The `rails' command exists in these Ruby versions:にてrailsコマンドが使用できない"
description: "Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。"
pubDate: "2019-10-21"
category: "tech"
tags: ["Ruby on Rails"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/the-rails-command-exists-in-these-ruby-versions/"
---

## 背景

Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。

Railsをインストールし、その後に

```
$ rails --version
```

をしたときに発生したエラー。

## 開発環境

日付：2019/10/19

Ruby ：2.5.1  
Rails ：6.0.0

## エラー内容

```
The `rails' command exists in these Ruby versions:
```

意味的には「このバージョンではrailsコマンドは使えないよ」とのこと

## 解決方法

```
$ gem install rails
```

にて解決しました。

原因は、rbenvを使ってRubyの新しいバージョンを入れて切り替えていたことだったみたいです。  
rbenvのバージョン管理とその他のgem管理など、理解があいまいなのでもうちょっと正確に理解したいです。

## 参考サイト

[https://qiita.com/kamillle/items/5a7befd0ebad47378832](https://qiita.com/kamillle/items/5a7befd0ebad47378832)
