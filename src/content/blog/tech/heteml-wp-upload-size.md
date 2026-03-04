---
title: "【WordPress】hetemlサーバーにてファイルアップロードサイズの上限を引き上げる方法"
description: "自作のWordPressテーマをzipでアップロードしようとして、「辿ったリンクは期限が切れています。」というエラーが出ました。"
pubDate: "2021-04-30"
category: "uncategorized"
source: "techblog"
originalUrl: "https://techblog.amaino.me/uncategorized/heteml-wp-upload-size/"
---

自作のWordPressテーマをzipでアップロードしようとして、「辿ったリンクは期限が切れています。」というエラーが出ました。

調べてみると、WordPressでの最大アップロード可能容量が5MBに制限されているようです。

これを治すために、レンタルサーバーのphp.iniを編集する必要があるのですが、結構ハマったので備忘録。

## 解決までの手順

WordPressのサイトヘルスから、使用しているphpのバージョンを確認。

hetemlのコントロールパネルのphpのバージョンを上記のバージョンと合わせる。

そこで最大アップロード容量を5MBから引き上げる

解決
