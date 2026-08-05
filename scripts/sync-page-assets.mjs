import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DEST = path.join(ROOT, "assets", "images");
/** @deprecated 2026-08 フォルダ統合済み。再同期が必要な場合のみ Desktop\\ボツならいの風 を指定 */
const LEGACY_ROOT =
  process.env.LEGACY_ASSETS_ROOT ??
  path.join(process.env.USERPROFILE ?? "", "Desktop", "ボツならいの風");

function resolveSourceDir() {
  const candidates = [
    path.join(LEGACY_ROOT, "narainokaze-hp", "assets", "images"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error("narainokaze-hp/assets/images source directory not found");
}

function resolveSourceRoot(kind) {
  switch (kind) {
    case "hp":
      return resolveSourceDir();
    case "add":
      return path.join(LEGACY_ROOT, "追加");
    case "unused":
      return path.join(LEGACY_ROOT, "未使用");
    default:
      throw new Error(`Unknown source kind: ${kind}`);
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyFile(from, to) {
  if (!fs.existsSync(from)) {
    throw new Error(`Missing source file: ${from}`);
  }
  ensureDir(to);
  fs.copyFileSync(from, to);
}

function resolveSourceFile(sourceDir, sourceName) {
  const nested = path.join(sourceDir, sourceName);
  if (fs.existsSync(nested)) {
    return nested;
  }

  const basename = path.basename(sourceName);
  const direct = path.join(sourceDir, basename);
  if (fs.existsSync(direct)) {
    return direct;
  }

  return null;
}

function main() {
  /** @type {Array<[string, string, "hp" | "add" | "unused"]>} */
  const copies = [
    ["IMGP1204.JPG", "IMGP1204.JPG", "hp"],
    ["map.png", "map.png", "hp"],
    ["hachijo-hero.jpg", "hachijo-hero.jpg", "hp"],
    ["hachijo-02.jpg", "hachijo-02.jpg", "hp"],
    ["hachijo-03.jpg", "hachijo-03.jpg", "hp"],
    ["hachijo-04.jpg", "hachijo-04.jpg", "hp"],
    ["niijima-hero.jpg", "niijima-hero.jpg", "hp"],
    ["kaminoshima-02.jpg", "kaminoshima-02.jpg", "hp"],
    ["sup.jpg", "sup.jpg", "hp"],
    ["dish/dish-farm-veg.jpg", "dish/dish-farm-veg.jpg", "hp"],
    ["dish/dish-kinmedai-01.jpg", "dish/dish-kinmedai-01.jpg", "hp"],
    ["dish/dish-kinmedai-02.jpg", "dish/dish-kinmedai-02.jpg", "hp"],
    ["dish/dish-kinmedai-03.jpg", "dish/dish-kinmedai-03.jpg", "hp"],
    ["dish/dish-kinmedai-04.jpg", "dish/dish-kinmedai-04.jpg", "hp"],
    ["dish/dish-kinmedai-05.jpg", "dish/dish-kinmedai-05.jpg", "hp"],
    ["dish/dish-lobster-salad.jpg", "dish/dish-lobster-salad.jpg", "hp"],
    ["dish/dish-tokobushi.jpg", "dish/dish-tokobushi.jpg", "hp"],
    ["dish/dish-veg-tempura.jpg", "dish/dish-veg-tempura.jpg", "hp"],
    ["dish/dish-visual-banner.jpg", "dish/dish-visual-banner.jpg", "hp"],
    ["未使用/天草.jpg", "天草.jpg", "unused"],
    ["未使用/部屋.jpg", "部屋.jpg", "unused"],
    ["未使用/IMG_0132.JPG", "IMG_0132.JPG", "unused"],
    ["追加/食べる子ども.jpg", "食べる子ども.jpg", "add"],
    ["追加/祖父母と孫.png", "祖父母と孫.png", "add"],
    ["追加/過ごし方.JPG", "過ごし方.JPG", "add"],
    ["追加/ドライブ.jpg", "ドライブ.jpg", "add"],
    ["追加/車窓.jpg", "車窓.jpg", "add"],
    ["お部屋.jpg", "お部屋.jpg", "hp"],
    ["温泉湯.jpg", "温泉湯.jpg", "hp"],
    ["大浴場.jpg", "大浴場.jpg", "hp"],
    ["温泉.jpg", "温泉.jpg", "hp"],
    ["部屋温泉.jpg", "部屋温泉.jpg", "hp"],
    ["料理.jpg", "料理.jpg", "hp"],
    ["イセエビ.jpg", "イセエビ.jpg", "hp"],
    ["スノーケル.jpg", "スノーケル.jpg", "hp"],
    ["海水浴.jpg", "海水浴.jpg", "hp"],
  ];

  let copied = 0;

  for (const [destRel, sourceName, sourceKind] of copies) {
    const sourceDir = resolveSourceRoot(sourceKind);
    const from = resolveSourceFile(sourceDir, sourceName);
    if (!from) {
      throw new Error(`Source file not found: ${sourceName} (${sourceKind})`);
    }
    const to = path.join(DEST, destRel);
    copyFile(from, to);
    copied += 1;
    console.log(`copied ${from} -> ${destRel}`);
  }

  console.log(`Done. ${copied} files copied to ${DEST}`);
}

main();
