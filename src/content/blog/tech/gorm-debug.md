---
title: "【Golang】Gormでデバッグを行う"
description: "Gormを使ったアプリケーションの開発を行っていて、デバッグを行いたかった時の備忘録です。"
pubDate: "2022-07-12"
category: "tech"
tags: ["Golang"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/gorm-debug/"
heroImage: "/blog/wp-content/uploads/2022/07/技術ブログアイキャッチ-1.jpg"
---

Gormを使ったアプリケーションの開発を行っていて、デバッグを行いたかった時の備忘録です。

公式サイトを見てもすこしわかりづらかったので調べて使ったことをまとめました。

## やりたいこと

今回やりたかったことは、gormを使って実装した処理がうまく作用していなかったため、実際にどのようなSQLが実行されているのかを調べることです。

例えば以下のようなコードがあったとして、このproductモデルの削除がなぜかうまく行かない場合にデバッグする際に今回の方法を使いました。

```
if err := db.GetDB().Delete(&product).Error; err != nil {
 return fmt.Errorf("の削除に失敗しました: %v", err)
}
```

## 単一のクエリを見る

```
db.GetDB().Delete(&product)
```

こちらの処理で発生するSQL文を確認したいときにはdb.GetDB()のあとにDebug()をつけて上げるだけでOKです。

```
db.GetDB().Debug().Delete(&product)
```

以下のように、Debug()生成されるSQLが出ます。

```
(/sandbox/sample.go:2)
[2022-07-12 11:32:43] [1.70ms] DELETE FROM `products` WHERE (id = 17821591)
[1 rows affected or returned ]
```

## 実行する全てのSQLを表示させる

一方で、毎回全ての箇所にDebug()をつけるのは面倒なので、goのコマンドを実行した際に実行される全てのSQLを見たいときには、gormのdbの初期化の際にオプションを指定します。

```
db, err = gorm.Open("mysql", command)
db.LogMode(true)
```

これで全てのログがコンソールから確認できます。

```
(/app/internal/lib/sample.go:31)
[2022-07-12 11:24:39] [1.65ms] SELECT * FROM `products` WHERE (`id` = 17821591)
[1 rows affected or returned ]

(/app/internal/lib/sample.go:32)
[2022-07-12 11:24:39] [1.46ms] SELECT * FROM `products` WHERE (id = 17821591) ORDER BY `shop`.`price` ASC LIMIT 1
[0 rows affected or returned ]

(/app/internal/lib/sample.go:33)
[2022-07-12 11:24:39] [1.39ms] DELETE FROM `products` WHERE `shop`.`id` = 155649 AND ((`shop`.`id` = 155649))
[1 rows affected or returned ]

(/app/internal/lib/sample.go:34)
[2022-07-12 11:24:39] [1.43ms] DELETE FROM `products` WHERE (id = 17821591)
[1 rows affected or returned ]
```

これでデバッグがだいぶやりやすくなりました！

## 参考

[https://gorm.io/ja\_JP/docs/logger.html](https://gorm.io/ja_JP/docs/logger.html)

[https://www.naka-sys.okinawa/golang-gorm-debug-mode/](https://www.naka-sys.okinawa/golang-gorm-debug-mode/)

[https://kamykn.github.io/post/gorm%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%82%AF%E3%82%A8%E3%83%AAsql%E6%96%87%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B/](https://kamykn.github.io/post/gorm%E3%81%A7%E5%AE%9F%E8%A1%8C%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E3%82%AF%E3%82%A8%E3%83%AAsql%E6%96%87%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B/)
