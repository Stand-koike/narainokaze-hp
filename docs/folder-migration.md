# フォルダ統合メモ（2026-08）

## 実施済み

| 項目 | 状態 |
|------|------|
| Pencil 本体 | `pencil/narainokaze-design.pen` に配置 |
| Pencil エクスポート | `pencil/export/narainokaze-design.html` |
| MCP 設定 | `.cursor/mcp.json` |
| 案件メモ | `docs/project-notes.txt`, `docs/DESIGN-legacy-reference.md` |
| 作業コピー | `01.案件/ならいの風-website/`（Git 履歴付き） |
| 旧資産アーカイブ | `Desktop/ボツならいの風/`（目視後に手動削除） |

## 仕上げ（2026-08-05 完了）

- [x] `01.案件/ならいの風-website` → **`01.案件/ならいの風`** にリネーム
- [x] 旧 `01.案件/ならいの風`（レガシー）削除
- [x] **`01.案件/sotoura-hotel-site`** — 削除済み（2026-08-05）
- [ ] **`Desktop/ボツならいの風`** — 目視確認後、手動削除

### 次のアクション

1. ~~Cursor で **`C:\Users\vagab\Desktop\Stand\01.案件\ならいの風`** を開き直す~~
2. ~~旧 `sotoura-hotel-site` フォルダを削除~~
3. `Desktop/ボツならいの風` を削除

## 最終構成

```
Stand/01.案件/ならいの風/          ← 唯一の作業フォルダ（旧 sotoura-hotel-site）
├── pencil/
│   ├── narainokaze-design.pen     ← Pencil MCP で編集
│   └── export/
├── src/
├── assets/
├── docs/
└── .cursor/mcp.json
```

GitHub リポジトリ名は **`narainokaze-hp`** に統一。
