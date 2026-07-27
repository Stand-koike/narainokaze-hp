/**
 * One-shot image optimization for delivery size (appearance-preserving).
 * Resizes to display*2 max and re-encodes JPEG. PNG without alpha → JPEG.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jobs = [
  // map: shown ~560px; identical access-map.png
  { src: "assets/images/map.png", out: "assets/images/map.jpg", width: 1200, quality: 82 },
  { src: "assets/images/map.png", out: "assets/images/access-map.jpg", width: 1200, quality: 82 },
  // access hero full-bleed
  { src: "assets/images/追加/祖父母と孫.png", out: "assets/images/追加/祖父母と孫.jpg", width: 1920, quality: 80 },
  // timeline thumbs ~300–600 CSS px
  { src: "assets/images/追加/ドライブ.jpg", out: "assets/images/追加/ドライブ.jpg", width: 900, quality: 80 },
  { src: "assets/images/追加/車窓.jpg", out: "assets/images/追加/車窓.jpg", width: 900, quality: 80 },
  // CTA / final backgrounds
  { src: "assets/images/IMGP1204.JPG", out: "assets/images/IMGP1204.JPG", width: 1920, quality: 80 },
  { src: "assets/images/final-cta-bg.jpg", out: "assets/images/final-cta-bg.jpg", width: 1920, quality: 80 },
  // TOP LCP-ish / large content images
  { src: "assets/images/hero-bg.jpg", out: "assets/images/hero-bg.jpg", width: 1920, quality: 80 },
  { src: "assets/images/intro.jpg", out: "assets/images/intro.jpg", width: 1440, quality: 80 },
  { src: "assets/images/cuisine-hero.jpg", out: "assets/images/cuisine-hero.jpg", width: 1440, quality: 80 },
  { src: "assets/images/onsen.jpg", out: "assets/images/onsen.jpg", width: 1200, quality: 80 },
  { src: "assets/images/rooms.jpg", out: "assets/images/rooms.jpg", width: 1200, quality: 80 },
  { src: "assets/images/host-main.png", out: "assets/images/host-main.jpg", width: 1200, quality: 80 },
];

function kb(n) {
  return `${(n / 1024).toFixed(0)}KB`;
}

for (const job of jobs) {
  const srcPath = path.join(root, job.src);
  const outPath = path.join(root, job.out);
  if (!fs.existsSync(srcPath)) {
    console.log("skip missing", job.src);
    continue;
  }
  const before = fs.statSync(srcPath).size;
  const buf = await sharp(srcPath)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .jpeg({ quality: job.quality, mozjpeg: true })
    .toBuffer();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmpPath = `${outPath}.tmp.jpg`;
  fs.writeFileSync(tmpPath, buf);
  fs.renameSync(tmpPath, outPath);
  const after = buf.length;
  console.log(`${kb(before)} → ${kb(after)}  ${job.out}`);
}
