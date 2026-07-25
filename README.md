# 外浦の宿 Website Project

## Purpose

外浦の宿の魅力を伝える公式Webサイト制作。

## Target

- 50〜70代
- 夫婦旅行
- 三世代旅行
- ゆっくり過ごす時間を求める層

## Design Direction

- 上質
- 温かさ
- 家族の時間
- 海辺の宿

## Production Flow

Pencil.dev
↓
HTML Export
↓
Builder Agent
↓
Animation Agent
↓
Reviewer
↓
Performance
↓
Deploy

## Technology

- HTML
- Tailwind CSS
- JavaScript
- GSAP

## Local Development

このプロジェクトは `load-sections.js` による section / component の fetch 読み込みを行うため、**ローカル HTTP サーバー経由での確認が必須**です。

### 起動手順

1. **プロジェクトルート**（本 README があるディレクトリ）で HTTP サーバーを起動する

   ```bash
   py -m http.server 8080
   ```

2. ブラウザで **`src/index.html`** を開く

   ```
   http://localhost:8080/src/index.html
   ```

### 注意事項

- **`file://` での直開きは不可**  
  section コンポーネントの fetch が CORS 制約により失敗し、ページが正しく表示されません。
- **画像アセット（`assets/images/`）はプロジェクトルートで管理**  
  HTML 内の参照パス（`../assets/images/...`）は、`src/index.html` をルートサーバー上で開く前提の相対パスです。`src/` ディレクトリ内からサーバーを起動すると画像が 404 になります。