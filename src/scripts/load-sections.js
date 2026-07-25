const COMPONENT_MAP = {
  "button-outline": "components/button-outline.html",
  "button-primary": "components/button-primary.html",
  "nav-link": "components/nav-link-header.html",
  "nav-link-header": "components/nav-link-header.html",
  "nav-link-footer": "components/nav-link-footer.html",
  "news-card": "components/news-card.html",
  "faq-card": "components/faq-card.html",
};

function getTemplateVars(element) {
  const vars = {};
  for (const attr of element.attributes) {
    if (!attr.name.startsWith("data-") || attr.name === "data-component") {
      continue;
    }
    const key = attr.name.slice(5).replace(/-/g, "_").toUpperCase();
    vars[key] = attr.value;
  }
  return vars;
}

function applyTemplate(template, vars) {
  let html = template;
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

async function fetchText(src) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Failed to load: ${src}`);
  }
  return response.text();
}

async function loadComponent(element) {
  const name = element.getAttribute("data-component");
  const src = COMPONENT_MAP[name];
  if (!src) {
    throw new Error(`Unknown component: ${name}`);
  }
  const template = await fetchText(src);
  element.outerHTML = applyTemplate(template, getTemplateVars(element));
}

async function loadSections() {
  const placeholders = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(placeholders).map(async (placeholder) => {
      const src = placeholder.getAttribute("data-include");
      placeholder.outerHTML = await fetchText(src);
    })
  );
}

async function loadComponents() {
  let components = document.querySelectorAll("[data-component]");
  while (components.length > 0) {
    await Promise.all(Array.from(components).map((element) => loadComponent(element)));
    components = document.querySelectorAll("[data-component]");
  }
}

async function initPage() {
  await loadSections();
  await loadComponents();
}

initPage();
