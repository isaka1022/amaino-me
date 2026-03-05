---
title: "GAS：Google App Scriptsを使ってSpreadSheetに登録したデータをFirestoreにインポートする"
description: "個人開発のサービスを作るときに、色々な技術スタックを使ってまずはプロトタイピングをしてみたいと思いました。"
pubDate: "2021-09-19"
category: "tech"
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/import-to-firestore-from-spreadsheet/"
---

個人開発のサービスを作るときに、色々な技術スタックを使ってまずはプロトタイピングをしてみたいと思いました。

特にフロントエンドの開発をする際には、APIを用意するのですが、毎回APIを準備するのも面倒なので何かいい方法はないかなと思っていたときに、Googleのスプレッドシートでもととなるデータを用意しておいて、それを各種バックエンドのDBに流し込めばいいじゃん！と思ったので今回はその記録です。

Firestoreにデータを流し込みます。

## 今回書いたコード

Githubにも公開してあります 
https://github.com/isaka1022/import-to-firestore-from-spreadsheet-gas

```
function setDataToFireStore() {
 var sheet = SpreadsheetApp.openById('<your-spread-sheet-id>').getSheetByName('<your-sheet-name>');

 var certification = fireStoreCertification();
 var firestore = FirestoreApp.getFirestore(certification.email, certification.key, certification.projectId);

 try {
 // スプレッドシートに応じてここは変更してください
 for ( var i = 2; i < 55; i++ ) {
 var titleValue = sheet.getRange(i,1).getValue();
 
 
 var newData = {
 title: titleValue
 }

 firestore.createDocument("<your-firebase-collection-name>", newData);

 }
 
 } catch(e) {
 Logger.log(e)
 }
}


function fireStoreCertification() {
 var certification = {
 "email": "<your-service-account>",
 "key": "-----BEGIN PRIVATE KEY-----\ ... \----END PRIVATE KEY-----",
 "projectId": "<your-project-id>"
 }

 return certification;
```

## Firestore事前準備

まずはfirestoreを作っていきます。

ここでは詳細は解説しませんが、以下の公式を読み進めました。[https://firebase.google.com/docs/firestore/quickstart?hl=ja](https://firebase.google.com/docs/firestore/quickstart?hl=ja)

またプロジェクトの設定の「サービスアカウト」から、「新しい秘密鍵の設定をしておきます。!## GASにFirestoreのライブラリを追加

続いて、GASを使います

ご自身のGoogleドライブの新規追加ボタンからGoogle Apps Scriptsを追加します。

!追加後に、ツールからスクリプトエディタを起動し、 
リソース＞ライブラリ＞ライブラリを追加から、

```
1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw

```

を入力し、その最新のバージョンを選択してください。識別子はFirestoreになっているかと思います。

## Firestoreへの認証情報を入力

コードのfirestoreCertificationに認証情報を書きます

```
function fireStoreCertification() {
 var certification = {
 "email": "<your-service-account>",
 "key": "-----BEGIN PRIVATE KEY-----\ ... \----END PRIVATE KEY-----",
 "projectId": "<your-project-id>"
 }
```

## スプレッドシートを開く

```
var sheet = SpreadsheetApp.openById('<your-spread-sheet-id>').getSheetByName('<your-sheet-name>');
```

では開くスプレッドシートを指定します。

- getActiveSpreadsheet()
- openById(id)
- openByUrl(url)

などいくつか開く方法がありますが、僕は上記の方法でやりました。

## データを入力

```
 for ( var i = 2; i < 55; i++ ) { 
var titleValue = sheet.getRange(i,1).getValue(); var newData = { title: titleValue } firestore.createDocument("<your-firebase-collection-name>", newData); }
```

に関しては、僕は2行目から54行目のデータを取りたかったのでその数文のループを回しています。 
これでnewDataオブジェクトを作成し、createDocumentに渡して上げればあとはFirestoreにデータが追加されました。

## 参考記事

[https://qiita.com/masa-321/items/86e356b02dcf5b840595](https://qiita.com/masa-321/items/86e356b02dcf5b840595)

[https://qiita.com/subaru44k/items/a88e638333b8d5cc29f2](https://qiita.com/subaru44k/items/a88e638333b8d5cc29f2)

[https://qiita.com/cazimayaa/items/224daebe536799e5a8a2](https://qiita.com/cazimayaa/items/224daebe536799e5a8a2)

[https://blog.8basetech.com/google-apps-script/gas-for/](https://blog.8basetech.com/google-apps-script/gas-for/)
