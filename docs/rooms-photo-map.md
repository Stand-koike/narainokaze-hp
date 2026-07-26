# 客室名・写真 紐づけ表（編集用）

> **使い方:** 下の表を手で直して保存 → チャットで依頼文を送る → `rooms-types.html` / ギャラリーに反映  
> **写真フォルダ:** `assets/images/rooms/`  
> **実装データ:** `src/sections/rooms-types.html` 内の `data-room-data`

### 依頼文テンプレ（コピー用）

```
@docs/rooms-photo-map.md
@src/sections/rooms-types.html
@src/scripts/rooms-gallery.js

docs/rooms-photo-map.md の表を読んで、
部屋名・写真パスを rooms-types.html の data-room-data に反映してください。
パスは ../../assets/images/rooms/ファイル名 に統一。
レイアウトは変更しないでください。
反映後 npm run build まで実行し、変更点を報告してください。
```

---

## 編集ルール

| やってよい | やらない |
|-----------|---------|
| 部屋名・tab・title・lead・specs の文言修正 | 存在しないファイル名を書く |
| 写真ファイル名の差し替え・追加・削除 | `assets/images/` 直下パスを残す（rooms 配下に統一） |
| 行の追加（部屋を増やす） | |

**写真パスの書き方（表ではファイル名のみ）**

- 表: `hachijo-hero.jpg`
- 実装反映時: `../../assets/images/rooms/hachijo-hero.jpg`

カンマ区切りで左からギャラリー順（1枚目がメイン）。

---

## 1. 現在の部屋 ↔ 写真（編集欄あり）

### タイプ: 温泉付き（onsen）

| ID | tab（タブ名） | title（正式名称） | 現在の写真（カンマ区切り） | 編集後の写真 | 編集後の tab | 編集後の title | メモ |
|----|---------------|-------------------|---------------------------|--------------|--------------|----------------|------|
| onsen-1 | 八丈島 | 【八丈島】オーシャンビュー 半露天温泉風呂付 和洋室 | `hachijo-hero.jpg, hachijo-02.jpg, hachijo-03.jpg, hachijo-04.jpg` | | | | |
| onsen-2 | 初島 | 【初島】オーシャンビュー 温泉風呂付 和室二間 | `hatsushima-hero.jpg, hatsushima-02.jpg, hatsushima-03.jpg` | | | | |
| onsen-3 | 大島 | 【大島】オーシャンビュー 半露天温泉風呂付 和室12畳 | `oshima-hero.jpg, oshima-02.jpg, oshima-03.jpg` | | | | |

**lead / specs（おかしいところを直す）**

| ID | 現在 lead | 編集後 lead | 現在 specs | 編集後 specs |
|----|-----------|-------------|------------|--------------|
| onsen-1 | 外浦海水浴場を一望できる半露天風呂付きの和洋室。窓からは潮風と波の音。ご家族やカップルでの滞在に。 | | 間取り　和洋室（半露天風呂付）／定員　2〜4名／設備　半露天温泉風呂／オーシャンビュー／Wi‑Fi | |
| onsen-2 | 和室二間続きの広々とした客室に温泉風呂付き。三世代や大人数のご家族にもゆとりがあります。 | | 間取り　和室二間（温泉風呂付）／定員　2〜7名／設備　温泉風呂／オーシャンビュー／Wi‑Fi | |
| onsen-3 | 半露天温泉風呂付きの和室12畳。海を眺めながら、ご家族だけの湯時間をお楽しみください。 | | 間取り　和室12畳（半露天風呂付）／定員　2〜4名／設備　半露天温泉風呂／オーシャンビュー／Wi‑Fi | |

---

### タイプ: スタンダード（standard）

| ID | tab | title | 現在の写真 | 編集後の写真 | 編集後の tab | 編集後の title | メモ |
|----|-----|-------|------------|--------------|--------------|----------------|------|
| standard-1 | 新島 | 【新島】オーシャンビュー 次の間付 和室12畳 | `niijima-hero.jpg, niijima-02.jpg, niijima-03.jpg` | | | | |
| standard-2 | 三宅島 | 【三宅島】オーシャンビュー 次の間付 和室12畳 | `niijima-hero.jpg, niijima-02.jpg, niijima-03.jpg` | | | | 写真セットは現状共通 |

| ID | 現在 lead | 編集後 lead | 現在 specs | 編集後 specs |
|----|-----------|-------------|------------|--------------|
| standard-1 | 和室12畳とくつろぎのフロア。潮風と波音に包まれる、カップル・ご夫婦向けのオーシャンビュー客室です。 | | 間取り　和室12畳＋次の間／定員　2〜5名／設備　オーシャンビュー／次の間／Wi‑Fi | |
| standard-2 | 新島と同タイプのオーシャンビュー客室。ご予約状況に応じてお部屋をご案内いたします。 | | 間取り　和室12畳＋次の間／定員　2〜5名／設備　オーシャンビュー／次の間／Wi‑Fi | |

---

### タイプ: 山側ツイン（mountain）

| ID | tab | title | 現在の写真 | 編集後の写真 | 編集後の tab | 編集後の title | メモ |
|----|-----|-------|------------|--------------|--------------|----------------|------|
| mountain-1 | 神津島 A | 【神津島 A】山側 洋室ツイン | `kouzushima-03.jpg, kouzushima-02.jpg, kouzushima-01.jpg` | | | | 正綴りは `kouzushima` |
| mountain-2 | 神津島 B | 【神津島 B】山側 洋室ツイン | `kouzushima-03.jpg, kouzushima-02.jpg, kouzushima-01.jpg` | | | | |

| ID | 現在 lead | 編集後 lead | 現在 specs | 編集後 specs |
|----|-----------|-------------|------------|--------------|
| mountain-1 | 山側の静かな洋室ツイン。小さなお子様連れのベッド追加もご相談ください。 | | 間取り　洋室ツイン／定員　1〜2名／設備　ツインベッド／Wi‑Fi | |
| mountain-2 | A室と同タイプの山側ツイン。落ち着いた滞在を求める方におすすめです。 | | 間取り　洋室ツイン／定員　1〜2名／設備　ツインベッド／Wi‑Fi | |

---

## 2. `assets/images/rooms/` にあるファイル一覧（在庫）

手直し時はこの中から選んでください。

| プレフィックス | ファイル |
|----------------|----------|
| hachijo | `hachijo-hero.jpg`, `hachijo-01.jpg`, `hachijo-02.jpg`, `hachijo-03.jpg`, `hachijo-04.jpg` |
| hatsushima | `hatsushima-hero.jpg`, `hatsushima-01.jpg`, `hatsushima-02.jpg`, `hatsushima-03.jpg`, `hatsushima-04.jpg` |
| oshima | `oshima-hero.jpg`, `oshima-02.jpg`, `oshima-03.jpg` |
| niijima | `niijima-hero.jpg`, `niijima-01.jpg`, `niijima-02.jpg`, `niijima-03.jpg`, `niijima-04.jpg` |
| kozushima | `kozushima-hero.jpg`, `kozushima-02.jpg`（旧。未使用なら削除可） |
| kouzushima | `kouzushima-hero.jpg`, `kouzushima-01.jpg`, `kouzushima-02.jpg`, `kouzushima-03.jpg`（正） |
| kaminoshima | `kaminoshima-hero.jpg`, `kaminoshima-02.jpg`, `kaminoshima-03.jpg` |

**正綴り:** 神津島写真は `kouzushima-*` を使用。

---

## 3. カード一覧（上部3枚）の写真・名称

| カード | 現在の表示名 | 現在の写真 | 編集後の表示名 | 編集後の写真 | jump-type |
|--------|--------------|------------|----------------|--------------|-----------|
| 温泉付き | オーシャンビュー温泉付き | `hachijo-hero.jpg` | | | onsen |
| スタンダード | オーシャンビュー スタンダード | `niijima-hero.jpg` | | | standard |
| 山側ツイン | 山側ツイン | `kouzushima-02.jpg` | | | mountain |

---

## 4. 変更履歴

| 日付 | 内容 |
|------|------|
| 2026-07-26 | 初版（整理後の rooms/ ファイルと現行 data-room-data を突き合わせ） |
| 2026-07-26 | 反映: 新島/三宅島の名称分離、神津島写真を kouzushima に変更、パスを rooms/ に統一 |
