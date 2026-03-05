---
title: "クリーンアーキテクチャでの依存層をpytestのfixtureでモックすることで簡単にテストした"
description: "TL;DR クリーンアーキテクチャを導入したFastAPIのシステムにてpytestでusecase層のユニットテストを書きたかったのですが、respository層がentity層に依存しているため、テストを行うための準備を書くのが大変でした。 そこでpytestのfixtureを用いて、respository層をモックすることで準備を簡単に記述することができました。    この記事で伝えたいこ"
pubDate: "2022-12-04"
category: "tech"
source: "qiita"
originalUrl: "/blog/tech/クリーンアーキテクチャでの依存層をpytestのfixtureでモックすることで簡単にテストした"
tags: ["Python", "テスト", "pytest", "py-test"]
---
# TL;DR
クリーンアーキテクチャを導入したFastAPIのシステムにてpytestでusecase層のユニットテストを書きたかったのですが、respository層がentity層に依存しているため、テストを行うための準備を書くのが大変でした。
そこでpytestのfixtureを用いて、respository層をモックすることで準備を簡単に記述することができました。

# この記事で伝えたいこと

実際にどのようにrepository層をモックしたかについて実際のコードを簡略化した例で紹介できればと思います。
クリーンアーキテクチャについては、より詳しい方の解説を見てもらえればと思います。

https://zenn.dev/daiki_skm/articles/6ff48a9dc4f645

# 背景
副業でクリーンアーキテクチャを採用しているプロダクトの開発に関わっているときのことです。
新規に「あるモデルに対してのクエリパラメータによる検索機能」を実装する必要があり、クリーンアーキテクチャについてキャッチアップしながらそれぞれの層に対して処理を記述していきました。
usecase層に当たるサービスクラスのたコードは下記のような形になっています。

```python:sample.py
from app.domain.repositories import ModelFileRepository

class ModelApplicationService:
    def __init__(
        self,
        *,
        model_file_repository: ModelFileRepository,
    ):
        self.model_file_repository = model_file_repository

    def get_models_by_query(
        self, skip: int, limit: int, query: str
    ) -> Sequence[ModelFile]:
        return self.model_file_repository.get_by_query(
            owner_id=self.current_user.id, skip=skip, limit=limit, query=query
        )
```
repositoryを読み込んで、受け取ったクエリをrepositoryメソッドに渡し、それをそのまま返すというシンプルな実装です。

しかし、pytestを使ってこちらのテストを書く段階になって、少し悩んでしまいました。
Railsを使っている際にはFactoryBotを用いてテストデータを用意してDBのレコードやモデルのビルドができたのですが、上記の例ではusecaseのテストを行うために、repository、そしてその先に依存しているentityの用意までする必要があります。
今回テストしたいのはusecaseのロジックだけでよいのですが、全ての層を呼び出してテストを行うと、下層まで含めた統合テストのようになってしまいます。


# fixtureとmockerを使って層をモックする
これを解決するために既存の別箇所のコードを読んだり調べてみたところ、pytestのfixtureという仕組みを使えばテストの前処理をうまく定義することができ、その中でrepositoryをモックをすれば今回の課題が解決できることがわかりました。

## fixtureとは

fixtureはテストの実行前後で行いたい前処理・後処理を記述するために使用する関数のことです。
そもそも、ソフトウェアテストとは、ソフトウェアの特定の振る舞い（特定の状況や刺激に対して行う動作の結果）を見ることであり、結果が期待するものと一致するかを確認することを指し、下記の4つのステップで実行されます。
1. アレンジ(arrange)
アレンジはテストのための準備です。オブジェクトの準備、サービスの開始/終了、データベースへのレコードの入力、あるいはクエリ用のURLの定義、存在しないユーザー用の認証情報の生成、あるいは何らかのテストが終了するのを待つということなど、テストする前に必要なことを行います

2. 実施
4つのステップの中で、テストしたい動作を開始させる、状態を変化させる唯一の動作状態を監視しながら関数やメソッドの呼び出します。

3. アサート(assert)
2.で実行された後の結果の状態を見て、期待通りの状態であるかをチェックするステップです。動作が期待したものと一致するかを判断するための証拠を集めます。

4. クリーンアップ(clean up）
他のテストが偶然に影響を受けないように、テストが自分自信の後始末をすることです。

fixtureではこのうち、1,4のステップを役割を担ってくれます。
fixtureを使用するには`@pytest.fixture`デコーダを使用して定義し、テスト関数のシグネチャに引数と宣言することでテストから要求されます。
pytestがテストを実行しようとした際には、テスト関数のシグネチャのパラメータを調べて、それらのパラメータと同じ名前を持つフィクスチャを探し、見つかれば、そのfixtureを実行して、それらが返したオブジェクトを引数としてテスト関数に渡すことになります。

## 実装内容
今回の場合はこのようなfixtureを準備して対応しました。
```python:test.py
# import文などは省略

@pytest.fixture
def model_file():
    return ModelFileFactory()

@pytest.fixture
def repository_provider_for_search(mocker):
    def get_repository(model_file):
        repository_mock = mocker.Mock(spec=ModelFileRepository)
        repository_mock.get_by_query.return_value = [model_file]
        return repository_mock
    return get_repository


@pytest.fixture
def service_provider_for_search(repository_provider_for_search):
    return lambda user, model_file: ModelApplicationService(
        model_file_repository=repository_provider_for_search(model_file),
        current_user=user,
    )

def test_get_created_models_by_query(
    service_provider_for_search: Callable[[ModelFile], ModelApplicationService],
    model_file: Model,
):
    # arrange
    model_file.is_search_target = True # 仕様で決まっていた

    # params
    skip = 0
    limit = 100
    query = model_file.title

    # act
    service = service_provider_for_search(model_file)
    result = service.get_created_models_by_query(skip=skip, limit=limit, query=query)

    # assert => succeeded
    assert result[0].id == model_file.id
```

## fixtureがどのように動作しているか


```python
def test_get_created_models_by_query(
    service_provider_for_search: Callable[[ModelFile], ModelApplicationService],
    model_file: Model,
):
```
テスト関数の引数としてCallableで`ModelFile`を引数として`ModelApplicationService`を返す型アノテーションを記述しています。
こうすることで、`service_provider_for_search`という名前の関数をfixtureが探しに行ってくれ、返り値がテスト関数の中で使えるようになります。

※Callableについては省略

https://qiita.com/simonritchie/items/2665e1f4d6bad63d652f


```python
@pytest.fixture
def service_provider_for_search(repository_provider_for_search):
    return ModelApplicationService(
        model_file_repository=repository_provider_for_search(model_file)
    )
```

テスト関数が実行される前にこちらの`service_provider_for_search`が呼び出されます。
ここでも引数として`repository_provider_for_search`が渡されているので、再度fixtureにより同名の関数が検索されます。


```python
def repository_provider_for_search(mocker):
    def get_repository(model_file):
        repository_mock = mocker.Mock(spec=ModelFileRepository)
        repository_mock.get_by_query.return_value = [model_file]
        return repository_mock
    return get_repository
```

最終的にはこちら関数が呼び出されています。ここではpytest-mockを用いて`get_by_query`が呼び出されたときに`model_file`を返す`ModelFileRepository`のモックを返しています。
引数となるmodel_fileもfixutureで定義したので、そちらで呼び出した`ModelFileFactory()`の返り値がこの関数の中で使えるようになっており、最初のテスト関数で検証する返り値としても使えるようになりました。

※py-mockについては省略

https://zenn.dev/re24_1986/articles/0a7895b1429bfa


# 結果

fixtureとpy-mockを用いてrepositoryのモックを返すようなusecase層のサービスクラスを準備しました。
こうしたことで、repository層以下の実装を考えることなく、usecase層に対してのユニットテストが書けるようになりました。
今回の関数でテストしたかったことは`get_models_by_query`関数が「repositoryに引数を渡して、その結果を返す」という振る舞いのみだったので、やりたいことは満たせてそうです。

# 感想
Ruby on RailsでテストもRSpecを使った開発しか行ってこなかったので、言語やフレームワークを超えて勉強したことによりあらためてテストのやり方やソフトウェアのそれぞれの層について学ぶ機会になりました。
クリーンアーキテクチャについては実装自体はできたものの、概念などを含めて完全に理解したと言える状態にはまだまだほど遠いので、継続的に勉強してもっと理解しないといけないな、と感じています。

# 参考

https://qiita.com/_akiyama_/items/9ead227227d669b0564e

https://shinyorke.hatenablog.com/entry/fastapi

https://qiita.com/hirotakan/items/698c1f5773a3cca6193e
