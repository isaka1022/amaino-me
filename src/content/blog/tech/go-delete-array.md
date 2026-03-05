---
title: "Go言語で配列の要素を削除する方法"
description: "いつもはRubyを使って開発していると、例えば以下のようにある配列の要素を消したいときにはdeleteのようなメソッドを使って消去することができます。"
pubDate: "2022-07-15"
category: "tech"
tags: ["Golang"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/go-delete-array/"
heroImage: "/blog/wp-content/uploads/2022/07/技術ブログアイキャッチ-3.jpg"
---

いつもはRubyを使って開発していると、例えば以下のようにある配列の要素を消したいときにはdeleteのようなメソッドを使って消去することができます。

```
irb(main):001:0> array = [1,2,3]
=> [1, 2, 3]
irb(main):002:0> array.delete(2)
=> 2
irb(main):003:0> array
=> [1, 3]
```

しかし個々最近、Go言語を使って開発を行うようになった際に、これってGo言語ではどのように実装するんだ？と気になって調べたのでその備忘録としての起こしておきます。

## Go言語で配列の要素を削除する方法

結論から言うと、Go言語では上記のようにメソッドの呼び出しで配列から要素を削除することはできないようです。

Goの[SliceTricks](https://github.com/golang/go/wiki/SliceTricks)によると以下の方法が紹介されています。

```
a = append(a[:i], a[i+1:]...)
// or
a = a[:i+copy(a[i:], a[i+1:])]
```

順番を気にしなくてもよい場合は以下のようになります。

```
a[i] = a[len(a)-1] 
a = a[:len(a)-1]
```

## Go言語のスライスの仕組み

なぜこのような形で削除ができるのか、それぞれコードと一緒に読み解いてみます。

そもそもGo言語のSliceというのは配列へのポインタ、セグメントの長さ、その容量を持つstructから構成されます。

appedという関数は、もとの配列の要素をコピーしてlenを更新する処理を行います。

```
a = append(a[:i], a[i+1:]...)
```

ここではaという配列のi番目までの要素に、aのi+1番目以降の配列をくっつけたものを合成しています。

ちなみに、スライス変数のあとに...をつけることによって、スライスを展開しています。

```
a = a[:i+copy(a[i:], a[i+1:])]
```

こちらに関してはaという配列のi番目以降に、aのi+1番目以降をコピー（i番目の要素を詰める）して、aのiまでの要素を代入しなおすことを行っています。

```
a[i] = a[len(a)-1] 
a = a[:len(a)-1]
```

こちらに関してはわかりやすいです。末尾の要素をi番目の要素にコピーして、最後の要素を抜いた配列をもとの配列の変数に格納しました。

## 参考

[https://zenn.dev/mattn/articles/31dfed3c89956d](https://zenn.dev/mattn/articles/31dfed3c89956d)

[https://go.dev/blog/slices-intro](https://go.dev/blog/slices-intro)

[https://github.com/golang/go/wiki/SliceTricks](https://github.com/golang/go/wiki/SliceTricks)

[https://zenn.dev/yuzuy/articles/ff8fe5c6cfee80](https://zenn.dev/yuzuy/articles/ff8fe5c6cfee80)

[https://qiita.com/hnakamur/items/c3560a4b780487ef6065](https://qiita.com/hnakamur/items/c3560a4b780487ef6065)
