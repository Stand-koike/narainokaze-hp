# 蒼海の宿 ならいの風 — Website Project

> **ローカル配置:** `Stand/01.案件/ならいの風/`  
> **GitHub:** [Stand-koike/narainokaze-hp](https://github.com/Stand-koike/narainokaze-hp)

## Purpose

外浦の海辺で三世代がゆったり過ごす宿「蒼海の宿 ならいの風」の魅力を伝える公式 Web サイト。

## Target

- 50〜70代
- 夫婦旅行・三世代旅行
- ゆっくり過ごす時間を求める層

## Design Direction

- 上質
- 温かさ
- 家族の時間
- 海辺の宿

## Pencil.dev

デザイン本体: [`pencil/narainokaze-design.pen`](pencil/narainokaze-design.pen)  
エクスポート: [`pencil/export/`](pencil/export/)  
詳細: [pencil/README.md](pencil/README.md)

## Production Flow

```
Pencil.dev（pencil/narainokaze-design.pen）
    ↓ HTML Export → pencil/export/
Builder Agent          ← 構造化・データ切り出し・ビルド基盤
    ↓
Animation Agent        ← GSAP
    ↓
Reviewer
    ↓
Performance
    ↓
Deploy（dist/）
```

**Builder 工程の詳細:** [docs/builder-workflow.md](docs/builder-workflow.md)

## Technology

- HTML
- Tailwind CSS（CDN）
- JavaScript（section / component ランタイム注入）
- GSAP（TOP アニメーション）
- linkedom（本番ビルド）

## Project Structure

```
assets/images/          画像アセット（プロジェクトルート）
dist/                   本番ビルド出力
src/
  index.html            TOP ページシェル
  pages/                下層ページシェル（6ページ）
  sections/             セクション断片
  patterns/             header / footer 等
  components/           button / nav-link 等
  data/                 facility.json / content.json
  scripts/              load-data.js / load-sections.js / animation.js
  templates/web-production/  ビルド設定
scripts/
  build-production.mjs  本番 HTML 生成
  sync-page-assets.mjs  レガシー素材同期（案件固有）
docs/
  builder-workflow.md   Builder 工程ドキュメント
  deployment.md         本番公開・GitHub Pages
  project-context.md    案件コンセプト
.github/workflows/
  deploy-pages.yml      main push で dist を Pages へ
```

## Local Development

`load-sections.js` による section / component の fetch 読み込みを行うため、**ローカル HTTP サーバー経由での確認が必須**です。

### 起動手順

1. **プロジェクトルート**（本 README があるディレクトリ）で HTTP サーバーを起動する

   ```bash
   py -m http.server 8080
   ```

2. ブラウザで開発用 URL を開く

   | ページ | URL |
   |--------|-----|
   | TOP | http://localhost:8080/src/index.html |
   | 客室 | http://localhost:8080/src/pages/rooms.html |
   | 温泉 | http://localhost:8080/src/pages/onsen.html |
   | 料理 | http://localhost:8080/src/pages/cuisine.html |
   | 過ごし方 | http://localhost:8080/src/pages/news.html |
   | アクセス | http://localhost:8080/src/pages/access.html |
   | FAQ | http://localhost:8080/src/pages/faq.html |

### 注意事項

- **`file://` での直開きは不可** — section の fetch が CORS 制約により失敗します
- **サーバーはプロジェクトルートから起動する** — `src/` 内から起動すると `../assets/` 参照の画像が 404 になります
- 下層ページは `window.__SRC_BASE__` / `window.__ASSET_BASE__` によりパスを解決します（[Builder Workflow](docs/builder-workflow.md) 参照）

## Production Build

開発時は `src/` + ランタイム注入、本番デプロイ時は静的 HTML を `dist/` へ生成します。

### ビルド手順

```bash
npm install
npm run build
```

### 出力

| 入力 | 出力 |
|------|------|
| `src/index.html` | `dist/index.html` |
| `src/pages/*.html` | `dist/{同名}.html` |

例: `src/pages/rooms.html` → `dist/rooms.html`

### 確認

```bash
npm run preview
# → http://localhost:4173/
```

または:

```bash
py -m http.server 8080
```

| ページ | URL（preview） | URL（http.server） |
|--------|----------------|-------------------|
| TOP | http://localhost:4173/ | http://localhost:8080/dist/index.html |
| 下層 | http://localhost:4173/rooms.html 等 | http://localhost:8080/dist/rooms.html 等 |

### 本番出力の特徴

- section / data / pattern / component を **ビルド時に展開済み**
- `load-data.js` / `load-sections.js` は **含めない**（fetch 不要）
- 画像パスは `assets/` に統一（`../assets/` / `../../assets/` → `assets/`）
- `assets/` ディレクトリを `dist/assets/` へコピー
- `.nojekyll` を出力（GitHub Pages 用）

### デプロイ（GitHub Pages）

詳細は **[docs/deployment.md](docs/deployment.md)**。

- 公開対象: **`dist/` のみ**（Actions が build し **`gh-pages` ブランチ**へ配置）
- 想定 URL: https://stand-koike.github.io/narainokaze-hp/
- 初回: Settings → Pages → Branch を **`gh-pages` / root** に設定（`main` だと 404）

### テンプレート構成

| ファイル | 役割 |
|---------|------|
| `src/templates/web-production/site.manifest.json` | ビルド設定（データ JSON・出力先・パス置換） |
| `src/templates/web-production/index.template.html` | 本番 HTML シェル参照 |
| `scripts/build-production.mjs` | 全ページを展開して `dist/` 出力 |
| `src/data/facility.json` | 施設基本情報 |
| `src/data/content.json` | ページコンテンツ・ナビゲーション |

## Asset Sync（案件固有）

レガシー素材フォルダから画像を `assets/images/` へコピーする場合:

```bash
npm run sync:assets
```

ソースパスは `scripts/sync-page-assets.mjs` 内で案件ごとに設定します。

## Documentation

| ドキュメント | 内容 |
|-------------|------|
| [docs/deployment.md](docs/deployment.md) | 本番公開・GitHub Pages 手順 |
| [docs/folder-migration.md](docs/folder-migration.md) | フォルダ統合手順（2026-08） |
| [docs/builder-workflow.md](docs/builder-workflow.md) | Builder 工程の標準手順・チェックリスト・テンプレート知見 |
| [docs/animation-guide.md](docs/animation-guide.md) | アニメーション指示のコツ・プロンプト例（ローカル参照） |
| [docs/animation-spec.md](docs/animation-spec.md) | **編集用** アニメ仕様一覧（手直し → Agent 反映） |
| [docs/rooms-photo-map.md](docs/rooms-photo-map.md) | **編集用** 客室名・写真の紐づけ表 |
| [docs/project-context.md](docs/project-context.md) | 案件コンセプト・キーメッセージ |
