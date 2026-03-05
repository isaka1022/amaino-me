---
title: "Kaigi on Rails2023参加レポート"
description: "はじめに 株式会社マイベストでバックエンドエンジニアをしています、井上周(@isaka1022)です。   業務ではRuby on RailsやNext.jsを使った開発をしています。 今回、2023年10月27日〜28日に開催されたKaigii on Rails 2023に参加したのでその記録を残そうと思います。 https://kaigionrails.org/2023/ 弊社マイベストもRu"
pubDate: "2023-10-28"
category: "event"
tags: []
source: "note"
originalUrl: "https://note.com/amaino/n/nfad6bc07256e"
heroImage: "/blog/note/nfad6bc07256e_3f9167af3b4b055e3e5c5bd1a00136b2.jpeg"
draft: true
---

![](/blog/note/nfad6bc07256e_3f9167af3b4b055e3e5c5bd1a00136b2.jpeg)

## はじめに

株式会社マイベストでバックエンドエンジニアをしています、井上周([@isaka1022](https://twitter.com/isaka1022))です。  
業務ではRuby on RailsやNext.jsを使った開発をしています。

今回、2023年10月27日〜28日に開催されたKaigii on Rails 2023に参加したのでその記録を残そうと思います。

[https://kaigionrails.org/2023/](https://kaigionrails.org/2023/)

弊社マイベストもRubyスポンサーをしており、今回は初のオフラインの開催と合わせて、ブースも出させていただきました。

## マイベストのスポンサーブース企画「エンジニアの舌格付けチェック」

実際にマイベストが作成した[コーヒーメーカーのおすすめランキング](https://my-best.com/231)の1位商品・中間商品・下位商品のメーカーを使って、同じコーヒー豆を抽出しその違いを皆さんに体験していただきました。

ブースにはたくさんの方にいらしていただき、楽しんでいただけたのでよかったです。

[https://twitter.com/isaka1022/status/1718078337015579061?s=20](https://twitter.com/isaka1022/status/1718078337015579061?s=20)

[https://tsushin.my-best.com/articles/057](https://tsushin.my-best.com/articles/057)

## Day 1

それぞれの日で調香したセッション、スライド、感想をまとめます。（スライドは見つけたものだけ掲載しています）  
感想については、簡易的なものになりますがご容赦いただければと思います。

### 基調講演 準備中

[https://twitter.com/okuramasafumi/status/1717728537279697402?s=20](https://twitter.com/okuramasafumi/status/1717728537279697402?s=20)

タイトルはオフィシャルから転機しました。zzakさんのこれまでのプログラマーとしてのキャリアのお話やコントリビュートの道のりのお話でした。  
This week in Railsや、Rails: Watch & Learnを始めとする動画リストといったキャッチアップの情報源も共有いただけたので、このあたり後でチェックしようと思います。

[https://world.hey.com/this.week.in.rails](https://world.hey.com/this.week.in.rails)

[https://www.youtube.com/playlist?list=PL8iRzYSwTEdvU5L5WV5ea16m6LrwgvZYO](https://www.youtube.com/playlist?list=PL8iRzYSwTEdvU5L5WV5ea16m6LrwgvZYO)

### Rails アプリの 5,000 件の N+1 問題と戦っている話

[https://speakerdeck.com/makicamel/bulletmarkrepairer-auto-corrector-for-n-plus-1-queries](https://speakerdeck.com/makicamel/bulletmarkrepairer-auto-corrector-for-n-plus-1-queries)

僕も本業ではパフォーマンス改善でN+1を解消することはよくありますが、そういった解消の取り組みを自動化できないかという取り組みでした。

preload, eager\_load, includesの違いはいつも曖昧になるので改めて復習になったのと、「N+1退治番長」制で普段からコツコツと解消していくしかないのだなあと感じました。

### やさしいActiveRecordのDB接続のしくみ

[https://speakerdeck.com/boro1234/yasasiiactiverecordnodbjie-sok-nosikumi](https://speakerdeck.com/boro1234/yasasiiactiverecordnodbjie-sok-nosikumi)

「RailsはActiveRecordがよい」という話は普段もよく話に出ますし、僕自身もそう感じることが多いですが、なかなかその中身を理解したいと思ってもきっかけがありませんでした。  
今回、MySQLとの接続についてバックトレースをもとに解説してもらい、解像度が上がった気がします。

もしActiveRecordのエラーで詰まったら今回の内容を思い出してデバッグしよう、そう思いました。

### 初めてのパフォーマンス改善

[https://speakerdeck.com/fugakkbn/chu-metenopahuomansugai-shan](https://speakerdeck.com/fugakkbn/chu-metenopahuomansugai-shan)

つい先日から会社でもパフォーマンス改善に取り組む機会が多かったのでとても共感が深い内容でした。  
「コードにしたものとコードにしなかったことがプログラミング」という言葉が刺さりました。コミットメッセージやPRの本文など、ちゃんと書こう、、！

[https://twitter.com/kazumax1218/status/1717798022732763155?s=20](https://twitter.com/kazumax1218/status/1717798022732763155?s=20)

### Simplicity on Rails -- RDB, REST and Ruby

[https://speakerdeck.com/moro/simplicity-on-rails-rdb-rest-and-ruby](https://speakerdeck.com/moro/simplicity-on-rails-rdb-rest-and-ruby)

少し抽象的なレイヤーで、要求をRailsの設計にどう落とし込むかがとても言語化されていました。  
「Railsの考え方における、ログインはSessionをcreateするし、ログアウトはSessionとdestroy」という考え方、僕も始めてみたときは何だこれ？という感想だったのですが、よく考えてみるととてもしっくりきたし今でも納得あり素敵だなと感じたので、こういう設計にシンプルに落とし込めるようになりたいな、と思いました。

### 技術的負債の借り換え

Railsのバージョンアップで、関連するgemのアップデートをどのように進めていくか、というお話でした。  
多数のモデルを抱える大規模なアプリケーションで、現実的な問題として一気にぱつっとバージョンアップしたり、きれいにアップデート出来ないので徐々に"借り換え"をして、最新版との差分を徐々に減らして負債を少しずつ返していこうという内容で面白かったです。

### seeds.rbを書かずに開発環境データを整備する

[https://speakerdeck.com/gogutan/seeds-dot-rbwoshu-kazunikai-fa-huan-jing-detawozheng-bei-suru](https://speakerdeck.com/gogutan/seeds-dot-rbwoshu-kazunikai-fa-huan-jing-detawozheng-bei-suru)

最新版のデータをサクッとほしいときとか、seedsだと検証が少し大変になってきたときにCSVを使うのは手軽で良いなと思いました。  
ダミーデータとか、色々なパターンごとのCSVファイルを用意して入れ直すとかできてもよさそうなので、タイミングがきたらまた見直したいです。

### Startup Drinkup at Kaigi on Rails 2023

1日目の締めくくりはRoute06社、YOUTRUST社と合同でDrinkupを開催しました。  
なんと満員御礼とのことで、会場が一杯で少し手狭になるほどでしたが、その日に始めました人、再開した人などたくさんの人との交流が行えてよかったです。

[https://youtrust.connpass.com/event/295807/](https://youtrust.connpass.com/event/295807/)

[https://twitter.com/sachii1015/status/1717848398408396982?s=20](https://twitter.com/sachii1015/status/1717848398408396982?s=20)

今回のKaigi on Railsのために作られたアプリでQRコードが大活躍でした！

[https://app.kaigionrails.org/](https://app.kaigionrails.org/)

## Day 2

2日目も気になるセッションや時間が被っているものも多かったですが、聞いたものと感想のまとめです。  
ブースの撤退や時間帯が合わず聴きたいものは全部聴けなかったので、後でスライド等は確認したいと思います。

### Fat Modelを解消するためのCQRSアーキテクチャ

[https://speakerdeck.com/krpk1900/fat-modelwojie-xiao-surutamenocqrsakitekutiya](https://speakerdeck.com/krpk1900/fat-modelwojie-xiao-surutamenocqrsakitekutiya)

RailsにおいてFatモデルの解消パターンはいくつかありそうですが、そのうちの一つとして参考になりました。自分たちが使ってない設計やアーキテクチャを見るのは楽しいです。

### E2E testing on Rails 2023

[https://speakerdeck.com/yusukeiwaki/kaigionrails2023pub](https://speakerdeck.com/yusukeiwaki/kaigionrails2023pub)

僕はほとんどRailsでE2Eテスト書いてなかったです。今回の発表で既存のcypressの仕組みや、Node.jsベースのテストランナー等々の仕組みを知ることができました。  
playwright-ruby-clientというgemの紹介もありました。  
[https://github.com/YusukeIwaki/playwright-ruby-client](https://github.com/YusukeIwaki/playwright-ruby-client)

### テーブル分割で実現するdeviseの責務の分離と柔軟な削除機構

どんなアプリケーションでもだいたい必要になる認証の仕組みであるdeviseをテーブル分割でカスタマイズする話でした。  
立ち上げ時などはついそのままdeviseでさくっと作ってしまいがちですが、長期的にどうするかまで考えるとこういう分割やその他の方法も検討しないといけないな、とそう感じました。

### 管理機能アーキテクチャパターンの考察と実践

[https://speakerdeck.com/ohbarye/learn-architecture-through-admin](https://speakerdeck.com/ohbarye/learn-architecture-through-admin)

管理機能作り方の話かと思ったら、ちゃんとソフトウェアアーキテクチャの話で面白かったです。プロダクトの立ち上げ時に最低限でいいや、まさに「後追い」と作ってしまいがちな管理機能なのでアーキてくティング的な観点で考えたことがなかったので面白かったです。  
「責務を表現する名前として『管理画面』は適切か？」はまさにそうだなと感じました。

### 自分の道具を自作してつくる喜びを体感しよう、Railsで。 〜4年続いたPodcastを実例に〜

[https://speakerdeck.com/mktakuya/kaigi-on-rails-2023](https://speakerdeck.com/mktakuya/kaigi-on-rails-2023)

業務での開発と、個人での開発ってやっぱり種別が違ってそれぞれの良さ、楽しさがあるなということを感じます。  
最近、趣味や個人でコードを書いたり開発する時間を全然取れてないので、自分が使うものを自分で作る、やりたいなと素直に思いました。

### ペアプロしようぜ 〜3人で登壇!? 楽しくて速いペアプロ/モブプロ開発〜

[https://speakerdeck.com/masuyama13/pair-mob-programming-kaigi-on-rails-2023](https://speakerdeck.com/masuyama13/pair-mob-programming-kaigi-on-rails-2023)

トークのキレとスライドの作り込みがすごかったです。（笑）  
ペアプロをどうやって導入したか、また導入で解決された開発上のツラみが紹介されていました。

あんまりガッツリペアプロをやったことはなかったので、今回実際に壇上でペアプロをライブで見ることができてとても新鮮でした。  
特に、一人で開発しているとつい飛ばしてしまう確認や思考の過程を、ペアで開発することで都度意図的に確認したり、段階を歴て開発していく様子が  
印象的できた。

### A Decade of Rails Bug Fixes

Railsにおける10年前のバグと、数ヶ月前のバグをどのようにデバッグしたかを紹介されました。  
最初のRailsから直近のコントリビュートまでの10年の話など。特に直近の話はMastdonのバグから始まり、Ruby、Railsの仕様にもわたる大きなコントリビュートの物語で面白かったです。

再現できない他人のバグのデバッグは大変だよなとか、いかなる場面においてもコミュニケーションの取り方は大事だよな、とか示唆がいくつも散りばめられていました。

### アフターパーティ

アフターパーティでは、ご飯と、そして美味しい日本酒も用意されており、楽しい時間となりました。カンファレンス中に挨拶できた人たちとちゃんとしっかり話すことができたり、また次の企画にも繋がりそうな話もできてよかったです！

![](/blog/note/nfad6bc07256e_1698504988747-KKOLkPGTVT.jpg)
*お腹空いていました*

日本酒もおいしかったです１

[https://twitter.com/uvb\_76/status/1718191217333408128?s=46](https://twitter.com/uvb_76/status/1718191217333408128?s=46)

  

### RubyMusicMixin on Rails

そして恒例となりつつある（？）DJイベント。今回もpixivさんがスポンサードしていただき楽しいパーティとなりました。

[https://twitter.com/pupupopo88/status/1718269387059442082?s=20](https://twitter.com/pupupopo88/status/1718269387059442082?s=20)

![](/blog/note/nfad6bc07256e_1698505487989-BIxX1DNQ0Q.jpg)
*場所を探して手配するのもすごい*

[https://pixiv.connpass.com/event/295800/](https://pixiv.connpass.com/event/295800/)

## 感想

今回のKaigi on RailsではRailsの話がとても多く、またレベル感も自分にあっていた話が多かった印象で、身近な話題が多くて面白かったです。  
最近自分はReactなどのフロントエンドも見ることが多くなりRailsをガッツリ触ることが少なくなってきたのですが、今回Kaigi on Railsに参加して改めて色々なRailsの機能を使ってプロダクトを作りたくなりました。

また、他社さんやスピーカーの方が試行錯誤をされて要求を実現しているスタガを見て、設計とか実装、また僕も頑張ろうと刺激をもらいました。  
ぜひ、次の機会にはこそプロポーザル出す、、！（n回目）

企業ブースも各社さん色々とコンテンツやノベルティを用意されていて、初めてのオフラインでの開催・会場でしたが休憩時間も飽きることなく、また交流もできてよかったです。

ブースについてはSmartBankさんがうまくまとめてくれています。

[https://blog.smartbank.co.jp/entry/2023/10/27/214137](https://blog.smartbank.co.jp/entry/2023/10/27/214137)

今回もとても刺激になった会でした。RubyKaigiもそうですが、カンファレンスやイベントの参加を重ねていくうちに、同じRubistやWEBアプリのエンジニアなどのいろんな知り合いが増えてきて嬉しいな、と感じた2日感でした。

RubyKaigi2023も思い返せば半年前。懐かしい。  
次のカンファレンスやイベント参加も楽しみです！

[https://note.com/amaino/n/nea057948250e](https://note.com/amaino/n/nea057948250e)
