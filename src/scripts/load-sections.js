const COMPONENT_MAP = {
  button: "components/button.html",
  "button-primary": "components/button.html",
  "button-outline": "components/button.html",
  "phone-display": "components/phone-display.html",
  "section-heading": "components/section-heading.html",
  "image-text-section": "patterns/image-text-section.html",
  "nav-link": "components/nav-link-header.html",
  "nav-link-header": "components/nav-link-header.html",
  "nav-link-footer": "components/nav-link-footer.html",
  "news-card": "components/news-card.html",
  "faq-card": "components/faq-card.html",
};

const COMPONENT_ALIASES = {
  "button-primary": { variant: "primary" },
  "button-outline": { variant: "outline" },
};

const BUTTON_VARIANTS = {
  primary: {
    classes:
      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[{{PADDING}}] justify-start items-center bg-[#BFA170] rounded-[2px] text-[14px]/[normal] text-[#2E3334] font-['{{LABEL_FONT}}',system-ui,sans-serif] font-normal text-left [white-space:nowrap] no-underline",
  },
  outline: {
    classes:
      "box-border w-fit h-fit shrink-0 flex flex-row gap-0 p-[{{PADDING}}] justify-start items-center [border:1px_solid_#4A5D5B] rounded-[2px] text-[14px]/[normal] text-[#4A5D5B] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap] no-underline",
  },
  "ghost-hero": {
    classes:
      "box-border w-fit max-w-full shrink-0 h-fit flex flex-row gap-0 p-[14px_28px] justify-start items-center bg-[#FFFFFF22] [border:1px_solid_#FFFFFF99] rounded-[2px] text-[14px]/[normal] text-[#FFFFFF] font-['Shippori_Antique_B1',system-ui,sans-serif] font-normal text-left md:[white-space:nowrap] no-underline",
  },
  "cta-dark": {
    classes:
      "box-border w-fit shrink-0 h-fit flex flex-row gap-0 p-[12px_22px] justify-start items-center bg-[#4A5D5B] rounded-[2px] text-[14px]/[normal] text-[#F0F4F3] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap] no-underline",
  },
  "header-cta": {
    classes:
      "box-border order-2 md:order-3 ml-auto lg:ml-0 w-fit shrink-0 h-fit flex flex-row gap-0 py-[10px] px-[18px] md:px-4 lg:px-[18px] justify-start items-center bg-[#4A5D5B] rounded-[2px] text-[14px]/[normal] md:text-[13px] lg:text-[14px] text-[#F0F4F3] font-['Shippori_Antique_B1',system-ui,sans-serif] font-normal text-left md:[white-space:nowrap] no-underline",
  },
};

const PHONE_DISPLAY_VARIANTS = {
  "display-large": {
    classes:
      "text-[22px]/[normal] md:text-[28px]/[normal] box-border text-[#BFA170] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-center md:text-left md:[white-space:nowrap] no-underline",
  },
  "display-footer": {
    classes:
      "text-[16px]/[normal] box-border text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left md:[white-space:nowrap] no-underline",
  },
};

const SECTION_HEADING_VARIANTS = {
  "centered-en-ja": {
    wrapperClass:
      "box-border w-fit h-fit shrink-0 flex flex-col gap-[12px] justify-start items-center",
    enClass:
      "text-[20px]/[normal] box-border text-[#4A5D5B] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-left md:[white-space:nowrap]",
    jaClass:
      "text-[36px]/[normal] box-border text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left md:[white-space:nowrap]",
    includeEn: true,
    wrapper: true,
  },
  "inline-en-ja": {
    enClass:
      "text-[20px]/[normal] box-border text-[#4A5D5B] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-left md:[white-space:nowrap]",
    jaClass:
      "text-[36px]/[normal] box-border text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left md:[white-space:nowrap]",
    includeEn: true,
    wrapper: false,
  },
  "centered-ja-only": {
    wrapperClass:
      "box-border w-full max-w-[640px] md:w-[640px] h-fit shrink-0 flex flex-col gap-[12px] justify-start items-center relative [z-index:1]",
    jaClass:
      "text-[32px]/[46px] box-border w-full text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-center",
    includeEn: false,
    wrapper: true,
  },
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

function resolveButtonClasses(name, vars) {
  const alias = COMPONENT_ALIASES[name];
  const variant = vars.VARIANT || alias?.variant;
  const preset = BUTTON_VARIANTS[variant];
  if (!preset) {
    throw new Error(`Unknown button variant: ${variant}`);
  }
  return applyTemplate(preset.classes, vars);
}

function resolvePhoneDisplayClasses(vars) {
  const preset = PHONE_DISPLAY_VARIANTS[vars.VARIANT];
  if (!preset) {
    throw new Error(`Unknown phone-display variant: ${vars.VARIANT}`);
  }
  return preset.classes;
}

function buildSectionHeadingHtml(vars) {
  const preset = SECTION_HEADING_VARIANTS[vars.VARIANT];
  if (!preset) {
    throw new Error(`Unknown section-heading variant: ${vars.VARIANT}`);
  }

  const enBlock =
    preset.includeEn && vars.LABEL_EN
      ? `<div data-pencil-name="${vars.EN_PENCIL_NAME}" class="${preset.enClass}">${vars.LABEL_EN}</div>`
      : "";

  const jaContent = vars.LABEL_JA_LINE2
    ? `${vars.LABEL_JA}<br />${vars.LABEL_JA_LINE2}`
    : vars.LABEL_JA;
  const jaBlock = `<div data-pencil-name="${vars.JA_PENCIL_NAME}" class="${preset.jaClass}">${jaContent}</div>`;

  if (!preset.wrapper) {
    return `${enBlock}${jaBlock}`;
  }

  return `<div data-pencil-name="${vars.HEAD_PENCIL_NAME}" class="${preset.wrapperClass}">${enBlock}${jaBlock}</div>`;
}

function getSlotContent(element, slotName) {
  const template = element.querySelector(`template[data-slot="${slotName}"]`);
  return template ? template.innerHTML.trim() : "";
}

function buildIntroSection(vars, slots) {
  return `<section
        id="${vars.ID}"
        data-animate="reveal"
        data-pencil-name="${vars.PENCIL_NAME}"
        class="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-8 lg:gap-[64px] px-5 py-16 lg:px-0 lg:py-[100px] lg:pl-[120px] justify-start items-center bg-[#F0F4F3] relative"
      >
        <div
          data-pencil-name="Intro Text"
          class="box-border [flex:1_1_0] h-fit flex flex-col gap-[24px] justify-start items-start relative [z-index:0]"
        >
          <div
            data-pencil-name="Intro Heading"
            class="text-[36px]/[54px] box-border w-full text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left"
          >
            ${slots.heading}
          </div>
          <div
            data-pencil-name="Intro Body"
            class="text-[16px]/[32px] box-border w-full text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
          >
            ${slots.body}
          </div>
        </div>
        <div
          data-pencil-name="Intro Label"
          data-animate="label"
          class="text-[230px]/[normal] box-border absolute left-[-9px] top-[22px] text-[#4a5d5b1a] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-left [white-space:nowrap] [z-index:1] hidden lg:block"
        >
          ${vars.LABEL_TEXT}
        </div>
        <img
          data-pencil-name="Intro Image"
          src="${vars.IMAGE_SRC}"
          alt="${vars.IMAGE_ALT}"
          class="box-border w-full max-w-[720px] lg:w-[720px] shrink-0 h-[440px] relative [z-index:2] object-cover"
        />
      </section>`;
}

function buildHostSection(vars, slots) {
  return `<section
        id="${vars.ID}"
        data-animate="reveal"
        data-pencil-name="${vars.PENCIL_NAME}"
        class="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-8 lg:gap-[40px] px-5 py-16 lg:px-0 lg:py-[88px] lg:pr-[80px] justify-start items-center bg-[#4A5D5B] relative"
      >
        <div
          data-pencil-name="Host Photos"
          class="box-border w-full max-w-[720px] lg:w-[720px] shrink-0 h-fit flex flex-col gap-[16px] justify-start items-start relative [z-index:0]"
        >
          <div
            data-pencil-name="Host Main Photo"
            class="box-border w-full max-w-[720px] lg:w-[720px] h-[465px] shrink-0 relative overflow-hidden"
          >
            <img
              src="${vars.IMAGE_SRC}"
              alt="${vars.IMAGE_ALT}"
              class="box-border w-full h-full object-cover"
            />
            <div
              class="box-border absolute inset-0 bg-[#7a7a7a33]"
              aria-hidden="true"
            ></div>
          </div>
        </div>
        <div
          data-pencil-name="Host Text"
          class="box-border [flex:1_1_0] h-fit flex flex-col gap-[16px] justify-start items-start relative [z-index:1]"
        >
          <div
            data-pencil-name="Host Heading"
            class="text-[32px]/[46px] box-border w-full text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left"
          >
            ${slots.heading}
          </div>
          <div
            data-pencil-name="Host Quote"
            class="text-[16px]/[30px] box-border w-full text-[#D1C7BD] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
          >
            ${slots.quote}
          </div>
          <div
            data-pencil-name="Host Role"
            class="text-[14px]/[normal] box-border text-[#BFA170] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
          >
            ${vars.ROLE_TEXT}
          </div>
          <div
            data-pencil-name="Host Help List"
            class="box-border w-full h-fit shrink-0 flex flex-col gap-[10px] p-[8px_0px_0px_0px] justify-start items-start"
          >
            ${slots.helpList}
          </div>
          <div data-component="button" data-variant="primary" data-pencil-name="Host Phone CTA" data-padding="14px_24px" data-label-font="Shippori_Mincho" data-label="お電話でご相談 0558-36-4500" data-href="tel:0558-36-4500"></div>
        </div>
        <div
          data-pencil-name="Host En"
          data-animate="label"
          class="text-[230px]/[normal] box-border absolute left-[769px] top-[30px] text-[#bfa1701a] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-center [white-space:nowrap] [z-index:2] hidden lg:block"
        >
          ${vars.LABEL_TEXT}
        </div>
      </section>`;
}

function buildCuisineSection(vars, slots) {
  return `<section
        id="${vars.ID}"
        data-animate="reveal"
        data-pencil-name="${vars.PENCIL_NAME}"
        class="box-border w-full h-fit shrink-0 flex flex-col-reverse lg:flex-row gap-8 lg:gap-[56px] px-5 py-16 lg:px-0 lg:py-[96px] lg:pl-[80px] justify-end items-center bg-[#FFFFFF] relative"
      >
        <div
          data-pencil-name="Cuisine Text"
          class="box-border w-full max-w-[520px] lg:w-[520px] shrink-0 h-fit flex flex-col gap-[22px] justify-start items-start relative [z-index:0]"
        >
          <div
            data-pencil-name="Cuisine Heading"
            class="text-[32px]/[46px] box-border w-full text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left"
          >
            ${slots.heading}
          </div>
          <div
            data-pencil-name="Cuisine Body"
            class="text-[16px]/[32px] box-border w-full text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
          >
            ${slots.body}
          </div>
          <div data-component="button" data-variant="outline" data-pencil-name="Cuisine CTA" data-padding="12px_24px" data-label="お料理を見る" data-href="#cuisine"></div>
        </div>
        <div
          data-pencil-name="Cuisine En"
          data-animate="label"
          class="text-[230px]/[normal] box-border absolute left-[107px] top-[203px] text-[#4a5d5b14] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-center [white-space:nowrap] [z-index:1] hidden lg:block"
        >
          ${vars.LABEL_TEXT}
        </div>
        <img
          data-pencil-name="Cuisine Hero Img"
          src="${vars.IMAGE_SRC}"
          alt="${vars.IMAGE_ALT}"
          class="box-border w-full max-w-[720px] lg:w-[720px] shrink-0 h-[480px] relative [z-index:2] object-cover"
        />
      </section>`;
}

function buildAccessSection(vars, slots) {
  return `<section
        id="${vars.ID}"
        data-animate="reveal"
        data-pencil-name="${vars.PENCIL_NAME}"
        class="box-border w-full h-fit shrink-0 flex flex-col lg:flex-row gap-8 lg:gap-[48px] px-5 py-16 lg:px-[80px] lg:py-[88px] justify-start items-start lg:items-center bg-[#FFFFFF]"
      >
        <img
          data-pencil-name="Access Map"
          src="${vars.IMAGE_SRC}"
          alt="${vars.IMAGE_ALT}"
          class="box-border w-full max-w-[560px] lg:w-[560px] shrink-0 h-[420px] object-cover"
        />
        <div
          data-pencil-name="Access Text"
          class="box-border [flex:1_1_0] h-fit flex flex-col gap-[18px] justify-start items-start"
        >
          <div
            data-component="section-heading"
            data-variant="inline-en-ja"
            data-en-pencil-name="Access En"
            data-ja-pencil-name="Access Heading"
            data-label-en="Access"
            data-label-ja="アクセス"
          ></div>
          <div
            data-pencil-name="Access Addr"
            class="text-[14px]/[normal] box-border text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left md:[white-space:nowrap]"
          >
            ${vars.ADDR_TEXT}
          </div>
          ${slots.accessLines}
          <div data-component="button" data-variant="outline" data-pencil-name="Access CTA" data-padding="12px_22px" data-label="詳しいアクセス" data-href="#access"></div>
        </div>
      </section>`;
}

function buildImageTextSectionHtml(element, vars) {
  const slots = {
    heading: getSlotContent(element, "heading"),
    body: getSlotContent(element, "body"),
    quote: getSlotContent(element, "quote"),
    helpList: getSlotContent(element, "help-list"),
    accessLines: getSlotContent(element, "access-lines"),
  };

  switch (vars.VARIANT) {
    case "intro":
      return buildIntroSection(vars, slots);
    case "host":
      return buildHostSection(vars, slots);
    case "cuisine":
      return buildCuisineSection(vars, slots);
    case "access":
      return buildAccessSection(vars, slots);
    default:
      throw new Error(`Unknown image-text-section variant: ${vars.VARIANT}`);
  }
}

function buildFeatureCardHtml(element, vars) {
  const heading = getSlotContent(element, "heading");
  const body = getSlotContent(element, "body");

  return `<div
          id="${vars.ID}"
          data-pencil-name="${vars.BLOCK_PENCIL_NAME}"
          class="box-border [flex:1_1_0] h-fit flex flex-col gap-[18px] justify-start items-start"
        >
          <img
            data-pencil-name="${vars.IMG_PENCIL_NAME}"
            src="${vars.IMAGE_SRC}"
            alt="${vars.IMAGE_ALT}"
            class="box-border w-full h-[468px] shrink-0 object-cover"
          />
          <div
            data-pencil-name="${vars.TITLE_PENCIL_NAME}"
            class="text-[22px]/[normal] box-border text-[#2E3334] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-left [white-space:nowrap]"
          >
            ${heading}
          </div>
          <div
            data-pencil-name="${vars.BODY_PENCIL_NAME}"
            class="text-[14px]/[27px] box-border w-full text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
          >
            ${body}
          </div>
          <div data-component="button" data-variant="outline" data-pencil-name="${vars.CTA_PENCIL_NAME}" data-padding="${vars.CTA_PADDING}" data-label="${vars.CTA_LABEL}" data-href="${vars.CTA_HREF}"></div>
        </div>`;
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

  const vars = getTemplateVars(element);

  if (name === "section-heading") {
    element.outerHTML = buildSectionHeadingHtml(vars);
    return;
  }

  if (name === "image-text-section") {
    element.outerHTML = buildImageTextSectionHtml(element, vars);
    return;
  }

  const template = await fetchText(src);

  if (name === "button" || name === "button-primary" || name === "button-outline") {
    vars.CLASSES = resolveButtonClasses(name, vars);
    element.outerHTML = applyTemplate(template, vars);
    return;
  }

  if (name === "phone-display") {
    vars.CLASSES = resolvePhoneDisplayClasses(vars);
    vars.HREF = vars.HREF || `tel:${vars.NUMBER}`;
    vars.DISPLAY = vars.DISPLAY || vars.NUMBER;
    element.outerHTML = applyTemplate(template, vars);
    return;
  }

  element.outerHTML = applyTemplate(template, vars);
}

async function loadPattern(element) {
  const name = element.getAttribute("data-pattern");
  const vars = getTemplateVars(element);

  if (name === "feature-card") {
    element.outerHTML = buildFeatureCardHtml(element, vars);
    return;
  }

  throw new Error(`Unknown pattern: ${name}`);
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

async function loadPatterns() {
  let patterns = document.querySelectorAll("[data-pattern]");
  while (patterns.length > 0) {
    await Promise.all(Array.from(patterns).map((element) => loadPattern(element)));
    patterns = document.querySelectorAll("[data-pattern]");
  }
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
  await loadPatterns();
  await loadComponents();
  document.dispatchEvent(new CustomEvent("page:ready"));
}

initPage();
