# フォルダ統合の仕上げスクリプト
# Cursor を閉じたあと、PowerShell で実行してください:
#   cd "C:\Users\vagab\Desktop\Stand\01.案件\ならいの風-website"
#   .\scripts\finish-folder-migration.ps1

$ErrorActionPreference = "Stop"
$base = "C:\Users\vagab\Desktop\Stand\01.案件"
$final = Join-Path $base "ならいの風"
$wip = Join-Path $base "ならいの風-website"
$legacy = Join-Path $base "ならいの風"
$wrapper = Join-Path $base "sotoura-hotel-site"
$botu = Join-Path $env:USERPROFILE "Desktop\ボツならいの風"

Write-Host "=== ならいの風 フォルダ統合（仕上げ） ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "前提:"
Write-Host "  - Cursor で旧ワークスペース (sotoura-hotel-site) を閉じていること"
Write-Host "  - Desktop\ボツならいの風 を目視確認済みであること"
Write-Host ""

if (-not (Test-Path -LiteralPath $wip)) {
  throw "作業コピーが見つかりません: $wip"
}

if (-not (Test-Path -LiteralPath $botu)) {
  Write-Warning "Desktop\ボツならいの風 がありません。旧フォルダのコピーを先に確認してください。"
}

$confirm = Read-Host "Desktop\ボツならいの風 を確認し、旧フォルダを削除して最終配置へ進めますか? (y/N)"
if ($confirm -notin @("y", "Y", "yes", "Yes")) {
  Write-Host "中止しました。"
  exit 0
}

if (Test-Path -LiteralPath $legacy) {
  Write-Host "削除: $legacy"
  Remove-Item -LiteralPath $legacy -Recurse -Force
}

if (Test-Path -LiteralPath $wrapper) {
  Write-Host "削除: $wrapper"
  Remove-Item -LiteralPath $wrapper -Recurse -Force
}

if (Test-Path -LiteralPath $final) {
  throw "既に存在します: $final （手動で確認してください）"
}

Write-Host "リネーム: $wip -> $final"
Rename-Item -LiteralPath $wip -NewName "ならいの風"

Write-Host ""
Write-Host "完了。" -ForegroundColor Green
Write-Host "新しいワークスペース: $final"
Write-Host "Cursor でこのフォルダを開き直してください。"
Write-Host ""
Write-Host "Desktop\ボツならいの風 は手動削除してください（確認後）。"
