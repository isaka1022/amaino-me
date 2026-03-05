# amaino.me 開発ガイド（Agent 向け）

## デプロイ

### 推奨: Git プッシュでデプロイ

Vercel と GitHub が連携されている。**`site/` で `git push` すると自動で本番デプロイが走る。**

```bash
cd site
git add .
git commit -m "feat: 変更内容"
git push origin master
```

- **制限なし**: CLI の `vercel deploy` は無料プランで 5000 リクエスト/日制限があるが、**Git プッシュ経由のデプロイにはこの制限はかからない**
- デプロイ状況: `vercel ls` で確認可能

### 非推奨: CLI 直接デプロイ

```bash
cd site && vercel --prod
```

無料プランでアップロード数制限に達しやすい。Git  push を優先すること。

---

## プロジェクト構成

- `site/` … Astro サイト（Vercel デプロイ対象）
- `mcp-ga4/` … GA4 / Search Console 用 MCP サーバー
- `archive/` … 移行元データ（WordPress エクスポート等）

---

## 関連ドキュメント

- [CLAUDE.md](./CLAUDE.md) … プロジェクト全体のコンテキスト
