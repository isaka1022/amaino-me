---
title: "Railsのポリモーフィック関連を使って多対多を実現する"
description: "個人開発として金沢観光情報サービスの[https://notear.net](https://notear.net)を開発中にポリモーフィック関連でコードをすっきりさせたかったのでそのときに調べたことを書きます。"
pubDate: "2022-01-10"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/rails-polymorphic/"
---

個人開発として金沢観光情報サービスの[https://notear.net](https://notear.net)を開発中にポリモーフィック関連でコードをすっきりさせたかったのでそのときに調べたことを書きます。

## ポリモーフィズムとは

### オブジェクト指向の3大要素

カプセル化、継承と並ぶ、オブジェクト指向の3大要素のうちの一つです。  

### ダックタイピング

> "If it walks like a duck and quacks like a duck, it must be a duck"
> 
> 「もしもそれがアヒルのように歩き、アヒルのように鳴くのなら、それはアヒルである」
> 
> https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%83%E3%82%AF%E3%83%BB%E3%82%BF%E3%82%A4%E3%83%94%E3%83%B3%E3%82%B0

オブジェクトの実態が違っても、決まった振る舞い（同じメソッドを呼び出すなど）をすることで、同じオブジェクトとして扱えることです。

いちいちオブジェクトの実態のことを考えてコードを書いていたらコードは汚くなるし、大変です。  
メソッド（命令）を全部同じ名前で使えば、その内容についてはオブジェクトごとに勝手に変わっても大丈夫になります。

## ポリモーフィック関連

ポリモーフィック関連とは、このポリモーフィズムを使ってモデルを関連づけることを言います。

## やりたかったこと

例えばnotear.netでは、Cafe(カフェ)とSpot(観光スポット)をタグで検索できる機能をつけようと思いました。1つのSpotあるいはCafeに対して複数のSearchTag（タグ）が付随するようになります。

このときに、ポリモーフィックを使わないと、

```
class Cafe < ApplicationRecord
  has_many :search_tags, through: :cafe_search_tags
  has_many :cafe_search_tags
end

class Spot < ApplicationRecord
  has_many :search_tags, through: :spot_search_tags
  has_many :spot_search_tags
end

class CafeSearchTag < ApplicationRecord
  belongs_to :cafe
  belongs_to :search_tag
end

class SpotSearchTag < ApplicationRecord
  belongs_to :spot
  belongs_to :search_tag
end

class SearchTag < ApplicationRecord
  has_many :cafe_search_tags
  has_many :spot_search_tags
end


```

このようにCafeとSpotそれぞれと、SeachTagとの間に中間テーブルを定義してあげないといけません。

さらにこの書き方だと、SearchTagから観たときに、それがSpotにあるのかCafeにあるのかをチェックしなければいけません。  
例えばあるタグが付随するCafeとSpotを引っ張りたいときなどは大変です。

そこでポリモーフィック関連を使って、以下のように書くことができました。

```
class Cafe < ApplicationRecord
  has_many :search_tags, through: :destination_search_tags
  has_many :destination_search_tags, as: :destinationable
end

class Spot < ApplicationRecord
  has_many :search_tags, through: :destination_search_tags
  has_many :destination_search_tags, as: :destinationable
end

class DestinationSearchTag < ApplicationRecord
  belongs_to :destinationable, polymorphic: true
  belongs_to :search_tag
end

class SearchTag < ApplicationRecord
  has_many :destination_search_tags
end
```

## 参考サイト

[https://railsguides.jp/association\_basics.html#%E3%83%9D%E3%83%AA%E3%83%A2%E3%83%BC%E3%83%95%E3%82%A3%E3%83%83%E3%82%AF%E9%96%A2%E9%80%A3%E4%BB%98%E3%81%91](https://railsguides.jp/association_basics.html#%E3%83%9D%E3%83%AA%E3%83%A2%E3%83%BC%E3%83%95%E3%82%A3%E3%83%83%E3%82%AF%E9%96%A2%E9%80%A3%E4%BB%98%E3%81%91)

[https://qiita.com/itkrt2y/items/32ad1512fce1bf90c20b](https://qiita.com/itkrt2y/items/32ad1512fce1bf90c20b)

[https://qiita.com/kamohicokamo/items/c13f72d720040cfd796d](https://qiita.com/kamohicokamo/items/c13f72d720040cfd796d)

[https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%83%E3%82%AF%E3%83%BB%E3%82%BF%E3%82%A4%E3%83%94%E3%83%B3%E3%82%B0](https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%83%E3%82%AF%E3%83%BB%E3%82%BF%E3%82%A4%E3%83%94%E3%83%B3%E3%82%B0)

[https://qiita.com/yuto-ktok/items/2c8172397ba9dc76fe7a](https://qiita.com/yuto-ktok/items/2c8172397ba9dc76fe7a)
