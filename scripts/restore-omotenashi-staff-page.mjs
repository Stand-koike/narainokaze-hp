import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PEN_PATH = path.join(__dirname, "..", "pencil", "narainokaze-design.pen");

const STAFF = [
  ["あおい", "海の見えるフロントで、最初の笑顔を。"],
  ["かず", "地魚の旬を、毎朝漁港から届けます。"],
  ["みさき", "お部屋の準備は、家族のように丁寧に。"],
  ["けん", "温泉の湯加減、いつも見守っています。"],
  ["ゆう", "お食事の時間が、旅の思い出になりますように。"],
  ["さち", "小さなお子様連れも、安心してお任せください。"],
];

let counter = 0;
function id(prefix = "s") {
  counter += 1;
  return `${prefix}${counter.toString(36)}${Math.random().toString(36).slice(2, 4)}`;
}

function findById(node, targetId) {
  if (!node || typeof node !== "object") return null;
  if (node.id === targetId) return node;
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findById(item, targetId);
        if (found) return found;
      }
    } else if (value && typeof value === "object") {
      const found = findById(value, targetId);
      if (found) return found;
    }
  }
  return null;
}

function removeChildById(parent, childId) {
  if (!parent?.children) return false;
  const index = parent.children.findIndex((c) => c.id === childId);
  if (index === -1) return false;
  parent.children.splice(index, 1);
  return true;
}

function makeStaffCard(index, name, phrase) {
  const photoId = id("p");
  return {
    type: "frame",
    id: id("c"),
    name: `Staff ${index}`,
    width: "fill_container",
    layout: "vertical",
    gap: 16,
    children: [
      {
        type: "frame",
        id: photoId,
        name: `Staff Photo ${index}`,
        width: "fill_container",
        height: 540,
        fill: "#D1C7BD",
        layout: "vertical",
        justifyContent: "center",
        alignItems: "center",
        children: [
          {
            type: "text",
            id: id("t"),
            name: "Photo Label",
            content: "Photo",
            fontFamily: "Cormorant Garamond",
            fontSize: 18,
            fontStyle: "italic",
            fill: "#8A908C",
          },
        ],
      },
      {
        type: "text",
        id: id("t"),
        name: "Staff Name",
        content: name,
        fontFamily: "Shippori Mincho",
        fontSize: 16,
        fontWeight: "500",
        fill: "#2E3334",
      },
      {
        type: "text",
        id: id("t"),
        name: "Staff Phrase",
        content: phrase,
        fontFamily: "Shippori Mincho",
        fontSize: 13,
        fill: "#4A5456",
        textGrowth: "fixed-width",
        width: "fill_container",
        lineHeight: 1.6,
      },
    ],
  };
}

function makeStaffSection() {
  const rows = [];
  for (let r = 0; r < 2; r += 1) {
    const cards = [];
    for (let c = 0; c < 3; c += 1) {
      const i = r * 3 + c + 1;
      const [name, phrase] = STAFF[i - 1];
      cards.push(makeStaffCard(i, name, phrase));
    }
    rows.push({
      type: "frame",
      id: id("r"),
      name: `Staff Row ${r + 1}`,
      width: "fill_container",
      gap: 32,
      children: cards,
    });
  }

  return {
    type: "frame",
    id: id("sec"),
    name: "Staff Section",
    width: "fill_container",
    fill: "#E8EEEA",
    layout: "vertical",
    gap: 48,
    padding: [80, 80],
    alignItems: "center",
    children: [
      {
        type: "frame",
        id: id("h"),
        name: "Staff Head",
        layout: "vertical",
        gap: 12,
        alignItems: "center",
        width: "fill_container",
        children: [
          {
            type: "text",
            id: id("t"),
            name: "Staff En",
            content: "Our Team",
            fontFamily: "Cormorant Garamond",
            fontSize: 14,
            fontStyle: "italic",
            fill: "#4A5D5B",
            letterSpacing: 2,
          },
          {
            type: "text",
            id: id("t"),
            name: "Staff Ja",
            content: "私たちが、お待ちしています",
            fontFamily: "Shippori Mincho",
            fontSize: 32,
            fontWeight: "500",
            fill: "#2E3334",
          },
        ],
      },
      {
        type: "frame",
        id: id("g"),
        name: "Staff Grid",
        width: "fill_container",
        layout: "vertical",
        gap: 40,
        children: rows,
      },
    ],
  };
}

function setCurrentNav(pageFrame, currentLabel) {
  const labels = ["客室", "料理", "温泉", "過ごし方", "おもてなし", "アクセス", "FAQ"];

  function walkScoped(node, inPage = false, parentName = "") {
    if (!node || typeof node !== "object") return;
    if (node.id === pageFrame.id) inPage = true;

    if (inPage && node.type === "text" && labels.includes(node.content)) {
      const active = node.content === currentLabel;
      const inFooter = parentName === "Info Nav";
      if (node.name?.startsWith("Nav ") || inFooter) {
        if (inFooter) {
          node.fill = active ? "#FFFFFF" : "#D1C7BD";
          node.fontWeight = active ? "500" : "normal";
        } else {
          node.fill = active ? "#2E3334" : "#4A5D5B";
          node.fontWeight = active ? "600" : "normal";
        }
      }
    }

    for (const child of node.children ?? []) {
      walkScoped(child, inPage, node.name ?? parentName);
    }
  }

  walkScoped(pageFrame, true);
}

function main() {
  const pen = JSON.parse(fs.readFileSync(PEN_PATH, "utf8"));
  const page = findById(pen, "q3SOE");
  if (!page) throw new Error("おもてなし frame (q3SOE) not found");

  page.name = "おもてなし — スタッフ紹介";
  page.height = "fit_content";

  const introBody = findById(page, "MFXCP");
  if (introBody) {
    introBody.content =
      "外浦の海のそばで、皆さまのご到着を心よりお待ちしております。\n漁師の家族が営む宿だからこそ、顔の見えるおもてなしを。";
  }

  removeChildById(page, "hZ8Ln");
  removeChildById(page, "JqwkI");

  const existingStaff = page.children?.find((c) => c.name === "Staff Section");
  if (existingStaff) {
    removeChildById(page, existingStaff.id);
  }

  const ctaIndex = page.children.findIndex((c) => c.id === "V1ieI");
  const staffSection = makeStaffSection();
  if (ctaIndex === -1) {
    page.children.push(staffSection);
  } else {
    page.children.splice(ctaIndex, 0, staffSection);
  }

  setCurrentNav(page, "おもてなし");

  fs.writeFileSync(PEN_PATH, `${JSON.stringify(pen, null, 2)}\n`, "utf8");
  console.log("Restored おもてなし — スタッフ紹介 page");
  console.log(
    "Sections:",
    page.children.map((c) => c.name).join(" → "),
  );
}

main();
