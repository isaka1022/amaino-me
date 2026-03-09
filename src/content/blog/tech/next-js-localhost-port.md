---
title: "【Next.js】ポート番号を変更する方法（next dev -p）"
description: "Next.jsの開発サーバーのポート番号を変更するには、package.jsonのdevスクリプトに -p オプションを追加します。3000番以外で起動する設定方法を解説。"
pubDate: "2021-04-30"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/next-js-localhost-port/"
---

next.jsの開発をしていたときに、通常の

```
npm run dev
```

のだと、起動するのはlocalhost:3000。 
今回、Railsの方で3000のポートを使っていたので、nextの起動するポート番号を変更する方法を調べた備忘録。

package.jsonの”dev” : “next dev”となっているところを以下の通りに変更すればよい。

```
"scripts": { "dev": "next dev -p ポート番号" }
```

試しにポート番号を8080などに変えて`npm run dev`したところ、無事ブラウザでhttp://localhost:8080にアクセスして問題なく開発が行えました。

参考サイト

[https://www.atnr.net/how-to-set-port-number-on-nextjs/](https://www.atnr.net/how-to-set-port-number-on-nextjs/)
