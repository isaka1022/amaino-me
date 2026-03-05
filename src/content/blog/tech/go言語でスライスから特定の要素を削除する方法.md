---
title: "Go言語でスライスから特定の要素を削除する方法"
description: "概要  Go言語でスライスから特定の要素を消す方法がわからなかったので調べてみました。 スライスには削除の関数のようなものがないため、 append や copy などの関数を使用してスライスを操作して最終的に削除を実現していく必要があります    ハマったポイント  Goのスライスの要素を確認して、もしも消したい文字列と一致する要素があれば削除したいなと思う処理がありました。 例えば商品のJAN"
pubDate: "2022-12-08"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/go言語でスライスから特定の要素を削除する方法"
tags: ["Go", "初心者向け"]
---
# 概要

Go言語でスライスから特定の要素を消す方法がわからなかったので調べてみました。
スライスには削除の関数のようなものがないため、`append`や`copy`などの関数を使用してスライスを操作して最終的に削除を実現していく必要があります

# ハマったポイント

Goのスライスの要素を確認して、もしも消したい文字列と一致する要素があれば削除したいなと思う処理がありました。
例えば商品のJANコードなどの、string型の識別子で判定して該当の商品を削除した位ケースなどです。

Rubyであれば、そのような文字列判定での配列の削除は`delete`メソッドなどを使って下記のように実行できます。

```ruby
array = ["apple", "grape", "orange"]
# => ["apple", "grape", "orange"]
array.delete("grape")
# => "grape"
array
# => ["apple", "orange"]
```

Goでも同じことをやりたいと思ったのですがどうすればよいかわかりませんでした。

# Goのスライスの仕組み

GoのスライスはGoならではの特殊なデータ構造です。
実はスライスの裏側には配列があり、スライスが保持するのは
- 先頭の要素へのポインタ
- 長さ
- 要素数

の3つになっています。
Goの配列は固定長で使い勝手がよくないのですが、スライスによって、配列を作り変えながらデータを移し変える操作によって可変長の配列のように扱うことができます。

これが便利な反面で、削除する際には少し手間がかかるようになっています。


# Goのスライスから`i`番目の要素を削除する方法

Go wikiのSliceTricksを見てみたところ、Goのスライスでは下記の2つの方法で要素の削除ができるということでした。

## 削除後の順不同のやり方

```go
a = append(a[:i], a[i+1:]...)
// or
a = a[:i+copy(a[i:], a[i+1:])]
```

まずはこちらの処理を読んでみます、。
```go
a = append(a[:i], a[i+1:]...)
```
`Slice[:end]`と書くことで、先頭から（end - 1（までの要素を取り出せます。
また、`Slice[start:]`と書くことで、先頭から（end - 1（までの要素を取り出せます。
`append`は第一引数に与えたスライスに、第二引数以降の値を追加する関数になるので、ここで行っている操作はi -1 番目までのスライスに、i+1番目移行の値を追加する処理です。
結果的にi番目の要素が消えたスライスが作成されます。

次にこちらの処理を見てみます。
```go
a = a[:i+copy(a[i:], a[i+1:])]
```

`copy`は2つの引数で与えられたスライスにて右項から左項へコピーする関数で、戻り値はコピーした個数になります。
`copy(a[i:], a[i+1:])`を実行すると、スライスのi番目以降の要素が、i+1番目以降の要素で上書きされます。結果としてはコピーした要素が返ってくるので、`a[:i+copy(a[i:], a[i+1:])]`は最初にあった要素数-1のスライスになり、こちらもi番目の要素がなくなっているということになります。

## 順番不動での削除

```go
a[i] = a[len(a)-1] 
a = a[:len(a)-1]
```

これは削除後のスライスの順が変わってしまってもいい場合に使える方法です。
やっていることはシンプルで、スライスの最後の要素をi番目の要素に上書きし、要素数を1だけ減らしたスライスをもとのスライスに上書きしています。


https://github.com/golang/go/wiki/SliceTricks#delete

結果として今回やりたかったコードは下記のようにすれば良さそうです。
順番は考えなくても良かったので最後の方法で実現しました。

```go
var deleteTargetJan string
deleteTargetJan = "hogeCode" 
for i, product := range products {
    if product.JAN == deleteTargetJan {
    	products[i] = products[len(existingShops)-1]
    	products = products[:len(products)-1]
    }
}
```

# 自作の削除関数を用意する

もしも関数の中でなんどもスライスの削除を行う必要があるのであれば、削除関数を定義しても良さそうです。
string型のスライスの場合下記のように書けそうです。
```go
for i, product := range products {
    if product.JAN == deleteTargetJan {
    	products[i] = products[len(existingShops)-1]
    	products = products[:len(products)-1]
    }
}

func remove(slice []string,  deleteTarget: string) []string {
    result := []string{}
    for i, v := range slice {
        if v == deleteTarget {
            result = append(result[:i], result[i+1:])
        }
    }
    return result
}
```


# 感想
Goの独自の型であるスライスも最初は理解しづらかったですし、合わせてこちらの削除の処理もなかなかに大変でしたが、このように新しい学びがあるので、普段とは異なる言語を学ぶのは面白いと感じました。

# 参考

https://zenn.dev/mattn/articles/31dfed3c89956d


https://tsujitaku50.hatenablog.com/entry/2017/02/25/112049
