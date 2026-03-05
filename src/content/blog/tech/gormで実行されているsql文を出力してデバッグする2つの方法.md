---
title: "GORMで実行されているSQL文を出力してデバッグする2つの方法"
description: "TL;DR Go言語のORMライブラリであるGORMを使った開発にて、SQL文を確認しながら実行する方法をご紹介します。  https://gorm.io/ja_JP/docs/index.html  単一のSQLを確認したいとき    go db.Debug().Create(&Product{Code: \"D42\", Price: 100})      全体の流れを追いたいとき    go d"
pubDate: "2022-12-05"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/gormで実行されているsql文を出力してデバッグする2つの方法"
tags: ["Go", "debug", "GORM"]
---

# TL;DR
Go言語のORMライブラリであるGORMを使った開発にて、SQL文を確認しながら実行する方法をご紹介します。

https://gorm.io/ja_JP/docs/index.html

単一のSQLを確認したいとき
```go
db.Debug().Create(&Product{Code: "D42", Price: 100})
```

全体の流れを追いたいとき
```go
db.Logger = db.Logger.LogMode(logger.Info)
```

と処理を追加すれば標準出力にSQL文が出力されるようになります。


# サンプルコード
GORMのサンプルコードを少し改変して、DB処理を含むGoのコードを書いてみました。

https://gorm.io/ja_JP/docs/index.html

```go:main.go
package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	ID    int `gorm:"AUTO_INCREMENT"`
	Code  string
	Price uint
}

type dbConfig struct {
	Username string
	Userpass string
	Host     string
	Port     string
	Name     string
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic("Error loading .env file")
	}

	var config dbConfig
	err = envconfig.Process("db", &config)

	if err != nil {
		log.Fatal(err.Error())
	}

	dsn := config.Username + ":" + config.Userpass + "@(" + config.Host + ":" + config.Port + ")/" + config.Name + "?charset=utf8&parseTime=true"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Product{})
	db.Create(&Product{Code: "D42", Price: 100})

	var product Product
	db.First(&product)

	db.Model(&product).Update("Price", 200)
	db.Model(&product).Updates(Product{Price: 200, Code: "F42"})

	db.Delete(&product, product.ID)
}

```

こちらのコードを実行してみると、正常終了はしているのですが、本当にDBへの処理が実施されているのかはわかりません。

```
$ go run main.go
$
```

このあとにDBを参照して意図しない結果になっていたときなど、SQL文を確認しながらデバッグしたいケースがあります。


# GORMでのSQLを確認する方法

そのような場合に使える2つの方法を今回は紹介したいと思います。

## 一つの処理のSQL文を見たいときには`Debug()`にて行う

GORMにはデバッグモードというものがあり、これをつけるとSQL文が確認できます。
```go:main.go
db.Debug().Create(&Product{Code: "D42", Price: 100})
```
こちらを追加することで、その処理で実行されるSQLが表示されるようになります。

```zsh
$ go run main.go
2022/12/04 22:12:31 /Users/amane/sandbox/gorm-test/main.go:47
[8.092ms] [rows:1] INSERT INTO `products` (`created_at`,`updated_at`,`deleted_at`,`code`,`price`) VALUES ('2022-12-04 22:12:31.739','2022-12-04 22:12:31.739',NULL,'D42',100)
$
```
## 全体の流れを追いたいときには`db.Logger.LogMode(logger.Info)`でログの出力設定を変更する

とはいえ全部の処理に`Debug()`をつけていくのはなかなか大変です。
そんなときには`db`への代入後に`db.Logger.LogMode(logger.Info)`としてGORMのロガーの出力設定を変更すればSQLを出力してあげます。

```diff_go:main.go
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
+ db.Logger = db.Logger.LogMode(logger.Info)
if err != nil {
	panic("failed to connect database")
}
```
こちら、v1までは`db.LogMode(true)`という設定で出力できていたのですが、v2から変更になったようです。

https://qiita.com/earl2/items/e2ae573128d077cf088e#v2-2

```zsh
$ go run main.go

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[1.094ms] [rows:-] SELECT DATABASE()

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[3.301ms] [rows:1] SELECT SCHEMA_NAME from Information_schema.SCHEMATA where SCHEMA_NAME LIKE 'sampledb_for_gorm%' ORDER BY SCHEMA_NAME='sampledb_for_gorm' DESC,SCHEMA_NAME limit 1

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[3.084ms] [rows:-] SELECT count(*) FROM information_schema.tables WHERE table_schema = 'sampledb_for_gorm' AND table_name = 'products' AND table_type = 'BASE TABLE'

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[1.438ms] [rows:-] SELECT DATABASE()

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[3.784ms] [rows:1] SELECT SCHEMA_NAME from Information_schema.SCHEMATA where SCHEMA_NAME LIKE 'sampledb_for_gorm%' ORDER BY SCHEMA_NAME='sampledb_for_gorm' DESC,SCHEMA_NAME limit 1

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[2.544ms] [rows:-] SELECT * FROM `products` LIMIT 1

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[6.874ms] [rows:-] SELECT column_name, column_default, is_nullable = 'YES', data_type, character_maximum_length, column_type, column_key, extra, column_comment, numeric_precision, numeric_scale , datetime_precision FROM information_schema.columns WHERE table_schema = 'sampledb_for_gorm' AND table_name = 'products' ORDER BY ORDINAL_POSITION

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[2.117ms] [rows:-] SELECT DATABASE()

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[4.339ms] [rows:1] SELECT SCHEMA_NAME from Information_schema.SCHEMATA where SCHEMA_NAME LIKE 'sampledb_for_gorm%' ORDER BY SCHEMA_NAME='sampledb_for_gorm' DESC,SCHEMA_NAME limit 1

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:48
[4.775ms] [rows:-] SELECT count(*) FROM information_schema.statistics WHERE table_schema = 'sampledb_for_gorm' AND table_name = 'products' AND index_name = 'idx_products_deleted_at'

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:49
[7.892ms] [rows:1] INSERT INTO `products` (`created_at`,`updated_at`,`deleted_at`,`code`,`price`) VALUES ('2022-12-04 22:18:22.625','2022-12-04 22:18:22.625',NULL,'D42',100)

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:52
[2.450ms] [rows:1] SELECT * FROM `products` WHERE `products`.`deleted_at` IS NULL ORDER BY `products`.`id` LIMIT 1

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:54
[8.584ms] [rows:1] UPDATE `products` SET `price`=200,`updated_at`='2022-12-04 22:18:22.635' WHERE `products`.`deleted_at` IS NULL AND `id` = 8

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:55
[6.597ms] [rows:1] UPDATE `products` SET `updated_at`='2022-12-04 22:18:22.644',`code`='F42',`price`=200 WHERE `products`.`deleted_at` IS NULL AND `id` = 8

2022/12/04 22:18:22 /Users/amane/sandbox/gorm-test/main.go:57
[5.562ms] [rows:1] UPDATE `products` SET `deleted_at`='2022-12-04 22:18:22.65' WHERE `products`.`id` = 8 AND `products`.`id` = 8 AND `products`.`deleted_at` IS NULL
```


こうすることで、SQL文を確認しながらDB処理を追えるようになりデバッグがかなりやりやすくなりました🎉


# 【応用】環境変数で簡単に切り替えられるようにする
毎回`db.Logger = db.Logger.LogMode(logger.Info)`を書いていくのも大変なので、環境変数でによる分岐を加えると、`.env`のコメントアウトを切り替えるだけでログ出力を設定できて便利そうです。


```diff:.env
 DEBUG_MODE=true
```

```go
if _, isDebugMode := os.LookupEnv("DEBUG_MODE"); isDebugMode {
	db.Logger = db.Logger.LogMode(logger.Info)
}
```

```diff:.env
ENVIRONMENT=production
```

さらに応用すれば、環境ごとにログレベルを切り替えるようなこともできそうです。

```go
if environment, _ := os.LookupEnv("ENVIRONMENT"); environment == "development" {
    db.Logger = db.Logger.LogMode(logger.Info)
}
```


ぜひみなさんのGORM開発の参考になれば幸いです。
今回使用したサンプルコードについてはDockerファイルと合わせてgithubにおいておくので、興味がある方は手元でも試してみてください。

https://github.com/isaka1022/gorm-debug-sample

# 参考

https://www.naka-sys.okinawa/golang-gorm-debug-mode/

https://zenn.dev/a_ichi1/articles/c9f3870350c5e2
