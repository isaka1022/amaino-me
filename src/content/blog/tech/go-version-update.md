---
title: "Go Modulesでgo.modのGo versionを変更する"
description: "職場で使われていたGoのバージョンが1.13と古かったので、1.18にアップデートした際の手順をまとめました。"
pubDate: "2022-07-21"
category: "tech"
tags: ["Golang"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/go-version-update/"
---

職場で使われていたGoのバージョンが1.13と古かったので、1.18にアップデートした際の手順をまとめました。

## リリースノートの確認

まずは、Goのリリースノートを確認しました。

基本的にGo言語は2つ前までのGoのメジャーバージョンまでをサポートしています。

```
Each major Go release is supported until there are two newer major releases
```

[https://go.dev/doc/devel/release](https://go.dev/doc/devel/release)

さらに、Goの1系では、その仕様の有効期間中、変更されることなく正しくコンパイルおよび実行され続けることが意図されています。

```
Go 1 defines two things: first, the specification of the language; and second, the specification of a set of core APIs, the "standard packages" of the Go library. The Go 1 release includes their implementation in the form of two compiler suites (gc and gccgo), and the core libraries themselves.
```

[https://go.dev/doc/go1compat](https://go.dev/doc/go1compat)

とはいえ、念の為どのような変更があったのかリリースノートを確認しました。

## Go Modulesのediting flagsの変更

続いては、go modコマンドを実行してGoの言語を変更します。

```
go mod edit -go=1.18
```

## Dockerイメージの更新

もしもローカルにGoのバージョン1.18がイントール済であればローカルではこのままでも大丈夫ですが、今回の場合はDocker上で動かしていたのでDockerfileで使用するGo imageのバージョン指定もアップデートしました。

```
FROM golang:1.18-alpine
```
