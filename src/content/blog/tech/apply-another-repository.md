---
title: "Gitで別リポジトリにコミットの変更を適用する方法（git format-patch / apply）"
description: "リポジトリの分割やモノレポからの切り出し時に、特定のコミットの変更を別リポジトリに適用する方法を解説します。git format-patch と git apply を使ったパッチベースのワークフローです。"
pubDate: "2022-08-31"
updatedDate: "2026-03-04"
category: "tech"
tags: ["Git"]
source: "techblog"
originalUrl: "https://techblog.amaino.me/development/apply-another-repository/"
heroImage: "/blog/wp-content/uploads/2022/08/技術ブログアイキャッチ-8.jpg"
---

リポジトリの分割やモノレポからのサービス切り出しの際、「このコミットの変更だけ別リポジトリにも反映したい」というケースがあります。

`git cherry-pick` はリモートが異なるリポジトリ間では使えないため、**パッチファイル**を介して変更を移植するのが確実です。

## 手順

### 1. パッチファイルを作成する

元のリポジトリで、適用したいコミットからパッチを生成します。

```bash
git show <commit-hash> -- path/to/target/file > /tmp/apply.patch
```

特定のディレクトリ配下の変更だけを含めたい場合は、パスを指定します。

```bash
git show abc1234 -- src/api/ > /tmp/apply.patch
```

複数コミットをまとめてパッチにしたい場合は `format-patch` が便利です。

```bash
git format-patch <base-commit>..<target-commit> --stdout > /tmp/apply.patch
```

### 2. パッチ内のパスを調整する（必要な場合）

リポジトリ間でディレクトリ構成が変わっている場合、パッチファイル内のパスを書き換えます。

```bash
sed -i '' 's|a/old-path/|a/new-path/|g; s|b/old-path/|b/new-path/|g' /tmp/apply.patch
```

### 3. 移行先リポジトリでパッチを適用する

```bash
cd /path/to/new-repo
git apply /tmp/apply.patch
```

適用前にドライランで確認するのがおすすめです。

```bash
git apply --check /tmp/apply.patch
```

## よくあるエラーと対処

| エラー | 原因 | 対処 |
|--------|------|------|
| `patch does not apply` | パスの不一致 or コンテキスト行の差異 | `--3way` オプションを試す |
| `trailing whitespace` | 空白の差異 | `--whitespace=fix` を付与 |

## まとめ

`git show` or `git format-patch` でパッチを作り、`git apply` で適用するだけで、リポジトリをまたいだ変更の移植ができます。CI/CD パイプラインでの自動適用にも応用可能です。
