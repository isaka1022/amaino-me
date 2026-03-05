---
title: "herokuのClearDBからダンプファイルを作成したい"
description: "ClearDBのバックアップをローカルに保存して開発環境で再現させたいときに実行したコマンドの覚書です"
pubDate: "2022-03-12"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/heroku%e3%81%aecleardb%e3%81%8b%e3%82%89%e3%83%80%e3%83%b3%e3%83%97%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%82%92%e4%bd%9c%e6%88%90%e3%81%97%e3%81%9f%e3%81%84/"
draft: true
---

ClearDBのバックアップをローカルに保存して開発環境で再現させたいときに実行したコマンドの覚書です

```
mysqldump -h host_name heroku_xxxxxxxxxx -u usernameaaaaa -p --no-tablespaces > dump.sql
```

\--no-tablespacesが必要だった

## 参考サイト

[https://qiita.com/yuskamiya/items/e19492c2eeee13c8845d](https://qiita.com/yuskamiya/items/e19492c2eeee13c8845d)

[https://isgs-lab.com/424/](https://isgs-lab.com/424/)

[https://tech.gootablog.com/article/mysqldump-couldnt-execute/](https://tech.gootablog.com/article/mysqldump-couldnt-execute/)
