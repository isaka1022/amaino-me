---
title: "Macの濁点、半濁点問題"
description: "WEBアプリケーションの開発時に、あるモデルのタイトルで検索する機能を作成していた際に起こった問題についてです。"
pubDate: "2022-07-13"
category: "tech"
tags: ["Mac"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/mac-nfc-nfd/"
heroImage: "/blog/wp-content/uploads/2022/07/技術ブログアイキャッチ-2.jpg"
---

WEBアプリケーションの開発時に、あるモデルのタイトルで検索する機能を作成していた際に起こった問題についてです。

## 起きたこと

検索フォームから入力された文字列に対して、タイトルが一致するモデルを返すような実装をし、動作確認。

アルファベットなどは問題なかったのですが、どうも濁点があるものについて検索がうまく動作しませんでした。

## Macの濁点、半濁点問題

調べてみると、Macの濁点と半濁点問題というものを見つけました。

- Macの文字コードは「UTF-8-Mac」というNFDの変種が使われている。
- UTF-8-Macでは、濁点・半濁点文字、例えば「プ」を「フ」と「゜」、「ブ」を「フ」と「゛」の二文字を合成して表現する。

## 文字コードとは

Unicodeは「符号化文字集合」と言われ、世界中の文字を集め、それぞれの文字に対して番号をつけて管理したものです。

この符号化文字集合をコンピュータで扱うには、符号化形式に従って数値変換します。このときの符号化の方法として、UTF-8、UTF-16などがあります。

## NFC/NFDとは

このUnicodeでは、1つの文字を表すのに複数の文字を組み合わせることができます。例えば「うぉ」とか「が」とかですね。

この際に、検索や置換のしやすさから合成した文字を一意な記号で表現したいため、正規化が行われます。

この正規化の方式がNFC、NFDになります。

- NFC: Normalization Form Canonical Composition(合成済の文字)
- NFD: Normalization From Canonical Decomposition(複数文字を結合した文字列)

## Macのファイルシステム HFS Plus

MacではHFS+（Mac OS 拡張フォーマット）というファイルシステムが使用されています。

このHFS+では、NFDに正規化されて文字が処理されるのです。

これが原因で濁点の場合に引っかかったり引っかからなかったりする場合があるようです。

日本語の名前で検索する場合には、検索フォームから送られる文字列とファイル名を正規化してから照合する必要がありそうでした。

## 参考

https://tech.synapse.jp/entry/2019/10/01/133000

[https://qiita.com/damassima/items/1813af7e501994aa0cf8](https://qiita.com/damassima/items/1813af7e501994aa0cf8)

[https://qiita.com/scrpgil/items/19230f636851d291df0f](https://qiita.com/scrpgil/items/19230f636851d291df0f)

[https://www.gixo.jp/blog/12465/](https://www.gixo.jp/blog/12465/)

[https://qiita.com/knaka/items/48e1799b56d520af6a09](https://qiita.com/knaka/items/48e1799b56d520af6a09)

[https://ja.wikipedia.org/wiki/HFS\_Plus](https://ja.wikipedia.org/wiki/HFS_Plus)

https://t2y.hatenablog.jp/entry/2019/06/29/150125#:~:text=NFC%2FNFD%20%E5%95%8F%E9%A1%8C%E3%81%A8%E3%81%AF&text=Unicode%20%E3%81%A7%E3%81%AF1%E3%81%A4%E3%81%AE%E6%96%87%E5%AD%97,NFC%E3%80%81NFD%20%E3%81%A8%E5%91%BC%E3%81%B3%E3%81%BE%E3%81%99%E3%80%82
