---
title: "Gem::LoadError: can't activate mysql2 (< 0.6.0, >= 0.4.4), already activated mysql2-0.3.18. Make sure all dependencies are added to Gemfile."
description: "Qiita初投稿です。  バージョン情報など Ruby 2.5.1 Rails 5.2.3 MySQL@5.6  状況 gemファイルのmysqlの行を      gem 'mysql2', '0.3.18'    と変更した後、 ターミナルより    $rake db:create    を実行したところ、    rake aborted! LoadError: Error loading th"
pubDate: "2019-04-27"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/gemloaderror-cant-activate-mysql2-060-044-already-activated-mysql2-0318-make-sur"
tags: ["Ruby", "MySQL", "Ruby2.5", "rails5.2.3"]
---
Qiita初投稿です。
#バージョン情報など
Ruby 2.5.1
Rails 5.2.3
MySQL@5.6
#状況
gemファイルのmysqlの行を
```  gem 'mysql2', '0.3.18'
```と変更した後、
ターミナルより
```$rake db:create
```を実行したところ、
```rake aborted!
LoadError: Error loading the 'mysql2' Active Record adapter. Missing a gem it depends on? can't activate mysql2 (< 0.6.0, >= 0.4.4), already activated mysql2-0.3.18. Make sure all dependencies are added to Gemfile.```
とエラーが出て先に進めない。
#解決策
ターミナルの入力を
```$bundle exec rake db:create
```としたところ解決した。
#原因
原因としては、bundlerというのはプロジェクトごとにgemのバージョンを指定しているため、bundle execをつけないとシステム共通の場所で実行されてしまうよう。
この辺、まだまだ知識が浅かったので勉強したい。

https://qiita.com/dawn_628/items/1821d4eef22b9f45eea8
この方が丁寧に解説してくださっていました。

