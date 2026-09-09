(function () {
  let initialized = false;

  function isDevRuntime() {
    return Boolean(document.querySelector('script[src*="load-sections.js"]'));
  }

  function getHeader() {
    return document.querySelector('[data-pencil-name="Header"]');
  }

  function getFacilitySnapshot() {
    if (window.__FACILITY_DATA__) {
      return window.__FACILITY_DATA__;
    }

    const { phoneTel, bookingHref, bookingLabel } = document.body.dataset;
    if (!phoneTel || !bookingHref) {
      return null;
    }

    return {
      contact: { phone: { tel: phoneTel } },
      booking: { href: bookingHref, label: bookingLabel || "空室確認・予約" },
    };
  }

  function populateDrawerLinks(drawer) {
    const navSlot = drawer.querySelector("[data-mobile-nav-links]");
    if (!navSlot) {
      return;
    }

    const sourceNav = document.querySelector('[data-pencil-name="Nav Links"]');
    if (!sourceNav) {
      return;
    }

    navSlot.innerHTML = "";
    sourceNav.querySelectorAll("a").forEach((link) => {
      const clone = link.cloneNode(true);
      clone.removeAttribute("data-pencil-name");
      navSlot.appendChild(clone);
    });
  }

  function ensureBottomBar(facility) {
    if (document.querySelector(".mobile-bottom-bar")) {
      return document.querySelector(".mobile-bottom-bar");
    }

    const phone = facility?.contact?.phone;
    const booking = facility?.booking;
    if (!phone || !booking) {
      return null;
    }

    const bar = document.createElement("div");
    bar.className = "mobile-bottom-bar";
    bar.setAttribute("data-mobile-bottom-bar", "");
    bar.innerHTML = `
      <a class="mobile-bottom-bar__tel" data-mobile-bottom-tel href="${phone.tel}" aria-label="電話で問い合わせ">
        お電話
      </a>
      <a class="mobile-bottom-bar__book" data-mobile-bottom-book href="${booking.href}" aria-label="${booking.label || "空室確認・予約"}">
        空室確認・予約
      </a>
    `;
    document.body.appendChild(bar);
    return bar;
  }

  function applyBottomBarData(facility) {
    const tel = document.querySelector("[data-mobile-bottom-tel]");
    const book = document.querySelector("[data-mobile-bottom-book]");
    if (!tel || !book || !facility) {
      return;
    }

    tel.href = facility.contact.phone.tel;
    book.href = facility.booking.href;
    book.setAttribute("aria-label", facility.booking.label || "空室確認・予約");
  }

  function relocateDrawer() {
    const header = getHeader();
    const drawer = header?.querySelector("[data-mobile-nav-drawer]");
    if (drawer && drawer.parentElement !== document.body) {
      document.body.appendChild(drawer);
    }
    return document.querySelector("[data-mobile-nav-drawer]");
  }

  function setNavOpen(isOpen) {
    const header = getHeader();
    const toggle = header?.querySelector("[data-mobile-nav-toggle]");
    const drawer = document.querySelector("[data-mobile-nav-drawer]");

    document.body.classList.toggle("mobile-nav-open", isOpen);

    if (toggle) {
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    }

    if (drawer) {
      drawer.classList.toggle("is-open", isOpen);
      drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    }
  }

  function initNavInteractions() {
    const header = getHeader();
    if (!header) {
      return;
    }

    const toggle = header.querySelector("[data-mobile-nav-toggle]");
    const drawer = relocateDrawer();
    if (!toggle || !drawer) {
      return;
    }

    populateDrawerLinks(drawer);

    toggle.addEventListener("click", () => {
      const isOpen = !document.body.classList.contains("mobile-nav-open");
      setNavOpen(isOpen);
    });

    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("mobile-nav-open")) {
        setNavOpen(false);
      }
    });
  }

  function initMobileChrome(facilityOverride) {
    const facility = facilityOverride || getFacilitySnapshot();
    ensureBottomBar(facility);
    applyBottomBarData(facility);

    if (initialized) {
      return;
    }

    const header = getHeader();
    if (!header?.querySelector("[data-mobile-nav-toggle]")) {
      return;
    }

    initialized = true;
    initNavInteractions();
  }

  window.applyMobileChromeFromFacility = function applyMobileChromeFromFacility(facility) {
    initMobileChrome(facility);
  };

  function bootstrap() {
    if (isDevRuntime()) {
      document.addEventListener("page:ready", () => initMobileChrome());
      return;
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => initMobileChrome());
    } else {
      initMobileChrome();
    }
  }

  bootstrap();
})();
