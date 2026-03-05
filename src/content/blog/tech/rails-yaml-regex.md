---
title: "RailsのYAMLファイルに正規表現を書いて使用する"
description: "TR;DR  YAMLファイルから正規表現を読み込むようにするには !ruby/regexp に続けて正規表現を記述すればよいです。    背景  同じアプリケーションを、複数の国や、いくつかの企業毎に環境を分けて使用したいことがあります。 このように場合の対応策のひとつとして、アプリケーションのコードは同じものを使用しつつ、環境ごとに読み込むYAMLファイルを変えることで細かな設定を調整するやり"
pubDate: "2022-12-11"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/railsのyamlファイルに正規表現を書いて使用する"
tags: ["Rails", "正規表現", "regexp", "YAML"]
---
# TR;DR

YAMLファイルから正規表現を読み込むようにするには`!ruby/regexp`に続けて正規表現を記述すればよいです。

# 背景

同じアプリケーションを、複数の国や、いくつかの企業毎に環境を分けて使用したいことがあります。
このように場合の対応策のひとつとして、アプリケーションのコードは同じものを使用しつつ、環境ごとに読み込むYAMLファイルを変えることで細かな設定を調整するやり方があります。

今回もその対応をしてたところ、文字列やフラグの値などはスムーズにYAMLファイルに定義して出し分けができたのですが、URLなどの正規表現を環境ごとに変えたかった際にどうすればいいかわからなかったので少し調べてみました。

# RailsにおけるYAMLファイルの読み込み処理

通常はYAMLファイルの読み込みは下記のように行います。

```ruby
path = # YAMLファイルへのパス
REG = YAML.load_file(path).symbolize_keys
```

しかし、今回はconfigをいうgemを使って`Settings`に読み込んでいました。

https://github.com/rubyconfig/config

```ruby
path = # YAMLファイルへのパス
Settings.add_source!(path)
Settings.reload!
```

# YAMLファイルで正規表現を定義する方法

## YAMLファイルとは

そもそもYAMLについておさらいすると、YAML(YAML Ain't Markup Language)とはどのようなプログラミング言語でも使える、人とって可読性が高くデータをシリアライズする言語です。
配列、ハッシュ、スカラ（文字列、数値、真偽値など）でデータを表現することができます。

## 配列を定義したいとき
`-`を使って定義します
```yml
- array_value1
- array_value2
```

## ハッシュを定義したいときは
`:`を使って定義します
```yml
hash_key: hash_value
```

## スカラを使いたいとき
YAMLでは、以下のデータ型を自動的に判別してくれ、それ以外は文字列として扱われます。
- 整数
- 浮動小数点
- 真偽値 (`true`, `yes`, `false`, `no`)
- Null値 (`null`,`~`)
- 日付 (`yyyy-mm-dd`)
- タイムスタンプ (`yyyy-mm-dd hh:mm:ss [+-]hh:mm`)

## 明示的に型を指定したいとき
`！`を使うことで型を指定することができます。Rubyのシンボルや正規表現も下記のように指定することができます。

```yaml
- !str 123            # 文字列
- !ruby/sym  foo      # Ruby の Symbol
- !ruby/regexp /^$/   # Ruby の Regexp
```

このように、明示的に正規表現の型を指定することで、YAMLファイルから読みだした正規表現をそのままRailsのコードで使用することができます。
```yml
reg:
  sample_regexp: !ruby/regexp /^[a-zA-Z|\s]+$/
```

##　サンプルコード

下記のように型を指定した場合と指定しない2つの値をYAMLファイルに定義してみました。

```yaml
regexp: !ruby/regexp /^$/
string: /^$/
```

こちらをRailsで読み込んだ後にコンソールからそれぞれの値とクラスを参照してみたところ、意図した通り型が指定されていたことがわかりました。

```ruby
[1] pry(main)> Settings.regexp
=> /^$/
[2] pry(main)> Settings.regexp.class
=> Regexp
[3] pry(main)> Settings.string
=> "/^$/"
[4] pry(main)> Settings.string.class
=> String
```

# 参考

https://qiita.com/clbcl226/items/c068f617aa34d552a50a

https://qiita.com/ShotaKameyama/items/4dfd3787faec3d2fb10b

https://magazine.rubyist.net/articles/0009/0009-YAML.html
