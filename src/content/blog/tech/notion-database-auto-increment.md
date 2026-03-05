---
title: "NotionのDatabaseでID列を作って自動採番（auto increment/オートインクリメント）を実現する"
description: "Notionでデータベースを作成したときに、下記のようにNewで新しい行を追加したときにID列のを自動採番したかったのですが、やり方がわかりづらかったのでその手順と仕組を紹介します。 ![スクリーンショット 2022-12-14 23.27.49.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/504f"
pubDate: "2022-12-15"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/notionのdatabaseでid列を作って自動採番auto-incrementオートインクリメントを実現する"
tags: ["Notion"]
---
Notionでデータベースを作成したときに、下記のようにNewで新しい行を追加したときにID列のを自動採番したかったのですが、やり方がわかりづらかったのでその手順と仕組を紹介します。
![スクリーンショット 2022-12-14 23.27.49.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/504f0c8a-77b3-0cc0-0824-90d809940733.png)

こちらのページをそのまま使わせていただきました。

https://notionthings.com/2022/03/06/auto-increment-table-row-ids/

# NotionのDatabaseで自動採番列を作る方法

Notionのデータベースのデフォルトの機能では自動採番がまだ実装されていないようで、少し複雑な処理を自分で作る必要があります。

## 1. テーブルを作成する

まずは対象となるデータベースを作成して、最初にLong ID列を用意します。今回はSampleという名前のテーブルを作成しました。
Formulaで`id()`を返すように設定しておきます。

![スクリーンショット 2022-12-14 23.49.45.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/0c9d2682-45c5-e26e-b12d-b0ed91c12eb3.png)

## 2. 親となる別のテーブルを用意する

1.で作成したテーブルとは別に、参照用の親テーブルを作成します。
今回はMasterという名前で作成しました。そのテーブルに同じくMasterという名前のレコードを1つだけ作成しておきます。

![スクリーンショット 2022-12-15 0.16.28.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/8d28764e-2297-be6a-1980-31c8fc8b06a0.png)


## 3. 親へのRelationを設定する

SampleテーブルのPropertyでMasterへのRelationを双方向で作成します。
こちらのスクショの後に、Show on MasterプロパティをONにしてください。

![スクリーンショット 2022-12-14 23.35.03.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/150bebb7-3383-a0fb-ae95-479d9c491974.png)


## 4. テーブルのFilterで親テーブルのレコード名を設定する

![スクリーンショット 2022-12-14 23.57.49.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/6f3e7788-968a-a53c-5c4a-5d90ff956d40.png)


## 5. 親テーブルのCreated IDs Rollup列を作成する

MasterテーブルにCreated IDｓ Rollupという名前の列を作り、SampleテーブルのLong　IDを参照する列を作ります

![スクリーンショット 2022-12-15 0.06.24.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/5075ecb6-bd49-b294-163c-58e6f87a58db.png)


## 6.  親テーブルにCreated IDs列を作ってCreated IDs Rollup列を参照するようにする


![スクリーンショット 2022-12-15 0.07.35.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/d19f6901-0eeb-5d66-5041-d01e509b1a28.png)

## 7. 親テーブルのCreated IDsをRollupして参照する列を追加

![スクリーンショット 2022-12-15 0.08.46.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/28470fc4-feba-acea-ad07-684c65bda16a.png)


## 8. テーブルのID列下記のFormulaを入力する

```
length(replaceAll(replaceAll(replaceAll(prop("Created IDs"), format(prop("Long ID")), "T"), "[^T]*$", ""), "[^,]", "")) + 1
```

![スクリーンショット 2022-12-15 0.09.20.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/d00fd8db-3138-ba59-c156-d5843dbb5a86.png)


これでできるようになったはずです。


## 解説

親テーブルと対象となるテーブルでIDをRollupして通すことにより、全レコードのIDが連続して取得できます。
それに対して、自分自身のLongID以降のIDを削除し、区切り文字であるカンマの数を数えることで自動採番を実現しています。

# 参考

https://notionthings.com/2022/03/06/auto-increment-table-row-ids/

https://dev.classmethod.jp/articles/create-task-dependencies-with-notion-relation/
