---
title: "FastAPIにSentryを導入した話"
description: "個人アドベントカレンダーの2日目の記事になります。 副業で開発しているFastAPIのプロダクトにおいてエラートラッキングを行うためにSentryを導入した話です。  https://qiita.com/advent-calendar/2022/amane      背景 Vue+FastAPIで構築されているシステムのバックエンド側にエラー監視ツールが導入されていなかったので、導入することになり"
pubDate: "2022-11-29"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/fastapiにsentryを導入した話"
tags: ["Python", "sentry", "FastAPI"]
---
個人アドベントカレンダーの2日目の記事になります。
副業で開発しているFastAPIのプロダクトにおいてエラートラッキングを行うためにSentryを導入した話です。

https://qiita.com/advent-calendar/2022/amane


## 背景
Vue+FastAPIで構築されているシステムのバックエンド側にエラー監視ツールが導入されていなかったので、導入することになりました。

僕が参加したタイミングではすでにフロントエンド側にSentryが導入されていたので、バックエンド側のエラー監視ツールも同じSentryする方針で実装することになりました。

Sentryについては全く事前知識がなかったので、調べながらの実装になったため、今回は調べたことや実装したことをまとめて書いておこうと思います。

## Sentryとは
Sentryは、ソフトウェアのエラー追跡とパフォーマンス監視のためのツールです。

https://github.com/getsentry/sentry

https://sentry.io/welcome/

エラーについてdebug,info,warn,errorの4つの種類で通知できるほか、発生した例外に関してもスタックトレースを含めて通知してくれます。

パフォーマンス監視機能は、HTTPリクエストの応答時間やデータベースのレイテンシなどを測定することができるようです。
    
このあたりでデモも体験できます。
https://try.sentry-demo.com/organizations/eager-cod/performance

## BugsnagとSentryの違い

普段本業の方ではRuby on Railsのプロダクトにエラー監視ツールとしてBugsnagを用いているので、今回Sentryというツールがあることも知ったので、違いについて軽く調べてみました。
いくつか記事を読んでみたところ機能についてはあまり違いがないようで、導入を決めるにあたっては「Bugsnagはたくさんのサードパーティアプリとの連携が可能で、Sentryは類似のエラーを簡単に解決できることが強み」というような観点で見るということが書いてありました。

Bugsnag
- エラーの根本原因によるグルーピング
- JavaScript,iOS,Android,Python,RubyやJavaなどの50を超える言語やプラットフォームのサポート
- チャットやメール、SMSなどへの即時通知

Sentry
- リアルタイム更新機能で、ユーザーがエラーに遭遇するよりもずっと前に、スタックのあらゆる場所でコードレベルの問題を修正することができる
- 完全なコンテキストがあるので、重要な部分を発見しやすい
- JavaScript、Python、PHP、Ruby、Node、Java、.NET、モバイルなど、あらゆる主要なプラットフォーム、フレームワーク、言語に対応したドロップイン方式の統合

https://stackshare.io/stackups/bugsnag-vs-sentry

https://www.testquality.com/blog/tpost/rf623v6o81-rollbar-vs-sentry-vs-bugsnag-what-are-th

また僕はまだ触ったことがないのですが、[Rollbar](https://rollbar.com/)も同系統のツールとしてよく使われることがあるらしいです。

下記食べログさんのNext.jsでは
- 時間単位で受信限度数が設定できる→コスト削減
- 管理画面上でのフィルタリングが可能
- 記事が多い

という理由でSentryを選定されていました。

https://note.com/tabelog_frontend/n/n02888dbf7c20


## 実装

Pythonについての公式ドキュメントを参考にして実装しました。

https://docs.sentry.io/platforms/python/

### 1. sentry-sdk のインストール

pipを使ってsentry_sdkをインストールします。

```
pip install --upgrade sentry-sdk
```

### 2. envファイルに環境変数を用意します
SentryのアカウントやProjectを立ち上げた後、「Settings」 -> 「Projects」から該当のプロジェクトを選択し、「Client Keys (DSN)」を確認してenv環境変数として設定します。

![SentryのClientKeys.jpg](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/5755fb9e-9c06-3ab6-67cf-1f9dbdadf5a1.jpeg)

```
SENTRY_DSN=< DSNの値 >
``` 

### 3. FastAPIに組み込み

下記のような`init_sentry`関数を定義して、FastAPIの`main.py`から呼び出しすだけです。

```python:sentry.py
import sentry_sdk
from sentry_sdk import set_user
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

from app.core.config import settings

def init_sentry() -> None:
    if settings.SENTRY_DSN is None:
        return

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENV,
        integrations=[
            StarletteIntegration(),
            FastApiIntegration(),
            SqlalchemyIntegration()
        ],
        traces_sample_rate=1.0,
    )
```


```python:main.py
# 追加分のみ抜粋
from app.sentry import init_sentry
init_sentry()

```

FastAPIなどのASGI Webフレームワークには `SentryAsgiMiddleware`というmiddlewareが提供されているほか、SQLAlchemyのための`SqlalchemyIntegration`も用意されているので、このあたりを初期化時に組み込めば簡単に使用することができます。

今回はひとまずエラー監視ができればよさそうだったので、`traces_sample_rate`の値は1.0で設定しました。

この設定だけでエラーが起きたときに詳細の情報やトレースバックをSentry上で確認することができるようになりました。
![スクリーンショット_2022-12-01_9_10_38.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/238254/50f2d495-95ff-6f88-5c07-45944c5623fe.png)

## 感想

「エラー監視ツールの導入」　と聞くと大げさに聞こえますが、想定よりもだいぶ簡単に導入することができました。
もちろんこれ以上にもパフォーマンスの計測やSlack連携、使い方に応じたカスタマイズなど、たくさんの機能が入っているようなので、完全に使いこなすためにはまだまだやることがありそうでした。


## 参考
いろんな事例を公開してくださっている企業や開発者の方々に感謝です。

### 導入について

https://qiita.com/Chanmoro/items/a9cbde57fd6c0926b5b4

https://zenn.dev/apgun/articles/798661f7eb7c86

https://note.com/tabelog_frontend/n/n7f6822ae0c0d

https://tech.classi.jp/entry/2021/03/26/115500

### パフォーマンス

https://scrapbox.io/shimizukawa/Sentry%E3%81%AE%E3%83%91%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%B3%E3%82%B9%E7%9B%A3%E8%A6%96

https://zenn.dev/standfm/articles/a192751bf1935d

https://hack.nikkei.com/blog/advent20211224/
