import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXPORT = path.join(ROOT, "pencil/export/2omotenashi_narainokaze-design.html");
const PEN = path.join(ROOT, "pencil/narainokaze-design.pen");
const SRC = path.join(ROOT, "src");

const ASSET_MAP = {
  "Page Hero": "../../assets/images/追加/海の家族.png",
  "相談CTA": "../../assets/images/IMGP1204.JPG",
};

const STAFF = [
  ["あおい", "海の見えるフロントで、最初の笑顔を。"],
  ["かず", "地魚の旬を、毎朝漁港から届けます。"],
  ["みさき", "お部屋の準備は、家族のように丁寧に。"],
  ["けん", "温泉の湯加減、いつも見守っています。"],
  ["ゆう", "お食事の時間が、旅の思い出になりますように。"],
  ["さち", "小さなお子様連れも、安心してお任せください。"],
];

function readPenTexts() {
  const pen = JSON.parse(fs.readFileSync(PEN, "utf8"));
  const page = findNode(pen, (n) => n.name === "おもてなし — スタッフ紹介");
  if (!page) return null;

  const intro = findNode(page, (n) => n.name === "Intro Body");
  const heroSub = findNode(page, (n) => n.name === "Hero Sub");
  const heroCatch = findNode(page, (n) => n.name === "Hero Catch");

  return {
    intro: intro?.content ?? "",
    heroSub: heroSub?.content ?? "",
    heroCatch: heroCatch?.content ?? "",
  };
}

function findNode(node, test) {
  if (!node || typeof node !== "object") return null;
  if (test(node)) return node;
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findNode(item, test);
        if (found) return found;
      }
    } else if (value && typeof value === "object") {
      const found = findNode(value, test);
      if (found) return found;
    }
  }
  return null;
}

function textToHtml(text) {
  return text
    .split("\n")
    .map((line, index, arr) => (index < arr.length - 1 ? `${line}<br />` : line))
    .join("\n          ");
}

function buildHero(texts) {
  return `      <div
        data-pencil-name="Page Hero"
        class="box-border w-full h-[820px] shrink-0 bg-[url('../../assets/images/追加/海の家族.png')] bg-no-repeat bg-cover bg-center overflow-hidden relative"
      >
        <div
          data-pencil-name="Hero Overlay"
          class="box-border absolute inset-0 w-full h-full [background-image:linear-gradient(180deg,_#1A2422AA_0%,_#1A242266_45%,_#1A2422CC_100%)] bg-no-repeat bg-[length:100%_100%] opacity-40 [z-index:0]"
        ></div>
        <div
          data-pencil-name="Hero Content"
          class="box-border w-[calc(100%-2rem)] max-w-[520px] md:w-[520px] h-fit absolute left-4 md:left-[80px] top-[200px] md:top-[280px] flex flex-col gap-[28px] justify-start items-start [z-index:1]"
        >
          <div
            data-pencil-name="Hero Sub"
            class="text-[16px]/[29px] box-border w-full text-[#E8EEEA] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
          >
            ${textToHtml(texts.heroSub)}
          </div>
          <h1
            data-pencil-name="Hero Catch"
            class="m-0 text-[40px]/[54px] md:text-[56px]/[76px] box-border w-full text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left"
          >
            ${textToHtml(texts.heroCatch)}
          </h1>
        </div>
      </div>`;
}

function buildIntro(texts) {
  return `      <div
        data-pencil-name="Intro"
        class="box-border w-full h-fit shrink-0 flex flex-col gap-[16px] px-5 py-12 md:p-[72px_120px] justify-start items-center bg-[#F0F4F3]"
      >
        <div
          data-pencil-name="Intro Body"
          class="text-[16px]/[32px] box-border w-full max-w-[720px] text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-center"
        >
          ${textToHtml(texts.intro)}
        </div>
      </div>`;
}

function buildStaffCard(index, name, phrase) {
  const photo = String(index).padStart(2, "0");
  return `            <article
              data-pencil-name="Staff ${index}"
              class="box-border w-full md:[flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start min-w-0"
            >
              <div
                data-pencil-name="Staff Photo ${index}"
                class="box-border w-full h-[420px] md:h-[540px] shrink-0 flex flex-col gap-0 justify-center items-center bg-[#D1C7BD] overflow-hidden relative"
              >
                <img
                  src="../../assets/images/staff/staff-${photo}.jpg"
                  alt=""
                  class="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onerror="this.remove()"
                />
                <div
                  data-pencil-name="Photo Label"
                  class="text-[18px]/[normal] box-border text-[#8A908C] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic text-left [white-space:nowrap] relative [z-index:1]"
                >
                  Photo
                </div>
              </div>
              <div
                data-pencil-name="Staff Name"
                class="text-[16px]/[normal] box-border text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left"
              >
                ${name}
              </div>
              <div
                data-pencil-name="Staff Phrase"
                class="text-[13px]/[21px] box-border w-full text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
              >
                ${phrase}
              </div>
            </article>`;
}

function buildStaffSection() {
  const row1 = STAFF.slice(0, 3)
    .map(([name, phrase], i) => buildStaffCard(i + 1, name, phrase))
    .join("\n");
  const row2 = STAFF.slice(3, 6)
    .map(([name, phrase], i) => buildStaffCard(i + 4, name, phrase))
    .join("\n");

  return `      <div
        data-pencil-name="Staff Section"
        class="box-border w-full h-fit shrink-0 flex flex-col gap-[48px] px-5 py-12 md:p-[80px] justify-start items-center bg-[#E8EEEA]"
      >
        <div
          data-pencil-name="Staff Head"
          class="box-border w-full h-fit shrink-0 flex flex-col gap-[12px] justify-start items-center"
        >
          <div
            data-pencil-name="Staff En"
            class="text-[14px]/[normal] box-border text-[#4A5D5B] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-left [white-space:nowrap]"
          >
            Our Team
          </div>
          <h2
            data-pencil-name="Staff Ja"
            class="m-0 text-[28px]/[normal] md:text-[32px]/[normal] box-border text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-center"
          >
            私たちが、お待ちしています
          </h2>
        </div>
        <div
          data-pencil-name="Staff Grid"
          class="box-border w-full max-w-[1280px] h-fit shrink-0 flex flex-col gap-[40px] justify-start items-stretch"
        >
          <div
            data-pencil-name="Staff Row 1"
            class="box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-8 md:gap-[32px] justify-start items-stretch"
          >
${row1}
          </div>
          <div
            data-pencil-name="Staff Row 2"
            class="box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-8 md:gap-[32px] justify-start items-stretch"
          >
${row2}
          </div>
        </div>
      </div>`;
}

function buildCta() {
  return `      <div
        data-pencil-name="相談CTA"
        class="box-border w-full h-fit min-h-[480px] md:min-h-[573px] md:h-[573px] shrink-0 flex flex-col gap-[20px] px-5 py-16 md:p-[80px_100px] justify-center items-center bg-[url('../../assets/images/IMGP1204.JPG')] bg-no-repeat bg-cover bg-center overflow-hidden relative"
      >
        <div
          data-pencil-name="CTA Overlay"
          class="box-border absolute inset-0 w-full h-full bg-[#1a242299] [z-index:0]"
        ></div>
        <div
          data-pencil-name="CTA Heading"
          class="text-[28px]/[40px] md:text-[36px]/[normal] box-border text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-center relative [z-index:1]"
        >
          お電話でのご予約・お問い合わせ
        </div>
        <div
          data-pencil-name="CTA Body"
          class="text-[16px]/[30px] box-border w-full max-w-[560px] px-1 text-[#D1C7BD] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-center relative [z-index:2]"
        >
          TEL：0558-36-4500
        </div>
        <div
          data-pencil-name="CTA Actions"
          class="box-border w-full max-w-[560px] h-fit shrink-0 flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] p-[12px_0px_0px_0px] justify-center items-center relative [z-index:3]"
        >
          <div
            data-pencil-name="CTA Tel"
            class="text-[28px]/[normal] box-border text-[#BFA170] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
          >
            0558-36-4500
          </div>
          <div
            data-pencil-name="CTA Book"
            class="box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[14px_28px] justify-start items-center bg-[#BFA170] rounded-[2px]"
          >
            <div
              data-pencil-name="CTA Book Label"
              class="text-[14px]/[normal] box-border text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
            >
              空室確認・予約
            </div>
          </div>
        </div>
      </div>`;
}

function buildPageShell() {
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>おもてなし | 蒼海の宿 ならいの風</title>
    <meta
      name="description"
      content="外浦の海のそばで、皆さまのご到着をお待ちしています。スタッフ紹介。蒼海の宿 ならいの風。"
    />
    <script>
      tailwind = { config: { corePlugins: { preflight: false } } };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond%3Aital%2Cwght%400%2C300..700%3B1%2C300..700&family=Shippori+Antique+B1%3Awght%40400&family=Shippori+Mincho%3Awght%40400%3B500&display=swap"
      rel="stylesheet"
    />
    <style>
      *, ::before, ::after {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        overflow-x: hidden;
      }
    </style>
  </head>
  <body data-page="omotenashi">
    <div
      data-pencil-name="おもてなし — スタッフ紹介"
      class="box-border w-full max-w-[1440px] mx-auto h-fit flex flex-col gap-0 justify-start items-stretch bg-[#F0F4F3] overflow-hidden"
    >
      <div data-include="../sections/header.html"></div>
      <main class="w-full">
        <div data-include="../sections/omotenashi-hero.html"></div>
        <div data-include="../sections/omotenashi-intro.html"></div>
        <div data-include="../sections/omotenashi-staff.html"></div>
        <div data-include="../sections/omotenashi-cta.html"></div>
      </main>
      <div data-include="../sections/footer.html"></div>
    </div>
    <script>
      window.__SRC_BASE__ = "../";
      window.__ASSET_BASE__ = "../../assets/";
    </script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script src="../scripts/load-data.js"></script>
    <script src="../scripts/load-sections.js"></script>
    <script src="../scripts/animation.js"></script>
  </body>
</html>
`;
}

function updateContentJson() {
  const contentPath = path.join(SRC, "data/content.json");
  const content = JSON.parse(fs.readFileSync(contentPath, "utf8"));

  content.navigation = {
    items: [
      { "label": "客室", "href": "rooms.html" },
      { "label": "料理", "href": "cuisine.html" },
      { "label": "温泉", "href": "onsen.html" },
      { "label": "過ごし方", "href": "news.html" },
      { "label": "おもてなし", "href": "omotenashi.html" },
      { "label": "アクセス", "href": "access.html" },
      { "label": "FAQ", "href": "faq.html" },
    ],
  };

  content.omotenashi = {
    id: "omotenashi",
    pencilName: "おもてなし — スタッフ紹介",
    heroImage: "../assets/images/追加/海の家族.png",
    staff: STAFF.map(([name, phrase], index) => ({
      id: index + 1,
      name,
      phrase,
      image: `../assets/images/staff/staff-${String(index + 1).padStart(2, "0")}.jpg`,
    })),
  };

  fs.writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

function ensureStaffDir() {
  const staffDir = path.join(ROOT, "assets/images/staff");
  fs.mkdirSync(staffDir, { recursive: true });
  const readme = path.join(staffDir, "README.txt");
  if (!fs.existsSync(readme)) {
    fs.writeFileSync(
      readme,
      `スタッフ写真をここに配置してください。

staff-01.jpg … あおい
staff-02.jpg … かず
staff-03.jpg … みさき
staff-04.jpg … けん
staff-05.jpg … ゆう
staff-06.jpg … さち

推奨: 縦長（3:4）・JPEG
`,
      "utf8",
    );
  }
}

function validateExport() {
  if (!fs.existsSync(EXPORT)) {
    throw new Error(`Export not found: ${EXPORT}`);
  }
  const html = fs.readFileSync(EXPORT, "utf8");
  const { document } = parseHTML(html);
  const page = document.querySelector('[data-pencil-name="おもてなし — スタッフ紹介"]');
  if (!page) {
    throw new Error("Export is missing おもてなし — スタッフ紹介 frame");
  }
  for (const name of Object.keys(ASSET_MAP)) {
    const section = page.querySelector(`[data-pencil-name="${name}"]`);
    if (!section) {
      throw new Error(`Export is missing section: ${name}`);
    }
  }
}

function writeFile(rel, content) {
  const filePath = path.join(SRC, rel);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
  console.log(`wrote ${rel}`);
}

function main() {
  validateExport();
  const texts = readPenTexts();
  if (!texts) {
    throw new Error("Could not read omotenashi texts from pen file");
  }

  writeFile("sections/omotenashi-hero.html", buildHero(texts));
  writeFile("sections/omotenashi-intro.html", buildIntro(texts));
  writeFile("sections/omotenashi-staff.html", buildStaffSection());
  writeFile("sections/omotenashi-cta.html", buildCta());
  writeFile("pages/omotenashi.html", buildPageShell());
  updateContentJson();
  ensureStaffDir();
  console.log("Done. Run: npm run build");
}

main();
