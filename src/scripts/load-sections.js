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
  "nav-group": "components/nav-group.html",
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
  if (!template) {
    return "";
  }

  if (template.content?.childNodes.length) {
    return Array.from(template.content.childNodes)
      .map((node) => node.outerHTML || node.textContent || "")
      .join("")
      .trim();
  }

  return template.innerHTML.trim();
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

function buildCuisineSection(vars, slots, element) {
  const button = element ? getSlotContent(element, "button") : "";
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
          ${button}
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
          <div data-component="button" data-variant="outline" data-pencil-name="Access CTA" data-padding="12px_22px" data-label="詳しいアクセス" data-href="${window.resolvePageHref("access.html")}"></div>
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
      return buildCuisineSection(vars, slots, element);
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

function buildNavGroupHtml(element, vars) {
  const variant = vars.VARIANT || "header";
  const items = JSON.parse(vars.ITEMS || "[]");

  return items
    .map((item) => {
      if (variant === "footer") {
        return `<div data-component="nav-link-footer" data-label="${item.label}" data-href="${item.href}"></div>`;
      }

      return `<div data-component="nav-link" data-pencil-name="Nav ${item.label}" data-label="${item.label}" data-href="${item.href}"></div>`;
    })
    .join("\n          ");
}

function buildHeaderHtml(element, vars) {
  const navItems = getSlotContent(element, "nav-items");

  return `<header
        data-pencil-name="Header"
        class="box-border w-full shrink-0 flex flex-wrap md:flex-nowrap md:flex-row md:h-[72px] gap-3 md:gap-0 p-4 md:p-[0px_56px] md:justify-between md:items-center bg-[#F0F4F3]"
      >
        <a
          href="${vars.HOME_HREF || "/"}"
          data-pencil-name="Logo"
          aria-label="${vars.LOGO_ARIA_LABEL}"
          class="box-border order-1 w-[181px] max-w-[50%] md:max-w-none shrink-0 h-fit flex flex-row gap-[10px] justify-start items-center no-underline"
        >
          <img
            data-pencil-name="Logo Mark"
            src="${vars.LOGO_SRC}"
            alt="${vars.LOGO_ALT}"
            class="box-border [flex:1_1_0] h-[57px] w-full object-contain"
          />
        </a>
        <div
          data-component="button"
          data-variant="header-cta"
          data-pencil-name="Header CTA"
          data-href="${vars.CTA_HREF}"
          data-label="${vars.CTA_LABEL}"
        ></div>
        <nav
          data-pencil-name="Nav Links"
          aria-label="メインナビゲーション"
          class="box-border order-3 md:order-2 w-full md:w-fit shrink-0 h-fit basis-full md:basis-auto flex flex-row flex-wrap md:flex-nowrap gap-x-5 gap-y-2 md:gap-[28px] justify-start items-center"
        >
          ${navItems}
        </nav>
      </header>`;
}

function buildFooterHtml(element, vars) {
  const navItems = getSlotContent(element, "nav-items");

  return `<footer
        data-pencil-name="Footer"
        class="box-border w-full h-fit shrink-0 flex flex-col gap-[28px] px-5 pt-14 pb-8 md:px-[80px] md:pt-[56px] md:pb-[32px] justify-start items-start bg-[#4A5D5B]"
      >
        <div
          data-pencil-name="Footer Main"
          class="box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-8 md:gap-[48px] justify-between items-start"
        >
          <div
            data-pencil-name="Footer Brand"
            class="box-border w-fit shrink-0 h-fit flex flex-col gap-[6px] justify-start items-start"
          >
            <a
              href="${vars.HOME_HREF || "/"}"
              data-pencil-name="Footer Logo"
              aria-label="${vars.LOGO_ARIA_LABEL || vars.LOGO_ALT}"
              class="box-border w-fit shrink-0 h-fit no-underline"
            >
              <img
                data-pencil-name="Footer Logo Img"
                src="${vars.LOGO_SRC}"
                alt="${vars.LOGO_ALT}"
                class="box-border w-[136px] h-[61px] shrink-0 object-contain"
              />
            </a>
          </div>
          <div
            data-pencil-name="Footer Info"
            class="box-border w-full md:w-fit shrink-0 h-fit flex flex-col gap-[14px] justify-start items-start md:items-end"
          >
            <address
              data-pencil-name="Info Addr"
              class="text-[12px]/[normal] box-border text-[#D1C7BD] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left md:text-right md:[white-space:nowrap] not-italic"
            >
              ${vars.ADDRESS_TEXT}
            </address>
            <nav
              data-pencil-name="Info Nav"
              aria-label="フッターナビゲーション"
              class="box-border w-full md:w-fit h-fit shrink-0 flex flex-row flex-wrap md:flex-nowrap gap-x-5 gap-y-2 md:gap-[20px] justify-start md:justify-start items-center"
            >
              ${navItems}
            </nav>
            <div
              data-pencil-name="Info Contact"
              class="box-border w-full md:w-fit h-fit shrink-0 flex flex-col sm:flex-row flex-wrap gap-2 md:gap-[10px] justify-start items-start sm:items-center"
            >
              <div
                data-component="phone-display"
                data-variant="display-footer"
                data-number="${vars.PHONE_NUMBER}"
              ></div>
              <span
                class="text-[13px]/[normal] box-border text-[#929E9D] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap] hidden sm:inline"
              >
                ・
              </span>
              <a
                href="${vars.BOOKING_HREF}"
                class="text-[13px]/[normal] box-border text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left md:[white-space:nowrap] no-underline"
              >
                ${vars.BOOKING_LABEL}
              </a>
            </div>
          </div>
        </div>
        <div
          data-pencil-name="Footer Rule"
          class="box-border w-full h-[1px] shrink-0 bg-[#6A7A79]"
          aria-hidden="true"
        ></div>
        <div
          data-pencil-name="Footer Bottom"
          class="box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-start md:items-center"
        >
          <small
            data-pencil-name="Copyright"
            class="text-[11px]/[normal] box-border text-[#AEB6B5] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left md:[white-space:nowrap]"
          >
            ${vars.COPYRIGHT_TEXT}
          </small>
          <div
            data-pencil-name="Footer Locale"
            class="text-[12px]/[normal] box-border text-[#AEB6B5] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[1px] text-left md:[white-space:nowrap]"
          >
            ${vars.LOCALE_TEXT}
          </div>
        </div>
      </footer>`;
}

function buildFullBleedBannerHtml(element, vars) {
  switch (vars.VARIANT) {
    case "bridge":
      return buildBridgeBannerHtml(element, vars);
    case "final-cta":
      return buildFinalCtaBannerHtml(element, vars);
    default:
      throw new Error(`Unknown full-bleed-banner variant: ${vars.VARIANT}`);
  }
}

function buildBridgeBannerHtml(element, vars) {
  const labelEn = getSlotContent(element, "label-en");
  const labelJa = getSlotContent(element, "label-ja");

  return `<div
        data-pencil-name="${vars.PENCIL_NAME}"
        class="box-border w-full min-h-[400px] md:h-[560px] shrink-0 overflow-hidden relative"
        style="background-image: url('${vars.BG_IMAGE}'); background-position: center; background-repeat: no-repeat; background-size: cover"
      >
        <div
          data-pencil-name="Bridge Overlay"
          class="box-border absolute inset-0 w-full h-full [background-image:linear-gradient(180deg,_#1A242266_0%,_#1A242288_55%,_#1A2422AA_100%)] bg-no-repeat bg-[length:100%_100%] [z-index:0]"
        ></div>
        <div
          data-pencil-name="Bridge Content"
          class="box-border w-full max-w-[640px] md:w-[640px] h-fit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[200px] md:translate-y-0 px-5 md:px-0 flex flex-col gap-[14px] justify-start items-center [z-index:1]"
        >
          <div
            data-pencil-name="Bridge En"
            class="text-[20px]/[normal] box-border text-[#BFA170] font-['Cormorant_Garamond',system-ui,sans-serif] font-normal italic tracking-[2px] text-center md:text-left md:[white-space:nowrap]"
          >
            ${labelEn}
          </div>
          <div
            data-pencil-name="Bridge Ja"
            class="text-[36px]/[normal] box-border text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-center md:text-left md:[white-space:nowrap]"
          >
            ${labelJa}
          </div>
        </div>
      </div>`;
}

function buildFinalCtaBannerHtml(element, vars) {
  const heading = getSlotContent(element, "heading");
  const body = getSlotContent(element, "body");
  const actions = getSlotContent(element, "actions");

  return `<section
        data-animate="reveal"
        data-pencil-name="${vars.PENCIL_NAME}"
        class="box-border w-full min-h-[520px] md:h-[573px] shrink-0 overflow-hidden relative"
        style="background-image: url('${vars.BG_IMAGE}'); background-position: center; background-repeat: no-repeat; background-size: cover"
      >
        <div
          data-pencil-name="Final Overlay"
          class="box-border absolute inset-0 w-full h-full bg-[#1a242299] [z-index:0]"
        ></div>
        <div
          data-pencil-name="Final Content"
          class="box-border w-full max-w-[1000px] lg:w-[1000px] h-fit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-[180.5px] lg:translate-y-0 px-5 lg:px-0 flex flex-col gap-[20px] justify-center items-center [z-index:1]"
        >
          <div
            data-pencil-name="Final Heading"
            class="text-[28px]/[normal] md:text-[36px]/[normal] box-border text-[#FFFFFF] font-['Shippori_Mincho',system-ui,sans-serif] font-medium text-center md:text-left md:[white-space:nowrap]"
          >
            ${heading}
          </div>
          <div
            data-pencil-name="Final Body"
            class="text-[16px]/[30px] box-border w-full text-[#D1C7BD] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-center"
          >
            ${body}
          </div>
          <div
            data-pencil-name="Final Actions"
            class="box-border w-full md:w-fit h-fit shrink-0 flex flex-col sm:flex-row flex-wrap gap-4 md:gap-[20px] p-[12px_0px_0px_0px] justify-center md:justify-start items-center"
          >
            ${actions}
          </div>
        </div>
      </section>`;
}

function resolveFetchPath(src) {
  if (src.startsWith("http") || src.startsWith("../")) {
    return src;
  }

  const base = window.__SRC_BASE__ || "";
  return `${base}${src}`;
}

async function fetchText(src) {
  const response = await fetch(resolveFetchPath(src));
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

  if (name === "nav-group") {
    element.outerHTML = buildNavGroupHtml(element, vars);
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

  if (name === "header") {
    element.outerHTML = buildHeaderHtml(element, vars);
    return;
  }

  if (name === "footer") {
    element.outerHTML = buildFooterHtml(element, vars);
    return;
  }

  if (name === "full-bleed-banner") {
    element.outerHTML = buildFullBleedBannerHtml(element, vars);
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

  const facility = await window.loadFacilityData();
  window.applyFacilityData(facility);

  const content = await window.loadContentData();
  window.applyContentData(content);

  await loadPatterns();
  window.applyPhoneDisplayData(facility);

  await loadComponents();
  window.applyPageCtaLinks(facility);

  if (!window.__SITE_BUILD__) {
    document.dispatchEvent(new CustomEvent("page:ready"));
  }
}

window.initPage = initPage;

if (!window.__SITE_BUILD__) {
  initPage();
}
