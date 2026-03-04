---
title: "【Ruby on Rails】bundle exec rails webpacker:installするとDon't know how to build task 'webpacker:install'というエラーに遭遇した"
description: "Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。"
pubDate: "2019-10-21"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/dont-know-how-to-build-task-webpackerinstall/"
---

## 背景

Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。

RailsとReactをwebpackにて通信しようと思い、

```
$  rails webpacker:install
```

を実行しようとした時にエラーが発生しました

## 開発環境

をしたときに発生したエラー。

日付：2019/10/19

Ruby ：2.5.1  
Rails ：6.0.0

## エラー内容

```
Don't know how to build task 'webpacker:install'
```

意味的には「webpacker:install」というコマンドが認識されていないようです

## 解決方法

Gemファイルに以下を追加し、bundle installすることで解決しました。

```
gem 'webpacker', github: "rails/webpacker"
```

## 参考サイト

[https://qiita.com/tatsuyankmura/items/728e190b92e0370eefbb](https://qiita.com/tatsuyankmura/items/728e190b92e0370eefbb)
