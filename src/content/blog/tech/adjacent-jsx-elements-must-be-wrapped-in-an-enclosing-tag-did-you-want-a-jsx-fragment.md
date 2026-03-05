---
title: "【React】Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment ...?"
description: "Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。"
pubDate: "2019-10-21"
category: "tech"
tags: ["React.js"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/adjacent-jsx-elements-must-be-wrapped-in-an-enclosing-tag-did-you-want-a-jsx-fragment/"
draft: true
heroImage: "/blog/wp-content/uploads/2019/10/ef9fc671f806ba5364958e3a3be7b087.jpg"
---

## 背景

Reactを勉強中をしたいなと思い、RailsのAPIをReactから叩けるようなアプリケーションの開発中の出来事。

Reactを使っていたらChromeのコンソールからエラーが出た。

## 開発環境

Ruby 2.5.1 
Rails 6.0.0

## エラー内容

```
Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?
```

意味的には「隣接するJSX要素は終了タグで囲まれていなければいけないよ」とのこと。

## 解決方法

Reactのコンポーネントでreturnするコードを<div></div>で囲んだ。

## 参考サイト

[https://utano.jp/entry/2016/07/react-adjacent-jsx-elements-must-be-wrapped-in-an-enclosing-tag/](https://utano.jp/entry/2016/07/react-adjacent-jsx-elements-must-be-wrapped-in-an-enclosing-tag/)
