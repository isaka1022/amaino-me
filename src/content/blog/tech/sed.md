---
title: "sedコマンドの使い方"
description: "開発中にsedコマンドを使うことがあったので、備忘録として残しておきます。"
pubDate: "2022-07-11"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/sed/"
---

開発中にsedコマンドを使うことがあったので、備忘録として残しておきます。

sedコメントはLinux(Unix)上で文字列を処理する際に使用するコマンド。

## sedコマンドとは

sed: **s**tream **ed**itorの略称のようです。

## sedコマンドの使い方

下記の方法で使うことができます。

```
sed [オプション] コマンド 入力ファイル名
```

## sedコマンドの仕様例

下記のようなテキストファイルを用意します。

```
this is sample
hoge
fuga
piyo
```

### 条件に一致した最初の箇所を置換する

```
s/正規表現/置換文字列/フラグ
```

このような形でスクリプトを実行することができます。

```
$ sed -e 's/this/This/' sample.txt
# sコマンドは正規表現でパターンマッチさせる
This is sample
hoge
fuga
piyo 


```

### 条件に一致する全ての箇所を置換する

```
$ sed -e 's/a/A/g' sample.txt
# gフラグは1つの行で複数マッチ可能にする
this is sAmple
hoge
fugA
piyo
```

### 条件に一致する文字列を削除する

```
$ sed -e 's/g//g' sample.txt
this is sample
hoe
fua
piyo
```

### 直接ファイルを編集する

\-i オプションを使用します。

```
$ cat sample.txt
this is sample
hoge
fuga
piyo

$ sed -i txt '/a/d' sample.txt

$ cat sample.txt
hoge
piyo
```

## 参考サイト

https://tech-blog.rakus.co.jp/entry/20211022/sed#sed-%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%81%A8%E3%81%AF

[https://memo.open-code.club/sed/%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89/%E7%BD%AE%E6%8F%9B.html](https://memo.open-code.club/sed/%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89/%E7%BD%AE%E6%8F%9B.html)
