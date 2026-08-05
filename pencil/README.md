# Pencil.dev（デザインソース）

| ファイル | 用途 |
|---------|------|
| `narainokaze-design.pen` | Pencil で編集するデザイン本体（Cursor MCP から操作） |
| `export/narainokaze-design.html` | Pencil からエクスポートした HTML（Builder 工程の入力） |

## ワークフロー

1. **Pencil** で `narainokaze-design.pen` を修正（Cursor 内 MCP）
2. 変更を **HTML Export** → `export/` に保存（上書きまたは差分確認）
3. Builder 工程で `src/sections/` へ反映（[docs/builder-workflow.md](../docs/builder-workflow.md)）

## 注意

- `.pen` はプロジェクトルートの `pencil/` に置く（旧 `01.案件\ならいの風\narainokaze-design.pen` から統合済み）
- エクスポート HTML は `data-pencil-name` 属性付き。Builder は構造分解のみ、デザインクラスは変更しない
