let facilityCache = null;

async function loadFacilityData() {
  if (facilityCache) {
    return facilityCache;
  }

  const response = await fetch("data/facility.json");
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

  header.dataset.homeHref = facility.brand.homeHref;
  header.dataset.logoSrc = facility.brand.logoSrc;
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

  footer.dataset.logoSrc = facility.brand.logoSrc;
  footer.dataset.logoAlt = facility.brand.name;
  footer.dataset.addressText = facility.contact.address;
  footer.dataset.phoneNumber = facility.contact.phone.display;
  footer.dataset.bookingHref = facility.booking.href;
  footer.dataset.bookingLabel = facility.booking.label;
  footer.dataset.copyrightText = facility.footer.copyright;
  footer.dataset.localeText = facility.footer.locale;
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

  hero.style.backgroundImage = `url('${heroData.bgImage}')`;
  hero.style.backgroundPosition = "center";
  hero.style.backgroundRepeat = "no-repeat";
  hero.style.backgroundSize = "cover";

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

function applyFacilityData(facility) {
  applyHeaderData(facility);
  applyFooterData(facility);
  applyHeroData(facility);
  applyPhoneDisplayData(facility);
}

window.loadFacilityData = loadFacilityData;
window.applyFacilityData = applyFacilityData;
window.applyPhoneDisplayData = applyPhoneDisplayData;
