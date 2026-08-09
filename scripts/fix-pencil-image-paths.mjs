import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PEN_PATH = path.join(ROOT, "pencil", "narainokaze-design.pen");
const LEGACY_ROOT = path.join(
  process.env.USERPROFILE ?? "",
  "Desktop",
  "ボツならいの風",
);
const HP_IMAGES = path.join(LEGACY_ROOT, "narainokaze-hp", "assets", "images");
const DEST = path.join(ROOT, "assets", "images");

/** @type {Array<[string, string]>} destRelative, legacyRelativeFromLegacyRoot */
const EXTRA_COPIES = [
  ["ロゴ.png", path.join("narainokaze-hp", "assets", "images", "ロゴ.png")],
  ["DSC_3147.JPG", path.join("narainokaze-hp", "assets", "images", "DSC_3147.JPG")],
  ["IMGP1204.JPG", path.join("narainokaze-hp", "assets", "images", "IMGP1204.JPG")],
  ["map.png", path.join("narainokaze-hp", "assets", "images", "map.png")],
  ["お部屋2.jpg", path.join("narainokaze-hp", "assets", "images", "お部屋2.jpg")],
  ["ウエルカム.webp", path.join("narainokaze-hp", "assets", "images", "ウエルカム.webp")],
  ["野菜.jpg", path.join("narainokaze-hp", "assets", "images", "野菜.jpg")],
  ["追加/砂浜.jpg", path.join("追加", "砂浜.jpg")],
  ["追加/海の家族.png", path.join("追加", "海の家族.png")],
  ["追加/祖父母と孫.png", path.join("追加", "祖父母と孫.png")],
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyLegacyFile(destRel, legacyRel) {
  const from = path.join(LEGACY_ROOT, legacyRel);
  const to = path.join(DEST, destRel);
  if (!fs.existsSync(from)) {
    console.warn(`skip (missing legacy): ${legacyRel}`);
    return false;
  }
  ensureDir(to);
  fs.copyFileSync(from, to);
  console.log(`copied ${from} -> assets/images/${destRel}`);
  return true;
}

function fixUrl(url) {
  if (url.startsWith("../assets/images/")) {
    const tail = url.slice("../assets/images/".length);
    if (tail.includes("%")) {
      return `../assets/images/${decodeURIComponent(tail)}`;
    }
    return url;
  }

  if (url.startsWith("narainokaze-hp/assets/images/")) {
    return `../assets/images/${url.slice("narainokaze-hp/assets/images/".length)}`;
  }

  if (url.startsWith("narainokaze-classic/assets/images/")) {
    return `../assets/images/${url.slice("narainokaze-classic/assets/images/".length)}`;
  }

  const decoded = decodeURIComponent(url);
  if (decoded.startsWith("追加/")) {
    return `../assets/images/${decoded}`;
  }
  if (decoded.startsWith("未使用/")) {
    return `../assets/images/${decoded}`;
  }

  if (decoded.endsWith(".png") || decoded.endsWith(".jpg") || decoded.endsWith(".JPG") || decoded.endsWith(".webp")) {
    if (!decoded.includes("/")) {
      const addCandidate = path.join(DEST, "追加", decoded);
      if (fs.existsSync(addCandidate)) {
        return `../assets/images/追加/${decoded}`;
      }
      return `../assets/images/${decoded}`;
    }
  }

  if (url.startsWith("../assets/images/%")) {
    const tail = decodeURIComponent(url.slice("../assets/images/".length));
    return `../assets/images/${tail}`;
  }

  if (url === "dish-hero-header.jpg") {
    return "../assets/images/dish/dish-hero-header.jpg";
  }
  if (url === "top-meal-header.jpg") {
    return "../assets/images/dish/top-meal-header.jpg";
  }

  if (!url.includes("/") && !url.startsWith("%")) {
    return `../assets/images/${url}`;
  }

  return url;
}

function walk(node, stats) {
  if (!node || typeof node !== "object") {
    return;
  }

  if (typeof node.url === "string") {
    const next = fixUrl(node.url);
    if (next !== node.url) {
      node.url = next;
      stats.updated += 1;
    }
    const resolved = path.resolve(path.dirname(PEN_PATH), next);
    if (!fs.existsSync(resolved)) {
      stats.missing.add(next);
    }
  }

  for (const value of Object.values(node)) {
    walk(value, stats);
  }
}

function main() {
  if (!fs.existsSync(LEGACY_ROOT)) {
    throw new Error(`Legacy archive not found: ${LEGACY_ROOT}`);
  }

  let copied = 0;
  for (const [destRel, legacyRel] of EXTRA_COPIES) {
    if (copyLegacyFile(destRel, legacyRel)) {
      copied += 1;
    }
  }

  const pen = JSON.parse(fs.readFileSync(PEN_PATH, "utf8"));
  const stats = { updated: 0, missing: new Set() };
  walk(pen, stats);

  fs.writeFileSync(PEN_PATH, `${JSON.stringify(pen, null, 2)}\n`, "utf8");

  console.log(`Done. copied=${copied}, updatedUrls=${stats.updated}`);
  if (stats.missing.size > 0) {
    console.warn("Still missing:");
    for (const url of [...stats.missing].sort()) {
      console.warn(`  ${url}`);
    }
    process.exitCode = 1;
  }
}

main();
