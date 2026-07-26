# Animation Guide

> **目的:** アニメーション追加・修正の指示方法を標準化する。  
> **公開範囲:** Netlify は `dist/` のみデプロイするため、本ファイルは **ローカル / Git 上でのみ** 参照します。  
> **数値・ON/OFF の編集:** → [animation-spec.md](animation-spec.md)（手入力 → Agent 反映用）

---

## 大事なこと（指示前に読む）

### 1. 実装は `src/`、確認は 2 段階

| 段階 | 場所 | 目的 |
|------|------|------|
| 開発確認 | `src/index.html` / `src/pages/*.html` | 動きの調整 |
| 公開前確認 | `dist/*.html`（`npm run build` 後） | 本番と同じ状態 |

`dist/` の HTML を直接編集しない（次のビルドで上書きされる）。

### 2. Agent モードで依頼する

Ask / Plan モードでは実装されない。修正依頼は **Agent モード** で送る。

### 3. 渡すファイルを明示する

| 依頼の種類 | 渡すもの |
|-----------|---------|
| 全ページ一括 | `@src/scripts/animation.js` `@src/pages/` `@src/sections/` |
| 一部セクション | `@src/scripts/animation.js` + 該当 section HTML |
| 速度・トーン調整のみ | `@src/scripts/animation.js` |

### 4. 下層ページには GSAP 読み込みが必要

TOP（`src/index.html`）には GSAP がある。下層（`src/pages/*.html`）にも GSAP + `animation.js` を入れること。  
「全ページ」と書いたら、ビルド後 `dist/` でも動くことまで完了条件に含める。

### 5. トーンを具体的に書く

「いい感じに」より次を指定する。

- 控えめ / ラグジュアリー / ゆっくり
- フェードイン + 軽い上スライド（y の目安）
- duration / stagger / ease
- **避けたい動き**（バウンス、大きな scale、派手な parallax）

### 6. レイアウトを壊さない

アニメーション依頼では「余白・テキスト・デザイン変更なし」を明記する。

### 7. `prefers-reduced-motion` を維持する

OS の「視差効果を減らす」が ON のときアニメを止める既存対応を残す。

### 8. 起動タイミング

| 環境 | 起動 |
|------|------|
| 開発（`load-sections.js` あり） | `page:ready` 後 |
| 本番（`dist/`、loader なし） | `DOMContentLoaded` |

本番で動かない場合は、まずこの分岐を疑う。

---

## 現在のフック一覧

### `data-animate` 属性

| 値 | 効果 |
|----|------|
| `hero` | TOP Hero のロード時フェードイン |
| `reveal` | スクロールでフェードイン（ネスト要素用） |
| `label` | ラベルのふわっと表示 |
| `card` | グリッド内カードの stagger |

### Convention（HTML 変更なしで対象になるもの）

| 対象 | セレクタ / 規則 |
|------|----------------|
| 下層 Hero | `[data-pencil-name="Page Hero"]` 内の `Hero Content` children |
| セクション全体 | `main > div, main > section`（Hero 除外） |
| カード列 | `News Grid` / `Anxiety Grid` / `Room Row` / `Bath Row` / `Featured Activities` / `Food Gallery` |
| Header / Footer | **動かさない**（`main` 外） |

定数（`LUXURY`）: duration 0.9〜1.2s / y: 24px / stagger: 0.12s / ease: `power2.out`

---

## 作業フロー

```
① チャットで依頼（Agent モード）
② src/ で確認
   TOP:  http://localhost:8080/src/index.html
   下層: http://localhost:8080/src/pages/rooms.html 等
③ npm run build
④ dist/ で最終確認
⑤ Netlify 再デプロイ
```

---

## プロンプト例 A — 全ページ一括（詳細・推奨）

```
@src/scripts/animation.js
@src/index.html
@src/pages/
@src/sections/
@src/scripts/load-sections.js

全ページ（TOP + 下層6ページ）に、ラグジュアリーなホテルサイト向けの
控えめなスクロールアニメーションを追加してください。

## トーン
- 上品・静か・余白を活かした動き
- フェードイン + 軽い上方向移動（y: 20〜30px 程度）
- duration 0.8〜1.2s、ease: power2.out 系
- stagger は 0.1〜0.15s 程度で要素が順に現れる感じ
- バウンス・大きな scale・派手な parallax は使わない

## 対象
- Hero（TOP + 各下層 Page Hero）: ロード時フェードイン
- main 内の主要ブロック: スクロールで reveal
- カード・ギャラリー: stagger フェードイン
- Header / Footer は動かさない（または最小限）

## 技術要件
- GSAP + ScrollTrigger を使用（既存方針を継続）
- prefers-reduced-motion 対応を維持
- page:ready 後に初期化（load-sections.js の流れを壊さない）
- 下層 pages/*.html にも GSAP / animation.js を導入
- npm run build 後、dist/ の全 HTML でも動作すること
- レイアウト・余白・テキスト内容は変更しない

## 完了条件
- 7ページすべてで Hero + 主要セクションのアニメが動く
- src/ と dist/ の両方で確認可能
- 変更ファイル一覧と確認 URL を報告
```

---

## プロンプト例 B — 全ページ一括（短縮）

```
@src/scripts/animation.js @src/pages/ @src/sections/

全7ページにラグジュアリーなフェードインアニメを入れてください。
控えめ・ゆっくり・ホテルサイト向け。Hero はロード時、
それ以外はスクロール reveal。GSAP 継続、reduced-motion 対応、
下層ページにも GSAP 導入、build 後 dist でも動作確認まで。
```

短縮版は手早いが、下層 GSAP 導入やビルド確認が抜けやすい。初回は例 A を推奨。

---

## プロンプト例 C — 一部セクションだけ

```
@src/scripts/animation.js
@src/sections/cuisine-signature.html
@src/sections/cuisine-harvest.html
@src/pages/cuisine.html

cuisine ページの以下2セクションだけアニメーションを追加してください。

1. cuisine-signature（キンメダイスライダー周辺）
   - スクロールで画像 → テキストの順にフェードイン（stagger 0.12s）

2. cuisine-harvest（農園セクション）
   - セクション全体を y: 24px からフェードイン

## 制約
- 他セクションは触らない
- ラグジュアリー寄り（duration 1s 前後、ease: power2.out）
- レイアウト変更なし
- cuisine ページで src / dist 両方確認
```

---

## プロンプト例 D — 既存アニメの調整

```
@src/scripts/animation.js

TOP Hero のアニメーションが速すぎるので調整してください。
- duration: 1 → 1.5
- stagger: 0.15 → 0.2
- y: 30 → 20（動きをより控えめに）
他のアニメ関数は変更しないでください。
```

---

## 依頼時に添えると精度が上がる情報

| 情報 | 例 |
|------|-----|
| 参考サイト | 「〇〇ホテルサイトのような控えめな reveal」 |
| スクショ | 動かしたいセクションを囲んだ画像 |
| 画面幅 | 「スマホでも同じ / スマホは弱めてほしい」 |
| 優先度 | 「Hero 最優先、CTA は後回し」 |

---

## 関連ファイル

| ファイル | 役割 |
|----------|------|
| `src/scripts/animation.js` | アニメーション本体 |
| `src/index.html` | TOP の GSAP 読み込み |
| `src/pages/*.html` | 下層の GSAP 読み込み |
| `scripts/build-production.mjs` | 本番出力（animation.js パス置換含む） |
| `docs/builder-workflow.md` | Builder 工程全体 |
