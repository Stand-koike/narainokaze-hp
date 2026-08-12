let facilityCache = null;
let contentCache = null;

function resolveAssetPath(path) {
  if (!path || !window.__ASSET_BASE__) {
    return path;
  }

  if (path.startsWith("../assets/")) {
    return `${window.__ASSET_BASE__}${path.slice("../assets/".length)}`;
  }

  return path;
}

function resolvePageHref(href) {
  if (!href || href.startsWith("#") || href.startsWith("tel:") || /^https?:\/\//.test(href)) {
    return href;
  }

  const pageFile = href.replace(/^pages\//, "");

  if (window.__SITE_BUILD__) {
    return pageFile;
  }

  if (window.__SRC_BASE__) {
    return pageFile;
  }

  return `pages/${pageFile}`;
}

function wrapElementWithLink(element, href) {
  if (!element || element.tagName === "A") {
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.className = `${element.className} no-underline`.trim();

  for (const attr of element.attributes) {
    if (attr.name === "class") {
      continue;
    }
    anchor.setAttribute(attr.name, attr.value);
  }

  anchor.innerHTML = element.innerHTML;
  element.replaceWith(anchor);
}

function applyPageCtaLinks(facility) {
  document.querySelectorAll('[data-pencil-name="CTA Tel"]').forEach((element) => {
    wrapElementWithLink(element, facility.contact.phone.tel);
  });

  document.querySelectorAll('[data-pencil-name="CTA Book"]').forEach((element) => {
    wrapElementWithLink(element, facility.booking.href);
  });
}

async function loadFacilityData() {
  if (facilityCache) {
    return facilityCache;
  }

  const srcBase = window.__SRC_BASE__ || "";
  const response = await fetch(`${srcBase}data/facility.json`);
  if (!response.ok) {
    throw new Error("Failed to load: data/facility.json");
  }

  facilityCache = await response.json();
  return facilityCache;
}

function applyHeaderData(facility) {
  const header = document.querySelector('[data-pattern="header"]');
  if (!header) {
    return;
  }

  header.dataset.homeHref =
    window.__HOME_HREF__ ||
    (window.__SITE_BUILD__ && window.__SRC_BASE__
      ? "index.html"
      : window.__SRC_BASE__
        ? `${window.__SRC_BASE__}index.html`
        : facility.brand.homeHref);
  header.dataset.logoSrc = resolveAssetPath(facility.brand.logoSrc);
  header.dataset.logoAlt = facility.brand.name;
  header.dataset.logoAriaLabel = facility.brand.logoAriaLabel;
  header.dataset.ctaHref = facility.contact.phone.tel;
  header.dataset.ctaLabel = facility.header.ctaLabel;
}

function applyFooterData(facility) {
  const footer = document.querySelector('[data-pattern="footer"]');
  if (!footer) {
    return;
  }

  footer.dataset.homeHref =
    window.__HOME_HREF__ ||
    (window.__SITE_BUILD__ && window.__SRC_BASE__
      ? "index.html"
      : window.__SRC_BASE__
        ? `${window.__SRC_BASE__}index.html`
        : facility.brand.homeHref);
  footer.dataset.logoSrc = resolveAssetPath(facility.brand.logoSrc);
  footer.dataset.logoAlt = facility.brand.name;
  footer.dataset.logoAriaLabel = facility.brand.logoAriaLabel;
  footer.dataset.addressText = facility.contact.address;
  footer.dataset.phoneNumber = facility.contact.phone.display;
  footer.dataset.bookingHref = facility.booking.href;
  footer.dataset.bookingLabel = facility.booking.label;
  footer.dataset.copyrightText = facility.footer.copyright;
}

function applyPhoneDisplayData(facility) {
  document.querySelectorAll('[data-component="phone-display"]').forEach((element) => {
    element.dataset.number = facility.contact.phone.display;
  });
}

function joinHeroLines(lines) {
  return lines.join("<br />");
}

function applyHeroData(facility) {
  const hero = document.querySelector('[data-facility-bind="hero"]');
  if (!hero || !facility.hero) {
    return;
  }

  const heroData = facility.hero;

  const heroStage =
    hero.querySelector('[data-pencil-name="Hero Fade Stage"]') ||
    hero.querySelector('[data-fade-stage]') ||
    hero;
  const heroSlide2 = hero.querySelector('[data-pencil-name="Slide 2"]');

  if (heroData.bgImage) {
    heroStage.style.backgroundImage = `url('${resolveAssetPath(heroData.bgImage)}')`;
    heroStage.style.backgroundPosition = "center";
    heroStage.style.backgroundRepeat = "no-repeat";
    heroStage.style.backgroundSize = "cover";
  }

  if (heroSlide2 && heroData.bgImageSlide2) {
    heroSlide2.style.backgroundImage = `url('${resolveAssetPath(heroData.bgImageSlide2)}')`;
  } else if (!hero.querySelector('[data-fade-stage]') && heroData.bgImage) {
    hero.style.backgroundImage = `url('${resolveAssetPath(heroData.bgImage)}')`;
    hero.style.backgroundPosition = "center";
    hero.style.backgroundRepeat = "no-repeat";
    hero.style.backgroundSize = "cover";
  }

  const subtitle = hero.querySelector('[data-pencil-name="Hero Sub"]');
  if (subtitle) {
    subtitle.innerHTML = joinHeroLines(heroData.subtitleLines);
  }

  const catchCopy = hero.querySelector('[data-pencil-name="Hero Catch"]');
  if (catchCopy) {
    catchCopy.innerHTML = joinHeroLines(heroData.catchLines);
  }

  const bookButton = hero.querySelector('[data-pencil-name="Book Button"]');
  if (bookButton) {
    bookButton.dataset.label = heroData.bookingLabel;
    bookButton.dataset.href = heroData.bookingHref;
  }

  const phoneButton = hero.querySelector('[data-pencil-name="Phone Button"]');
  if (phoneButton) {
    phoneButton.dataset.href = facility.contact.phone.tel;
    phoneButton.dataset.label = `${heroData.phoneLabelPrefix} ${facility.contact.phone.display}`;
  }
}

function applyMobileChromeData(facility) {
  if (!facility?.contact?.phone || !facility?.booking) {
    return;
  }

  document.body.dataset.phoneTel = facility.contact.phone.tel;
  document.body.dataset.bookingHref = facility.booking.href;
  document.body.dataset.bookingLabel = facility.booking.label || "空室確認・予約";

  if (typeof window.applyMobileChromeFromFacility === "function") {
    window.applyMobileChromeFromFacility(facility);
  }
}

function applyFacilityData(facility) {
  window.__FACILITY_DATA__ = facility;
  applyHeaderData(facility);
  applyFooterData(facility);
  applyHeroData(facility);
  applyPhoneDisplayData(facility);
  applyMobileChromeData(facility);
}

async function loadContentData() {
  if (contentCache) {
    return contentCache;
  }

  const srcBase = window.__SRC_BASE__ || "";
  const response = await fetch(`${srcBase}data/content.json`);
  if (!response.ok) {
    throw new Error("Failed to load: data/content.json");
  }

  contentCache = await response.json();
  return contentCache;
}

function applyIntroData(content) {
  const intro = document.querySelector('[data-content-bind="intro"]');
  if (!intro || !content.intro) {
    return;
  }

  const introData = content.intro;

  intro.dataset.id = introData.id;
  intro.dataset.pencilName = introData.pencilName;
  intro.dataset.imageSrc = introData.imageSrc;
  intro.dataset.imageAlt = introData.imageAlt;
  intro.dataset.labelText = introData.labelText;

  const headingSlot = intro.querySelector('template[data-slot="heading"]');
  if (headingSlot) {
    headingSlot.innerHTML = introData.heading;
  }

  const bodySlot = intro.querySelector('template[data-slot="body"]');
  if (bodySlot) {
    bodySlot.innerHTML = introData.bodyHtml;
  }
}

function buildHostHelpListHtml(items) {
  return items
    .map(
      (text) => `<div
              data-pencil-name="Help ${text}"
              class="box-border w-full h-fit shrink-0 flex flex-row gap-[12px] justify-start items-center"
            >
              <div
                data-pencil-name="Help Dot"
                class="box-border w-[6px] shrink-0 h-[6px] bg-[#BFA170] rounded-full"
              ></div>
              <div
                data-pencil-name="Help Text"
                class="text-[14px]/[normal] box-border text-[#E8EEEA] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left [white-space:nowrap]"
              >
                ${text}
              </div>
            </div>`
    )
    .join("\n            ");
}

function applyHostData(content) {
  const host = document.querySelector('[data-content-bind="host"]');
  if (!host || !content.host) {
    return;
  }

  const hostData = content.host;

  host.dataset.id = hostData.id;
  host.dataset.pencilName = hostData.pencilName;
  host.dataset.imageSrc = hostData.imageSrc;
  host.dataset.imageAlt = hostData.imageAlt;
  host.dataset.labelText = hostData.labelText;
  host.dataset.roleText = hostData.roleText;

  const headingSlot = host.querySelector('template[data-slot="heading"]');
  if (headingSlot) {
    headingSlot.innerHTML = hostData.headingHtml;
  }

  const quoteSlot = host.querySelector('template[data-slot="quote"]');
  if (quoteSlot) {
    quoteSlot.innerHTML = hostData.quote;
  }

  const helpListSlot = host.querySelector('template[data-slot="help-list"]');
  if (helpListSlot) {
    helpListSlot.innerHTML = buildHostHelpListHtml(hostData.helpItems);
  }
}

function applyCuisineData(content) {
  const cuisine = document.querySelector('[data-content-bind="cuisine"]');
  if (!cuisine || !content.cuisine) {
    return;
  }

  const cuisineData = content.cuisine;

  cuisine.dataset.id = cuisineData.id;
  cuisine.dataset.pencilName = cuisineData.pencilName;
  cuisine.dataset.imageSrc = cuisineData.imageSrc;
  cuisine.dataset.imageAlt = cuisineData.imageAlt;
  cuisine.dataset.labelText = cuisineData.labelText;

  const headingSlot = cuisine.querySelector('template[data-slot="heading"]');
  if (headingSlot) {
    headingSlot.innerHTML = cuisineData.headingHtml;
  }

  const bodySlot = cuisine.querySelector('template[data-slot="body"]');
  if (bodySlot) {
    bodySlot.innerHTML = cuisineData.bodyHtml;
  }

  const buttonSlot = cuisine.querySelector('template[data-slot="button"]');
  if (buttonSlot) {
    buttonSlot.innerHTML = `<div data-component="button" data-variant="outline" data-pencil-name="Cuisine CTA" data-padding="12px_24px" data-label="${cuisineData.buttonLabel}" data-href="${resolvePageHref(cuisineData.buttonHref)}"></div>`;
  }
}

function buildAccessLinesHtml(routes) {
  return routes
    .map(
      (text) => `<div
            data-pencil-name="Access Line"
            class="text-[14px]/[25px] box-border w-full text-[#4A5456] font-['Shippori_Mincho',system-ui,sans-serif] font-normal text-left"
          >
            ${text}
          </div>`
    )
    .join("\n          ");
}

function applyAccessData(content) {
  const access = document.querySelector('[data-content-bind="access"]');
  if (!access || !content.access) {
    return;
  }

  const accessData = content.access;

  access.dataset.id = accessData.id;
  access.dataset.pencilName = accessData.pencilName;
  access.dataset.mapEmbedUrl = accessData.mapEmbedUrl;
  access.dataset.mapTitle = accessData.mapTitle;
  access.dataset.addrText = accessData.addrText;

  const accessLinesSlot = access.querySelector('template[data-slot="access-lines"]');
  if (accessLinesSlot) {
    accessLinesSlot.innerHTML = buildAccessLinesHtml(accessData.routes);
  }
}

function applyAccessLocationData(content) {
  if (!content.access) {
    return;
  }

  const { mapEmbedUrl, mapLinkUrl, mapTitle } = content.access;
  const mapEmbed = document.querySelector("[data-access-map-embed]");
  const mapLink = document.querySelector("[data-access-map-link]");

  if (mapEmbed && mapEmbedUrl) {
    mapEmbed.src = mapEmbedUrl;
    mapEmbed.title = mapTitle || "蒼海の宿 ならいの風の地図";
  }

  if (mapLink && mapLinkUrl) {
    mapLink.href = mapLinkUrl;
  }
}

function buildStayFeatureCardHtml(feature) {
  return `<div
            data-pattern="feature-card"
            data-id="${feature.id}"
            data-block-pencil-name="${feature.blockPencilName}"
            data-img-pencil-name="${feature.imgPencilName}"
            data-image-src="${feature.imageSrc}"
            data-image-alt="${feature.imageAlt}"
            data-title-pencil-name="${feature.titlePencilName}"
            data-body-pencil-name="${feature.bodyPencilName}"
            data-cta-pencil-name="${feature.ctaPencilName}"
            data-cta-padding="${feature.ctaPadding}"
            data-cta-label="${feature.ctaLabel}"
            data-cta-href="${resolvePageHref(feature.ctaHref)}"
          >
            <template data-slot="heading">${feature.heading}</template>
            <template data-slot="body">${feature.bodyHtml}</template>
          </div>`;
}

function applyStayData(content) {
  const stay = document.querySelector('[data-content-bind="stay"]');
  if (!stay || !content.stay) {
    return;
  }

  const stayData = content.stay;

  stay.id = stayData.id;
  stay.dataset.pencilName = stayData.pencilName;

  const enLabel = stay.querySelector('[data-pencil-name="Stay En Label"]');
  if (enLabel) {
    enLabel.textContent = stayData.labelText;
  }

  const sectionHeading = stay.querySelector('[data-component="section-heading"]');
  if (sectionHeading) {
    sectionHeading.dataset.labelJa = stayData.headingJa;
    sectionHeading.dataset.labelJaLine2 = stayData.headingJaLine2;
  }

  const stayRow = stay.querySelector('[data-pencil-name="Stay Row"]');
  if (stayRow) {
    stayRow.innerHTML = stayData.features.map(buildStayFeatureCardHtml).join("\n          ");
  }
}

function buildNewsCardPlaceholderHtml(item) {
  return `<div
            data-component="news-card"
            data-pencil-name="${item.pencilName}"
            data-image="${item.image}"
            data-date="${item.date}"
            data-date-iso="${item.dateIso}"
            data-title="${item.title}"
          ></div>`;
}

function applyNewsData(content) {
  const news = document.querySelector('[data-content-bind="news"]');
  if (!news || !content.news) {
    return;
  }

  const newsData = content.news;

  news.id = newsData.id;
  news.dataset.pencilName = newsData.pencilName;

  const sectionHeading = news.querySelector('[data-component="section-heading"]');
  if (sectionHeading) {
    sectionHeading.dataset.labelEn = newsData.headingEn;
    sectionHeading.dataset.labelJa = newsData.headingJa;
  }

  const newsGrid = news.querySelector('[data-pencil-name="News Grid"]');
  if (newsGrid) {
    newsGrid.innerHTML = newsData.items.map(buildNewsCardPlaceholderHtml).join("\n          ");
  }

  const moreButton = news.querySelector('[data-pencil-name="News More"]');
  if (moreButton) {
    moreButton.dataset.label = newsData.buttonLabel;
    moreButton.dataset.href = newsData.buttonHref;
  }
}

function buildFaqCardPlaceholderHtml(item) {
  return `<div
              data-component="faq-card"
              data-pencil-name="${item.pencilName}"
              data-question="${item.question}"
              data-answer="${item.answer}"
            ></div>`;
}

function buildFaqRowHtml(row, rowNumber) {
  const cards = row.map(buildFaqCardPlaceholderHtml).join("\n            ");

  return `<div
            data-pencil-name="FAQ Row ${rowNumber}"
            class="box-border w-full h-fit shrink-0 flex flex-col md:flex-row gap-4 md:gap-[16px] justify-start items-start"
          >
            ${cards}
          </div>`;
}

function applyFaqData(content) {
  const faq = document.querySelector('[data-content-bind="faq"]');
  if (!faq || !content.faq) {
    return;
  }

  const faqData = content.faq;

  faq.id = faqData.id;
  faq.dataset.pencilName = faqData.pencilName;

  const sectionHeading = faq.querySelector('[data-component="section-heading"]');
  if (sectionHeading) {
    sectionHeading.dataset.labelEn = faqData.headingEn;
    sectionHeading.dataset.labelJa = faqData.headingJa;
  }

  const anxietyGrid = faq.querySelector('[data-pencil-name="Anxiety Grid"]');
  if (anxietyGrid) {
    anxietyGrid.innerHTML = faqData.rows
      .map((row, index) => buildFaqRowHtml(row, index + 1))
      .join("\n          ");
  }

  const faqLink = faq.querySelector('[data-pencil-name="FAQ Link"]');
  if (faqLink) {
    faqLink.dataset.label = faqData.faqLinkLabel;
    faqLink.dataset.href = resolvePageHref(faqData.faqLinkHref);
  }

  const anxietyCall = faq.querySelector('[data-pencil-name="Anxiety Call"]');
  if (anxietyCall) {
    anxietyCall.dataset.label = faqData.callLabel;
    anxietyCall.dataset.href = faqData.callHref;
  }
}

function buildFinalCtaActionsHtml(finalCtaData) {
  return `<div
              data-component="phone-display"
              data-variant="display-large"
              data-pencil-name="Final Tel"
              data-facility-phone
            ></div>
            <div data-component="button" data-variant="primary" data-pencil-name="Final Book" data-padding="14px_28px" data-label-font="Shippori_Mincho" data-label="${finalCtaData.bookingLabel}" data-href="${finalCtaData.bookingHref}"></div>`;
}

function applyFinalCtaData(content) {
  const finalCta = document.querySelector('[data-content-bind="final-cta"]');
  if (!finalCta || !content.finalCta) {
    return;
  }

  const finalCtaData = content.finalCta;

  finalCta.dataset.pencilName = finalCtaData.pencilName;
  finalCta.dataset.bgImage = finalCtaData.bgImage;

  const headingSlot = finalCta.querySelector('template[data-slot="heading"]');
  if (headingSlot) {
    headingSlot.innerHTML = finalCtaData.heading;
  }

  const bodySlot = finalCta.querySelector('template[data-slot="body"]');
  if (bodySlot) {
    bodySlot.innerHTML = finalCtaData.bodyHtml;
  }

  const actionsSlot = finalCta.querySelector('template[data-slot="actions"]');
  if (actionsSlot) {
    actionsSlot.innerHTML = buildFinalCtaActionsHtml(finalCtaData);
  }
}

function applyNavGroupBind(bindName, itemsJson) {
  const selector = `[data-content-bind="${bindName}"]`;

  document.querySelectorAll(selector).forEach((element) => {
    element.dataset.items = itemsJson;
  });

  // <template> 内の要素は document ツリーに含まれないため、別途 content を走査する
  document.querySelectorAll("template").forEach((template) => {
    template.content.querySelectorAll(selector).forEach((element) => {
      element.dataset.items = itemsJson;
    });
  });
}

function applyNavGroupData(content) {
  if (!content.navigation) {
    return;
  }

  const items = content.navigation.items.map((item) => ({
    ...item,
    href: resolvePageHref(item.href),
  }));
  const itemsJson = JSON.stringify(items);

  applyNavGroupBind("nav-header", itemsJson);
  applyNavGroupBind("nav-footer", itemsJson);
}

function applyOmotenashiData(content) {
  const staff = content.omotenashi?.staff;
  if (!staff || staff.length === 0) {
    return;
  }

  staff.forEach((member, index) => {
    const card = document.querySelector(`[data-pencil-name="Staff ${index + 1}"]`);
    if (!card) {
      return;
    }

    const name = card.querySelector('[data-pencil-name="Staff Name"]');
    const phrase = card.querySelector('[data-pencil-name="Staff Phrase"]');
    const img = card.querySelector("img");

    if (name) {
      name.textContent = member.name;
    }

    if (phrase) {
      phrase.textContent = member.phrase;
    }

    if (img) {
      img.src = resolveAssetPath(member.image);
      img.alt = `${member.name} の写真`;
    }
  });
}

function applyContentData(content) {
  applyIntroData(content);
  applyHostData(content);
  applyCuisineData(content);
  applyAccessData(content);
  applyAccessLocationData(content);
  applyStayData(content);
  applyNewsData(content);
  applyFaqData(content);
  applyFinalCtaData(content);
  applyNavGroupData(content);
  applyOmotenashiData(content);
}

window.loadFacilityData = loadFacilityData;
window.applyFacilityData = applyFacilityData;
window.applyPhoneDisplayData = applyPhoneDisplayData;
window.applyPageCtaLinks = applyPageCtaLinks;
window.loadContentData = loadContentData;
window.applyContentData = applyContentData;
window.resolvePageHref = resolvePageHref;
