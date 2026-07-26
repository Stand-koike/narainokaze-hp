# アニメーション仕様書（編集用）

> **使い方:** このファイルを手で書き換える → チャットで「`docs/animation-spec.md` を読んで `animation.js` に反映して」と依頼する。  
> **実装ファイル:** `src/scripts/animation.js`  
> **公開範囲:** Netlify は `dist/` のみのため、本ファイルはローカル参照用。

---

## 作業フロー

```
1. この MD を編集して保存
2. Agent モードで依頼例を送る（下の「依頼文テンプレ」）
3. npm run build
4. dist/ または src/ で確認
5. 必要なら Netlify 再デプロイ
```

### 依頼文テンプレ（コピー用）

```
@docs/animation-spec.md
@src/scripts/animation.js

docs/animation-spec.md の内容を読んで、
src/scripts/animation.js に反映してください。
レイアウト・テキストは変更しないでください。
反映後 npm run build まで実行し、変更点を報告してください。
```

---

## 編集のルール

| やってよい | やらない |
|-----------|---------|
| 数値の変更（duration, y, stagger 等） | HTML のデザイン変更依頼をここに書く |
| ON / OFF（`enabled: true/false`） | 存在しないページ名の追加（先に相談） |
| 動きの種類メモ（fade / fade-up 等） | コードそのもの（JS）を直接書く必要はない |
| コメントで意図を書く | |

**値の目安（ラグジュアリー寄り）**

- `y`: 16〜30（大きいほど移動が大きい）
- `duration`: 0.6〜1.5
- `stagger`: 0.08〜0.2
- `start`: `top 80%`〜`top 90%`（小さい％ほど早めに発火）
- `ease`: 基本は `power2.out` のまま推奨

---

## 1. 共通パラメータ（LUXURY）

ここを変えると、ほぼ全体のトーンが変わります。

| キー | 現在値 | 説明 | 編集欄（書き換え用） |
|------|--------|------|----------------------|
| duration | `1.1` | 通常の長さ（秒） | `1.1` |
| durationSlow | `1.2` | Hero / ラベル用の長さ | `1.2` |
| y | `24` | 下からの移動量（px） | `24` |
| stagger | `0.12` | 順番遅れ（秒） | `0.12` |
| ease | `power2.out` | イージング | `power2.out` |
| start | `top 85%` | スクロール発火位置 | `top 85%` |

**全体メモ（任意）:**


---

## 2. 効果一覧（ON/OFF・個別調整）

`enabled` を `false` にすると、その効果を止めたい、という意味です（実装時に Agent が対応）。

### 2-1. TOP Hero Content（読込時）

| 項目 | 現在 |
|------|------|
| enabled | `true` |
| 対象 | `[data-animate="hero"]` の子要素（Hero Sub / Catch / Actions） |
| ページ | TOP |
| タイミング | ページ読込時 |
| 動き | fade-up + stagger（GSAP / `animation.js`） |
| duration | `durationSlow`（1.2） |
| stagger | `0.15` |
| y | 共通 `y` |

**メモ:** 参照サイトの lux Hero Content ではなく、当初の GSAP 入場を使用。背景 Ken Burns は `luxury-reveal.js`。

---

### 2-2. 下層 Page Hero（読込時）

| 項目 | 現在 |
|------|------|
| enabled | `true` |
| 対象 | `[data-pencil-name="Page Hero"]` 内の `Hero Content` の子 |
| ページ | rooms / onsen / cuisine / news / access / faq |
| タイミング | ページ読込時 |
| 動き | fade-up + stagger |
| duration | `durationSlow` |
| stagger | `0.15` |
| y | 共通 `y` |

**メモ:**


---

### 2-3. セクション reveal（スクロール）

| 項目 | 現在 |
|------|------|
| enabled | `true` |
| 対象 | `main` 直下の `div` / `section`（Hero 除く） |
| ページ | 全ページ |
| タイミング | スクロール（`start`） |
| 動き | fade-up（ブロック全体） |
| duration | 共通 `duration` |
| y | 共通 `y` |

※ 中にカードグリッドがあるセクションは、見出しなどグリッド以外だけ先に動かし、カードは 2-5 に任せる。

**メモ:**


---

### 2-4. ネスト reveal（スクロール）

| 項目 | 現在 |
|------|------|
| enabled | `true` |
| 対象 | `main` 直下以外の `[data-animate="reveal"]` |
| タイミング | スクロール |
| 動き | fade-up |

**メモ:**


---

### 2-5. カード / ギャラリー stagger（スクロール）

| 項目 | 現在 |
|------|------|
| enabled | `true` |
| タイミング | スクロール |
| 動き | fade-up + stagger（子要素が順に） |
| stagger | 共通 `stagger` |
| duration | 共通 `duration` |

#### 対象グリッド一覧（追加・削除可）

| pencil-name | 主ページ | enabled | メモ |
|-------------|---------|---------|------|
| `News Grid` | TOP お知らせ | `true` | |
| `Anxiety Grid` | TOP FAQ | `true` | |
| `Room Row` | 客室 | `true` | |
| `Bath Row` | 温泉 | `true` | |
| `Featured Activities` | 過ごし方 | `true` | |
| `Food Gallery` | 料理 | `true` | |

（行を足す場合は `data-pencil-name` の正確な名前を書く）

**メモ:**


---

### 2-6. ラベル（スクロール）

| 項目 | 現在 |
|------|------|
| enabled | `true` |
| 対象 | `[data-animate="label"]` |
| 動き | fade + 弱い scale（0.98 → 1） |
| duration | `durationSlow` |
| scaleFrom | `0.98` |

**メモ:**


---

### 2-7. 意図的に動かさないもの

| 対象 | 理由 |
|------|------|
| Header | 常時表示のため |
| Footer | 同上 |

（動かしたい場合はメモ欄に書いて依頼）

**メモ:**


---

## 3. ページ別チェックリスト（確認用）

確認時に ○ / × を手入力してよいです。

| ページ | Hero 読込時 | セクション reveal | カード stagger | 確認日・メモ |
|--------|-------------|-------------------|----------------|--------------|
| TOP (`index`) | | | | |
| rooms | | | | |
| onsen | | | | |
| cuisine | | | | |
| news | | | | |
| access | | | | |
| faq | | | | |

---

## 4. よくある書き換え例

### 全体をもっとゆっくり・控えめに

```
duration: 1.1
durationSlow: 1.4
y: 18
stagger: 0.15
```

### Hero だけ速くする

「2-1 / 2-2 の stagger を `0.1`、duration を `0.8` に」とメモ欄へ。

### TOP のカードだけ止める

`News Grid` / `Anxiety Grid` の enabled を `false`。

### 新しいグリッドを追加

cuisine などで見つけた `data-pencil-name="○○"` を 2-5 の表に1行追加。

---

## 5. 反映後の確認 URL

```
http://localhost:8080/src/index.html
http://localhost:8080/src/pages/rooms.html
http://localhost:8080/dist/index.html
http://localhost:8080/dist/rooms.html
```

※ Windows で「アニメーション効果」がオフだと動きません（`prefers-reduced-motion`）。

---

## 変更履歴（任意）

| 日付 | 変更内容 |
|------|---------|
| 2026-07-26 | 初版（現行 animation.js を書き出し） |
| 2026-07-26 | duration `0.9` → `1.1`（編集欄を反映） |
