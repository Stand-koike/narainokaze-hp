import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const MANIFEST_PATH = path.join(SRC, "templates", "web-production", "site.manifest.json");

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function runInBrowserScope(window, document, code) {
  const runner = new Function("window", "document", code);
  runner(window, document);
}

function createFetch(baseDir) {
  const srcRoot = path.normalize(SRC);

  return async (url) => {
    const filePath = path.normalize(path.join(baseDir, url));

    if (!filePath.startsWith(srcRoot)) {
      throw new Error(`Fetch resolves outside src: ${url} (from ${baseDir})`);
    }

    const body = await fs.readFile(filePath, "utf8");

    return {
      ok: true,
      async text() {
        return body;
      },
      async json() {
        return JSON.parse(body);
      },
    };
  };
}

function removeScriptTags(html, scriptPaths) {
  let output = html;

  for (const scriptPath of scriptPaths) {
    for (const variant of [scriptPath, `../${scriptPath}`]) {
      const pattern = new RegExp(`<script src="${variant.replace(/\./g, "\\.")}"><\\/script>\\s*`, "g");
      output = output.replace(pattern, "");
    }
  }

  return output;
}

function applyAssetPaths(html, manifest) {
  let output = html;

  if (manifest.output.assetPathFromPages) {
    output = output.replaceAll(manifest.output.assetPathFromPages, manifest.output.assetPathTo);
  }

  output = output.replaceAll(manifest.output.assetPathFrom, manifest.output.assetPathTo);

  return output;
}

async function collectPageEntries(manifest) {
  const entries = [
    {
      sourcePath: path.join(SRC, manifest.source.index),
      outputName: "index.html",
      pageDir: SRC,
      isIndex: true,
    },
  ];

  const pagesDir = path.join(SRC, "pages");
  const files = await fs.readdir(pagesDir);

  for (const file of files.sort()) {
    if (!file.endsWith(".html")) {
      continue;
    }

    entries.push({
      sourcePath: path.join(pagesDir, file),
      outputName: file,
      pageDir: pagesDir,
      isIndex: false,
    });
  }

  return entries;
}

async function buildPage(entry, manifest, facility, loadDataJs, loadSectionsJs) {
  const html = await fs.readFile(entry.sourcePath, "utf8");
  const { document, window } = parseHTML(html);

  window.__SITE_BUILD__ = true;
  window.fetch = createFetch(entry.pageDir);

  if (!entry.isIndex) {
    window.__SRC_BASE__ = "../";
    window.__ASSET_BASE__ = "../../assets/";
  }

  if (!window.CustomEvent) {
    window.CustomEvent = class SiteCustomEvent extends Event {
      constructor(type, params = {}) {
        super(type, params);
        this.detail = params.detail;
      }
    };
  }

  runInBrowserScope(window, document, loadDataJs);
  runInBrowserScope(window, document, loadSectionsJs);
  await window.initPage();

  let output = `<!doctype html>\n${document.documentElement.outerHTML}`;
  output = removeScriptTags(output, manifest.output.removeScripts);
  output = applyAssetPaths(output, manifest);
  output = output.replaceAll("../scripts/animation.js", "scripts/animation.js");
  output = output.replaceAll("../scripts/mobile-chrome.js", "scripts/mobile-chrome.js");
  output = output.replaceAll("../scripts/luxury-reveal.js", "scripts/luxury-reveal.js");
  output = output.replaceAll("../scripts/rooms-gallery.js", "scripts/rooms-gallery.js");
  output = output.replaceAll("../scripts/cuisine-slideshow.js", "scripts/cuisine-slideshow.js");
  output = output.replaceAll("../scripts/faq-accordion.js", "scripts/faq-accordion.js");
  output = output.replaceAll("../styles/header-overlay.css", "styles/header-overlay.css");
  output = output.replaceAll("../styles/mobile-chrome.css", "styles/mobile-chrome.css");

  if (entry.isIndex) {
    const title = `${facility.brand.name} | 外浦の海まで徒歩1分`;
    output = output.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  }

  return output;
}

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    await fs.copyFile(sourcePath, destinationPath);
  }
}

async function buildSite() {
  const manifest = await readJson(MANIFEST_PATH);
  const facility = await readJson(path.join(SRC, manifest.data.facility));
  const distDir = path.join(ROOT, manifest.output.dir);
  const pageEntries = await collectPageEntries(manifest);

  const loadDataJs = await fs.readFile(path.join(SRC, "scripts/load-data.js"), "utf8");
  const loadSectionsJs = await fs.readFile(path.join(SRC, "scripts/load-sections.js"), "utf8");

  await fs.mkdir(distDir, { recursive: true });

  for (const entry of pageEntries) {
    const output = await buildPage(entry, manifest, facility, loadDataJs, loadSectionsJs);
    const outputPath = path.join(distDir, entry.outputName);
    await fs.writeFile(outputPath, output, "utf8");
    console.log(`Built ${outputPath}`);
  }

  for (const scriptPath of manifest.output.scripts) {
    const outputScriptPath = path.join(distDir, scriptPath);
    await fs.mkdir(path.dirname(outputScriptPath), { recursive: true });
    await fs.copyFile(path.join(SRC, scriptPath), outputScriptPath);
  }

  const stylesSource = path.join(SRC, "styles");
  const stylesDest = path.join(distDir, "styles");
  await copyDirectory(stylesSource, stylesDest);

  const assetsSource = path.join(ROOT, "assets");
  const assetsDest = path.join(distDir, "assets");
  try {
    await fs.access(assetsSource);
    await fs.rm(assetsDest, { recursive: true, force: true });
    await copyDirectory(assetsSource, assetsDest);
  } catch {
    // Optional until image assets are added at project root.
  }

  // GitHub Pages: do not run Jekyll on the uploaded site.
  await fs.writeFile(path.join(distDir, ".nojekyll"), "", "utf8");
}

buildSite().catch((error) => {
  console.error(error);
  process.exit(1);
});
