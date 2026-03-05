---
title: "GORMのアソシエーションの自動更新で削除した関連が復活していた"
description: "起きたこと GORM(v1.9.16)を使っていて、アソシエーションの削除がうまくいかなかったときにハマったのでその時の調査メモです。 Productモデルと、そこに紐づくShopモデルを並行して更新するようなプログラムを作成していました。     go:main.go package main  import ( \t\"github.com/my-best/products.my-best.com"
pubDate: "2022-12-25"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/gormのアソシエーションの自動更新で削除した関連が復活していた"
tags: ["Go", "GORM"]
---

# 起きたこと
GORM(v1.9.16)を使っていて、アソシエーションの削除がうまくいかなかったときにハマったのでその時の調査メモです。
Productモデルと、そこに紐づくShopモデルを並行して更新するようなプログラムを作成していました。

```go:main.go
package main

import (
	"github.com/my-best/products.my-best.com/go/internal/models"
	"golang.org/x/sync/errgroup"
)

func main() error {
    var product models.Product
    eg := errgroup.Group{}
    eg.Go(func() error { return updateProduct(&product) })
    eg.Go(func() error { return updateProductShop(&product})
    // 略
}
```

`updateProductShop`の内部では不要になった`Shops`を削除するような処理が書かれていました。
```go:update_product_shop.go
err := db.GetDB().Transaction(func(tx *gorm.DB) error {
    db.GetDB().Model(&product).Related(&product.Shops)
    for _, shop := range product.Shops {
        if err := tx.Delete(&shop).Error; err != nil {
            return fmt.Errorf("既存のShopの削除中にエラーが発生しました: %v", err)
        }
    }
}
```

ところが、実際に`main.go`を回し終わっても、削除されているはずの`Shop`が残ってしまっていました。

# Save(&product)にて関連が上書きされてしまっていた

ログを確認してみると、下記のようになっていました。（一部抜粋）

```
// updateProductShopの処理
[2022-07-12 10:51:16]  [2.35ms]  SELECT * FROM `shops`  WHERE (`product_id` = 17821591)
[1 rows affected or returned ]
[2022-07-12 10:51:16]  [1.40ms]  DELETE FROM `shops`  WHERE `shops`.`id` = 155648
[1 rows affected or returned ]
// updateProductの処理
[2022-07-12 10:51:17]  [1.85ms]  SELECT * FROM `products`  WHERE (product_id = 17821591)
[0 rows affected or returned ]
[2022-07-12 10:51:17]  [1.59ms]  UPDATE `products` SET （略） WHERE `products`.`id` = 17821591
[1 rows affected or returned ]
[2022-07-12 10:51:17]  [1.51ms]  UPDATE `shops` SET `product_id` = 17821591,　（略） WHERE `yahoo_shops`.`id` = 155648
[0 rows affected or returned ]
```
これを確認してみると、`updateProductShop`ではたしかに削除ができているのですが、`updateProduct`でなぜか削除したはずのshopのUPDATEが行われていることがわかります。

こちらを実行元を見てみると、
```go
db.GetDB().Save(&product)
```
が呼ばれていました。

# AssociationのDeleteも合わせて行う

どうやらGORMでは単にShopを削除するだけではなくて、関連も削除してあげないといけなかったようです。

> GORMはレコードの作成・更新時にUpsertを使用して自動的に関連データとその参照を保存します

https://gorm.io/ja_JP/docs/associations.html#%E9%96%A2%E9%80%A3%E3%82%92%E5%89%8A%E9%99%A4%E3%81%99%E3%82%8B

```diff_go:update_product_shop.go
err := db.GetDB().Transaction(func(tx *gorm.DB) error {
    db.GetDB().Model(&product).Related(&product.Shops)
    for _, shop := range product.Shops {
        if err := tx.Delete(&shop).Error; err != nil {
            return fmt.Errorf("既存のShopの削除中にエラーが発生しました: %v", err)
        }
    }
}
+if err := db.GetDB().Model(&product).Association("Shops").Delete(shop).Error; err != nil {
+    return fmt.Errorf("関連の削除に失敗しました: %v", err)
+}
```

このように書くことで暫定対応しました。

# Omitオプション

恒久対応としては、他箇所のdb.GetDB().Save(&product)の箇所にOmitオプションを付けるのが良さそうです

> 作成/更新時のアソシエーションレコードの自動保存をスキップするには、 Select または Omit を使用します。


https://gorm.io/ja_JP/docs/associations.html#%E3%82%A2%E3%82%BD%E3%82%B7%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E8%87%AA%E5%8B%95%E4%BD%9C%E6%88%90-x2F-%E6%9B%B4%E6%96%B0%E3%82%92%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97
