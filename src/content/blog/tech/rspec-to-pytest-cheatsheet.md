---
title: "RSpecでのテクニックをpytestで実行するための逆引きメモ"
description: "背景  副業のプロダクト開発で、pytestを使ってユニットテストを書いています。 それまでRubyのRSpecでしか書いたことがなく、他の言語・フレームワークでのテストの書き方について戸惑った箇所があったので、今回は僕と同じようにRSpecを書いていた人がpytestを書くときに役立つような話を書きたいと思います。  https://rspec.info/  https://pytest.org"
pubDate: "2022-12-21"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/rspecでのテクニックをpytestで実行するための逆引きメモ"
tags: ["Python", "テスト", "pytest"]
---
# 背景

副業のプロダクト開発で、pytestを使ってユニットテストを書いています。
それまでRubyのRSpecでしか書いたことがなく、他の言語・フレームワークでのテストの書き方について戸惑った箇所があったので、今回は僕と同じようにRSpecを書いていた人がpytestを書くときに役立つような話を書きたいと思います。

https://rspec.info/

https://pytest.org/


# 知っておいてよかったこと
普段はRSpecでの書き方に慣れているため、pytestでのテストの書き方に最初は戸惑っていましたが、いくつかpytestでもRSpecでよく使う機能と同じことができることがわかりましたので、よくつかうものを紹介します。

## pytestでは`-k`オプションをつけることで、実行するテストを指定できる

まずはテストの実行時です。
RSpecでは、実行ファイルを指定した後に`:`を続けて実行する行数も指定することできます。

```
$ rspec spec/sample_spec.rb:12
```

pytestでは`-k`オプションをつけることで、実行するテストを指定することができます。
ただし、渡した文字列と完全一致ではなくて部分一致するテストが実行されるので、注意です。

```
$ pytest -k sample_test
```
とした場合には`sample_test`を含む`sample_test_1`や　`sample_test_2`という名前のテストが実行されます。


# fixtureでテスト前にモックやダミーデータの準備ができる

RSpecではbefore句を使うことでテスト前に実行したい処理を記述できます。

```ruby
before do
   # テスト前に実行したい処理
end
```

https://relishapp.com/rspec/rspec-core/v/2-0/docs/hooks/before-and-after-hooks

こちらはpytestではfixtureを使ってデータを用意したりします。

https://docs.pytest.org/en/6.2.x/fixture.html

下記で使い方を書いたので、もしご興味があればこちらも読んでいただければと思います。

/blog/tech/クリーンアーキテクチャでの依存層をpytestのfixtureでモックすることで簡単にテストした


# ダミーデータを用意するにはfactory_boyが使える

ダミーデータの用のために、僕はRSpecではfactorybotを用いて実現してきました。

```ruby
FactoryBot.define do
  factory :user do
    name { 'name' }
  end
end
```

https://github.com/thoughtbot/factory_bot_rails

これと同様のものを、pytestではfactoryboyを使って実現できます。

```python
import factory
from app.models import User

class UserFactory():
    class Meta:
        model = User
    name = 'name'
```

https://factoryboy.readthedocs.io/en/stable/


# `pdb.set_trace()`でデバッガを呼び出せる

テストの途中でコンソールを使ってデバッグを行いたいときなどにはRailsだと`binding.pry`などを使います。

```ruby
requre 'pry';binding.pry
```

pytestではどうする`pdb.set_trace()`を使うことができます。

```python
import pdb
pdb.set_trace()
```

また、実行時に`--pdb`オプションをつけてテスト実行すると、テストが失敗した際に自動的にデバッガを起動してくれるので便利です。

```
$ pytest --pdb sample_test
```


# 参考

https://qiita.com/sugarpot/items/53fbf92002781731efce

https://nwpct1.hatenablog.com/entry/python-pytest-tox-pdb
