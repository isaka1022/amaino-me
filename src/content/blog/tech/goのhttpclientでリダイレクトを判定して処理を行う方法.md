---
title: "Goのhttp.Clientでリダイレクトを判定して処理を行う方法"
description: "TL;DR  GoでHTTPリクエストを送信送るnet/httpライブラリの http.Client はデフォルトだと自動リダイレクトする仕様ですが、 http.Client.CheckRedirect をオーバーライドすればリダイレクトする前の結果を返すことができます。    外部要因でリダイレクトがかかる際にシステムでエラーが起きる  Amazonの商品の分類によって処理を変えるようなシステム"
pubDate: "2022-12-18"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/goのhttpclientでリダイレクトを判定して処理を行う方法"
tags: ["Go"]
---
# TL;DR

GoでHTTPリクエストを送信送るnet/httpライブラリの`http.Client`はデフォルトだと自動リダイレクトする仕様ですが、`http.Client.CheckRedirect`をオーバーライドすればリダイレクトする前の結果を返すことができます。

# 外部要因でリダイレクトがかかる際にシステムでエラーが起きる

Amazonの商品の分類によって処理を変えるようなシステムを実装していました。
Amazonの商品は「靴」などの分類を「BrowseNodes」という単位で管理しており、こちらはAPIのドキュメントにも書かれています。

https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/browse-nodes.html

メンズスニーカーの場合、「[https://www.amazon.co.jp/b?node=2221112051](https://www.amazon.co.jp/b?node=2221112051)」というURLの「2221112051」がメンズスニーカーのBrowseNodeのIDに相当します。

![スクリーンショット 2022-12-18 14.02.37.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/acd2ebaf-a75c-39db-80ef-7a8fa690f9a8.png)

このBrowseNodeのIDをもとにしたシステムをGoにて作成していたところ、このIDがときどき変更されて、リダイレクトされていることがわかりました。事前にシステムにIDを登録しておくと、そのIDで上記のAPIを利用した際にエラーになってしまいます。

このリダイレクトをシステムで検知することができないかを考えてみたので、今回はその方法を紹介したいと思います。

# リダイレクト時にリダイレクト先を表示させるコード

こちらが実際に実装したコードです。

```go:main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	targetUrl := os.Args[1]
	c := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	resp, err := c.Get(targetUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 301 {
		fmt.Println(resp.Header["Location"][0])
	}
}

```

```sh
$ go run main.go "https://www.amazon.co.jp/b?node=15326491"
/b?node=2231280051
```


# http.Client.CheckRedirectをオーバーライドしてリダイレクト前のレスポンスを返す

HTTPのリクエストを送信するnet/httpライブラリの`http.Client`はデフォルトだと自動リダイレクトする仕様ですが、`http.Client.CheckRedirect`をオーバーライドして、エラーを返すようにすればClientのGetメソッドは、bodyが閉る前のレスポンスとCheckRedirectの結果を返してくれます。


https://pkg.go.dev/net/http#Client.CheckRedirect

今回のケースでは`ErrUseLastResponse`を返していて、これが返されると次のリクエストの前の最新の応答を返してくれます。

https://pkg.go.dev/net/http#ErrUseLastResponse

# `http.GET`の結果がリダイレクト前のものになる

これによって`http.GET`で返される結果が、リダイレクトされている場合にはリダイレクトされる前の結果が返るようになったので、ステータスコードによる分岐を追加することで、リダイレクト先のパスも取得することができるようになりました。

# 留意点

今回のコードに関しては、検討した結果として実際のプロダクションコード等では使っておりません。
スクレイピング等に使う用途を想定しておりませんので、ご注意ください。

https://topcourt-law.com/internet_security/scraping-illegal

# 参考

https://zaburo-ch.github.io/post/get-redirect-url-in-go/

https://blog.freedom-man.com/golang-nethttp-redirect
