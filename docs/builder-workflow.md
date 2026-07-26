# Builder Workflow

> **目的:** Pencil.dev からエクスポートした HTML を、再利用可能な Web サイト構造へ変換する工程を標準化する。  
> 本文書は **蒼海の宿 ならいの風** 案件（2026）で得られた知見をテンプレートへフィードバックしたものです。

---

## Builder 工程の位置づけ

```
Pencil.dev
    ↓ HTML Export（生 HTML・ページ単位）
Builder Agent  ← 本ドキュメント
    ↓ 構造化 HTML + JSON データ + ビルド基盤
Animation Agent
    ↓ GSAP アニメーション
Reviewer
    ↓ 品質確認
Performance
    ↓ 最適化
Deploy
    ↓ dist/ を公開
```

**Builder の責務**

- Pencil 生 HTML を **ページシェル + セクション + パターン + コンポーネント** に分解する
- 施設情報・可変コンテンツを **JSON データ** へ切り出す
- 開発時ランタイム（`load-data.js` / `load-sections.js`）と本番ビルド（`build-production.mjs`）を接続する
- 複数ページ間の **リンク・画像パス** を一貫した規約で整える

**Builder の責務外**

- アニメーション実装（Animation Agent）
- デザイン変更・レイアウトの再設計
- サーバー・DNS・本番ホスティング設定

---

## 入力と出力

### 入力（Builder 開始時）

| 種別 | 例 | 状態 |
|------|-----|------|
| Pencil 生 HTML | `pencil/export/*.html` | Header/Footer 直書き・700行超・画像パス混在 |
| 画像素材 | クライアント提供フォルダ | ファイル名・配置がバラバラ |
| 施設情報 | テキスト・電話番号・住所 | 散在 |

### 出力（Builder 完了時）

| 種別 | パス | 説明 |
|------|------|------|
| TOP ページシェル | `src/index.html` | `data-include` のみ |
| 下層ページシェル | `src/pages/*.html` | 同上 + パス用グローバル変数 |
| セクション | `src/sections/*.html` | ページ断片（静的マークアップ） |
| パターン | `src/patterns/*.html` | header / footer 等の再利用ブロック定義 |
| コンポーネント | `src/components/*.html` | button / nav-link 等 |
| 施設データ | `src/data/facility.json` | ブランド・連絡先・Hero 等 |
| コンテンツ | `src/data/content.json` | セクション別テキスト・ナビ |
| ランタイム | `src/scripts/load-*.js` | fetch 注入・展開 |
| ビルド | `scripts/build-production.mjs` | 静的 HTML 生成 |
| 本番出力 | `dist/*.html` | fetch 不要の完成 HTML |

---

## 工程ステップ

### Phase 1 — 現状分析

各 Pencil エクスポート HTML について以下を確認する。

- [ ] ページ種別（TOP / 下層）と `data-pencil-name`
- [ ] Header / Footer の有無（共通化候補）
- [ ] セクション境界（Hero / Intro / CTA 等）
- [ ] 画像参照パスと実ファイルの対応
- [ ] TOP ティーザーと下層フルページの **同名セクションの区別**（例: TOP `cuisine.html` セクション vs 下層 `cuisine` ページ）

**ならいの風での例**

- TOP: 11 セクション（hero, intro, host, cuisine ティーザー, stay, news, faq, access …）
- 下層 6 ページ: rooms, onsen, cuisine, news, access, faq
- `cuisine` は TOP ティーザー（`sections/cuisine.html`）と下層（`pages/cuisine.html` + 7 セクション）が別物

---

### Phase 2 — ページシェル化

Pencil 生 HTML を **50行程度のシェル** に置き換える。

**TOP（`src/index.html`）**

```html
<div data-include="sections/header.html"></div>
<main>
  <div data-include="sections/hero.html"></div>
  <!-- ... -->
</main>
<div data-include="sections/footer.html"></div>
<script src="scripts/load-data.js"></script>
<script src="scripts/load-sections.js"></script>
<script src="scripts/animation.js"></script>
```

**下層（`src/pages/{page}.html`）**

```html
<div
  class="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-stretch bg-[#F0F4F3] overflow-hidden"
>
  <div data-include="../sections/header.html"></div>
  <main class="w-full">
    <div data-include="../sections/{page}-hero.html"></div>
    <!-- ... -->
  </main>
  <div data-include="../sections/footer.html"></div>
</div>
<script>
  window.__SRC_BASE__ = "../";
  window.__ASSET_BASE__ = "../../assets/";
</script>
<script src="../scripts/load-data.js"></script>
<script src="../scripts/load-sections.js"></script>
```

**ページシェル幅の注意（Pencil 由来の落とし穴）**

- Pencil エクスポートは `w-[1440px] items-start` になりがち。**そのまま使わない**
- TOP と同じ `w-full max-w-[1440px] mx-auto items-stretch` + `<main class="w-full">` に統一する
- `body { overflow-x: hidden; }` を下層にも入れる（1366px 等で横スクロールを防ぐ）
- Hero / CTA の absolute オーバーレイは `w-[1440px]` 固定ではなく `absolute inset-0 w-full h-full` を使う

**命名規則**

| 対象 | 規則 | 例 |
|------|------|-----|
| ページファイル | `{topic}.html` | `rooms.html` |
| セクション | `{page}-{role}.html` | `rooms-hero.html`, `cuisine-signature.html` |
| 共通 | プレフィックスなし | `header.html`, `footer.html` |

---

### Phase 3 — セクション分割

Pencil HTML から `<main>` 内のブロックを切り出し `src/sections/` へ配置する。

**原則**

- デザイン・Tailwind クラスは **変更しない**（Builder は構造化のみ）
- 画像パスを規約に統一（後述）
- 可変テキストは `data-content-bind` / `data-facility-bind` 等のフックを残す
- 繰り返し UI は `data-component` / `data-pattern` へ昇格させる

**昇格の判断基準**

| レイヤー | 条件 | 例 |
|----------|------|-----|
| Component | 小さな UI 部品・属性でバリエーション | button, nav-link, section-heading |
| Pattern | 複数スロット・施設データ注入 | header, footer, image-text-section |
| Section | ページ固有のレイアウトブロック | rooms-types, news-timeline |

---

### Phase 4 — データ切り出し

**`facility.json`** — サイト全体で共通・変更頻度が低い情報

- ブランド名・ロゴ
- 電話・住所・予約リンク
- Hero 背景・キャッチコピー

**`content.json`** — セクション別コンテンツ・ナビゲーション

- 各セクションの見出し・本文・画像参照
- `navigation.items` — href は **ファイル名のみ**（`pages/` プレフィックスなし）

```json
{ "label": "客室", "href": "rooms.html" }
```

**注入フロー（`initPage`）**

```
loadSections()
  → loadFacilityData() + applyFacilityData()
  → loadContentData() + applyContentData()
  → loadPatterns()
  → loadComponents()
  → applyPageCtaLinks()
```

---

### Phase 5 — リンク・パス接続

#### リンク解決（`resolvePageHref`）

| コンテキスト | `rooms.html` の解決結果 |
|--------------|-------------------------|
| TOP 開発（`src/index.html`） | `pages/rooms.html` |
| 下層開発（`src/pages/*.html`） | `rooms.html` |
| 本番ビルド（`__SITE_BUILD__`） | `rooms.html` |

`content.json` の href は常に `rooms.html` 形式で記述し、解決はランタイムに任せる。

#### 画像パス規約

| 参照元 | 開発時パス | 本番（`dist/`） |
|--------|-----------|----------------|
| TOP セクション / JSON | `../assets/images/...` | `assets/images/...` |
| 下層セクション | `../../assets/images/...` | `assets/images/...` |

**注意:** 本番ビルドでは `../../assets/` を **`../assets/` より先に** 置換する。順序を逆にすると `../../assets/` が `../assets/` に壊れる。

#### ホームリンク

| コンテキスト | ロゴ href |
|--------------|-----------|
| TOP 開発 | `/` または `index.html` |
| 下層開発 | `../index.html` |
| 本番下層 | `index.html` |

---

### Phase 6 — 画像アセット整理

1. 参照一覧を洗い出す（セクション HTML + JSON）
2. 不足ファイルをクライアント素材から `assets/images/` へ配置
3. Pencil 固有パス（エクスポート時の一時パス）を規約パスへ修正
4. 必要に応じて同期スクリプトを作成（`npm run sync:assets`）

**ならいの風での例**

- TOP 専用 13 件（`hero-bg.jpg`, `access-map.png` 等）
- 下層追加分 36 件（`dish/`, `追加/`, `未使用/` 由来）
- `access-map.png`（TOP）と `map.png`（下層 access）は **別ファイル**

---

### Phase 7 — 本番ビルド接続

```bash
npm install
npm run build
```

**ビルド処理（`build-production.mjs`）**

1. `src/index.html` + `src/pages/*.html` を列挙
2. 各ページで linkedom 上に `initPage()` を実行（section / data / pattern / component 展開）
3. `load-data.js` / `load-sections.js` の `<script>` を除去
4. アセットパスを `assets/` に書き換え
5. `dist/{filename}.html` として出力
6. `assets/` と `scripts/animation.js` を `dist/` へコピー

**下層ページビルド時の必須設定**

linkedom はインライン `<script>` を実行しないため、ビルドスクリプト側で明示的に設定する。

```javascript
window.__SRC_BASE__ = "../";
window.__ASSET_BASE__ = "../../assets/";
window.__SITE_BUILD__ = true;
```

**fetch 基準ディレクトリ**

| ページ | baseDir | `../sections/header.html` の解決先 |
|--------|---------|--------------------------------------|
| TOP | `src/` | `src/sections/header.html` |
| 下層 | `src/pages/` | `src/sections/header.html` |

---

## ディレクトリ構成（テンプレート）

```
project-root/
├── assets/images/          # 画像（ルート管理）
├── dist/                   # 本番出力（gitignore 推奨）
├── docs/
│   ├── builder-workflow.md # 本ドキュメント
│   └── project-context.md  # 案件コンセプト
├── scripts/
│   ├── build-production.mjs
│   └── sync-page-assets.mjs  # 案件固有の素材同期（任意）
├── src/
│   ├── components/         # UI 部品
│   ├── data/
│   │   ├── facility.json
│   │   └── content.json
│   ├── index.html          # TOP シェル
│   ├── pages/              # 下層シェル
│   ├── patterns/           # 再利用パターン定義
│   ├── scripts/
│   │   ├── load-data.js
│   │   ├── load-sections.js
│   │   └── animation.js
│   ├── sections/           # セクション断片
│   ├── styles/             # CSS トークン（任意）
│   └── templates/web-production/
│       ├── site.manifest.json
│       └── index.template.html
├── package.json
└── README.md
```

---

## 検証チェックリスト（Builder 完了判定）

### 開発環境

- [ ] プロジェクトルートで `py -m http.server 8080` を起動
- [ ] `http://localhost:8080/src/index.html` — TOP 全セクション表示
- [ ] `http://localhost:8080/src/pages/{page}.html` — 下層各ページ表示
- [ ] 下層ページシェルが `w-full max-w-[1440px] mx-auto items-stretch` かつ `<main class="w-full">` である
- [ ] 1366px / 1920px 幅で Header と main の横幅が一致する（DevTools で確認）
- [ ] セクション内に `w-[1440px]` / `w-[1240px]` の absolute 要素が残っていない
- [ ] ナビリンクが全ページで機能
- [ ] 画像 404 がない（DevTools Network 確認）
- [ ] `file://` 直開きは **使わない**（fetch CORS エラー）

### 本番ビルド

- [ ] `npm run build` がエラーなく完了
- [ ] `dist/index.html` + `dist/{page}.html` が出力される
- [ ] `dist/` 内に `../assets/` や `pages/` プレフィックス付きリンクが残っていない
- [ ] `load-data.js` / `load-sections.js` が HTML に含まれていない
- [ ] `http://localhost:8080/dist/index.html` — TOP 表示
- [ ] 下層ページ間・TOP へのリンクが機能

---

## ならいの風案件 — 実施サマリー

| 項目 | 内容 |
|------|------|
| ページ数 | TOP 1 + 下層 6（rooms, onsen, cuisine, news, access, faq） |
| セクション | 40+ ファイル |
| データ | `facility.json` + `content.json` |
| 画像 | 49 参照 / 38 ユニーク → `assets/images/` へ整理 |
| ビルド | 7 HTML を `dist/` 直下へフラット出力 |
| スクリプト | `sync:assets`（レガシー素材同期）, `build`（本番生成） |

---

## テンプレートへのフィードバック（知見）

以下は次案件以降の Builder テンプレートに組み込むべき知見です。

### 1. Pencil 生 HTML をそのまま残さない

下層ページを Pencil エクスポートのまま置くと、Header/Footer 重複・リンク切れ・ビルド不能になる。**最初にページシェル化する。**

### 2. ページシェルは必ずテンプレート化する

TOP 用・下層用の 2 パターンを **`web-production-template` リポジトリ側** で用意し、案件では `__SRC_BASE__` / `__ASSET_BASE__` を下層に必ず含める。

### 3. セクション命名は `{page}-{role}` で統一

後からセクション追加・差し替えが容易。TOP ティーザーと下層フルページは **別セクション** として扱う。

### 4. JSON の href はファイル名のみ

`pages/rooms.html` ではなく `rooms.html`。解決ロジック（`resolvePageHref`）を 1 箇所に集約する。

### 5. パス規約は 2 系統を明文化する

- TOP: `../assets/`
- 下層: `../../assets/`
- 本番: いずれも `assets/`

### 6. 本番ビルドは最初から multi-page 対応で設計

`src/pages/*.html` → `dist/*.html` のフラット出力。fetch の baseDir をページ所在ディレクトリ基準にする。

### 7. ビルド時は linkedom の制約を考慮

- インライン script は実行されない → グローバル変数はビルドスクリプトで注入
- アセット置換は長いパスから順に適用

### 8. 画像は早い段階で監査する

Pencil エクスポート固有パスが残ると、下層ページほど修正コストが高い。セクション分割と同時にパス修正する。

### 9. HTTP サーバーはプロジェクトルートから起動

`src/` 内から起動すると `../assets/` が 404 になる。

### 10. Builder 完了の定義をチェックリスト化する

「HTML が存在する」≠「Builder 完了」。開発表示・本番ビルド・リンク・画像の 4 点セットで判定する。

### 11. ページ横幅は Pencil 値をそのまま使わない

ならいの風案件（2026）で判明したレイアウト不具合。Pencil エクスポートは 1440px アートボード前提のため、シェル化時に必ず補正する。

**ページシェル（TOP / 下層共通の原則）**

| 項目 | NG（Pencil 由来） | OK（テンプレート正） |
|------|------------------|---------------------|
| ラッパー幅 | `w-[1440px]` | `w-full max-w-[1440px] mx-auto` |
| Flex 子 | `items-start` | `items-stretch` |
| main | クラスなし | `class="w-full"`（下層） |
| body | `margin: 0` のみ | `overflow-x: hidden` も付与 |

**セクション（Hero / CTA / タイムライン）**

| 要素 | NG | OK |
|------|----|----|
| Hero / CTA オーバーレイ | `w-[1440px] absolute left-0 top-0` | `absolute inset-0 w-full h-full` |
| タイムライン容器 | 子スロット `w-[1240px]` 固定 | 容器 `max-w-[1240px] mx-auto` + スロット `w-full` |
| Hero 背景 | 透明 + 別レイヤー `w-[1440px]` | 親 `bg-cover` + オーバーレイ `inset-0` |

`load-sections.js` の `buildFinalCtaBannerHtml()` が OK パターンの参照実装。Pencil セクション分割後は Hero / CTA を同パターンへ揃える。

**なぜ崩れるか（メカニズム）**

1. `items-start` + `<main>` 無幅指定 → main が shrink-to-fit（Intro 等で ~960px）
2. Header / Footer は `w-full` → 1440px 幅
3. Hero / CTA の `w-[1440px]` absolute が狭い main からはみ出す → 横幅不一致・横スクロール

本知見は **`web-production-template` リポジトリ**（`docs/PROJECT_CONTEXT.md` 参照）へのフィードバック対象。案件側ではページシェル・セクションを手修正済み。

---

## 関連ファイル

| ファイル | 役割 |
|----------|------|
| `src/scripts/load-sections.js` | section / pattern / component 展開 |
| `src/scripts/load-data.js` | JSON 注入・リンク解決 |
| `scripts/build-production.mjs` | 本番静的 HTML 生成 |
| `src/templates/web-production/site.manifest.json` | ビルド設定（案件固有 scripts 等） |
| `package.json` | `build`, `sync:assets` スクリプト |
