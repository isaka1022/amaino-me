---
title: "zshで開発効率を上げた自分的エイリアスを晒す"
description: "開発中によく使うコマンドなどはエイリアスで呼び出せる 開発中に良う使うけど長いコマンドなどがあります。  例えばDockerの起動コマンドや、     $ docker-compose up -d      Gitの状態を確認するコマンドなどです。      git status      このあたり、急いで打ち間違えてなんども実行し直すということがあったので、なにかいい方法が無いかを感がたところ"
pubDate: "2022-12-19"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/zshで開発効率を上げた自分的エイリアスを晒す"
tags: ["Zsh"]
---
# 開発中によく使うコマンドなどはエイリアスで呼び出せる
開発中に良う使うけど長いコマンドなどがあります。

例えばDockerの起動コマンドや、
```
$ docker-compose up -d
```

Gitの状態を確認するコマンドなどです。

```
git status
```

このあたり、急いで打ち間違えてなんども実行し直すということがあったので、なにかいい方法が無いかを感がたところ、エイリアスという機能を知りました。


# エイリアスとは

エイリアスは任意のコマンドと紐付けるショートカットのような機能のことです。

使用シェルがzshであれば`~/.zshrc`
bashであれば`~/.bash_profile`に記述していきます。

# エイリアスの設定方法

構文としては下記のようになります。

```
alias 任意のコマンド=‘元のコマンド’
```

僕はzshを使っていたので、vimなどのエディタで`~/.zshrc`を編集して再読み込みすることで適用されます。

```
$ vim ~/.zshrc
// エイリアスを設定
$ source ~/.zshrc
```

# 実際に使っているエイリアス

際に僕が使っているエイリアスを紹介します。
アプリケーションで仕様するコンテナ名が`app`の場合が多いため、そちらに適した形になっています。

```sh:~/.zshrc

# Git関連
gb='git branch'
gp='git push'
gpf='git push -f'
gs='git status'
gsw='git switch'

# ディレクトリ移動
devpath='cd <パス>'

# Docker関連
dl='docker-compose logs -f --tail 100'
drs='docker-compose restart'
ds='docker-compose start'
ddup='docker-compose down && docker-compose up -d'

# Rails関連
rpa='docker-compose exec app ridgepole -f db/Schemafile -c config/database.yml --apply'
rpat='bundle exec ridgepole --config ./config/database.yml --file ./db/Schemafile --apply -E test'
rc='docker-compose exec app rails c'
rcs='docker-compose exec app rails c --sandbox'
rspec='docker-compose run --rm app rspec spec'
cc='docker-compose exec app rails r '\''Rails.cache.clear'\'

# Go関連
gosh='docker compose run go /bin/sh'

# GraphQL
gqldump='rake graphql:schema:dump'

```
# 参考

https://ios-docs.dev/alias/
https://qiita.com/terufumi1122/items/1bbb1cf96e376e30e9fc
