# Deployment

> **公開対象は `dist/` のみ。** `src/` や開発用ランタイムはデプロイしない。  
> シークレット（トークン・鍵）はリポジトリに置かない。GitHub Actions の既定 `GITHUB_TOKEN` のみ使用する。

---

## 前提

| 項目 | 内容 |
|------|------|
| リポジトリ | `https://github.com/Stand-koike/narainokaze-hp` |
| 公開物 | `npm run build` が生成する `dist/`（HTML / `assets/` / `scripts/`） |
| `dist/` | `.gitignore` 対象。リポジトリにはコミットしない |
| ホスティング | **GitHub Pages**（Actions でビルド＆デプロイ） |

相対パス（`assets/...`、`rooms.html` 等）のため、プロジェクトサイト  
`https://<user>.github.io/<repo>/` でもパス修正は不要。

---

## 公開 URL

初回に Pages を有効化したあと、次のいずれかになる。

| 種別 | URL |
|------|-----|
| プロジェクトサイト（既定） | https://stand-koike.github.io/narainokaze-hp/ |
| Actions 完了後の表示 | リポジトリ → **Settings → Pages**、または Actions の Deploy ジョブ出力 |

カスタムドメインを使う場合は Pages 設定で Domain を追加する（DNS はホスト側。シークレットは不要）。

---

## 初回セットアップ（GitHub）

1. 本リポジトリの変更（workflow・docs）を `main` に push する  
2. Actions で **Deploy GitHub Pages** が成功し、`gh-pages` ブランチが作られることを確認する  
3. **Settings → Pages → Build and deployment**  
   - **Source:** Deploy from a branch  
   - **Branch:** `gh-pages` / `/ (root)`  
4. 数分待ってから公開 URL を開く  

> **404 になる典型原因:** Source が `main` / root のまま。リポジトリ直下に `index.html` が無いため 404 になる。必ず **`gh-pages`** を選ぶ。

権限: `GITHUB_TOKEN` のみ使用（追加の PAT は不要）。

---

## 日常の公開手順

```bash
# ローカルでビルド確認（任意だが推奨）
npm ci
npm run build
npm run preview   # http://localhost:4173 で dist を確認

# main へマージ / push
git push origin main
```

`main` への push で `.github/workflows/deploy-pages.yml` が:

1. `npm ci`
2. `npm run build` → `dist/`
3. `dist/` の中身を **`gh-pages` ブランチ** へ公開

手動再デプロイ: Actions → **Deploy GitHub Pages** → **Run workflow**。

---

## ローカルでの dist 確認チェックリスト

サーバーは **プロジェクトルート** から起動する。

```bash
npm run build
npm run preview
# または: py -m http.server 8080  → http://localhost:8080/dist/
```

- [ ] TOP・下層 6 ページが開く
- [ ] ナビ／CTA の内部リンクが切れていない
- [ ] 画像・`scripts/*.js` が 404 でない
- [ ] HTML に `load-data.js` / `load-sections.js` / `{{...}}` が残っていない
- [ ] `../assets/` や `pages/*.html` プレフィックス付きリンクが残っていない

---

## ワークフローファイル

| ファイル | 役割 |
|----------|------|
| `.github/workflows/deploy-pages.yml` | `main` push で build → `gh-pages` へ `dist/` を公開 |

公開内容は `dist/` のみ。`src/` はアップロードしない。

---

## 別ホスティング（参考）

同じ `dist/` をそのまま使える。

| サービス | 設定の目安 |
|----------|------------|
| Netlify | Publish directory: `dist` / Build: `npm ci && npm run build` |
| Cloudflare Pages | Output: `dist` / Build: `npm ci && npm run build` |

環境変数やデプロイトークンが必要な場合は各サービスのダッシュボードに保存し、リポジトリには書かない。

---

## トラブルシュート

| 症状 | 確認 |
|------|------|
| **404** | Pages の Branch が **`gh-pages` / root** か（`main` だと index が無く 404） |
| CSS/JS が当たらない | 相対パスか。カスタム 404 でルート直書きしていないか |
| 古い画面のまま | Actions 再実行、またはハードリロード |
| ビルド失敗 | Actions ログの `npm ci` / `npm run build` |
| `gh-pages` が無い | Deploy ワークフローが一度も成功していない |
