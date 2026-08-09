import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PEN_PATH = path.join(ROOT, "pencil/narainokaze-design.pen");

function findNode(node, test) {
  if (!node || typeof node !== "object") {
    return null;
  }
  if (test(node)) {
    return node;
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findNode(child, test);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function walkChildren(node, visit) {
  if (!node?.children) {
    return;
  }
  for (const child of node.children) {
    visit(child);
    walkChildren(child, visit);
  }
}

function main() {
  const pen = JSON.parse(fs.readFileSync(PEN_PATH, "utf8"));
  const page = findNode(pen, (node) => node.name === "おもてなし — スタッフ紹介");
  if (!page) {
    throw new Error("Could not find おもてなし — スタッフ紹介 frame in pen file.");
  }

  let updated = 0;

  walkChildren(page, (node) => {
    const match = node.name?.match(/^Staff Photo (\d)$/);
    if (!match) {
      return;
    }

    const num = match[1].padStart(2, "0");
    node.fill = {
      type: "image",
      enabled: true,
      url: `../assets/images/staff/staff-${num}.jpg`,
      mode: "fill",
    };
    node.children = [];
    updated += 1;
  });

  fs.writeFileSync(PEN_PATH, `${JSON.stringify(pen, null, 2)}\n`, "utf8");
  console.log(`Updated ${updated} staff photo frames in pencil file.`);
}

main();
