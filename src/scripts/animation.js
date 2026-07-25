function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initHeroAnimation() {
  const hero = document.querySelector('[data-animate="hero"]');
  if (!hero) {
    return;
  }

  gsap.from(hero.children, {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.15,
    ease: "power2.out",
  });
}

function initScrollReveal() {
  gsap.utils.toArray("section[data-animate='reveal']").forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
    });
  });
}

function initCardAnimation() {
  const grids = document.querySelectorAll(
    '[data-pencil-name="News Grid"], [data-pencil-name="Anxiety Grid"]'
  );

  grids.forEach((grid) => {
    const cards = grid.querySelectorAll('[data-animate="card"]');
    if (cards.length === 0) {
      return;
    }

    gsap.from(cards, {
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
    });
  });
}

function initLabelAnimation() {
  gsap.utils.toArray('[data-animate="label"]').forEach((label) => {
    gsap.from(label, {
      scrollTrigger: {
        trigger: label,
        start: "top 85%",
      },
      opacity: 0,
      scale: 0.98,
      duration: 1.2,
      ease: "power2.out",
    });
  });
}

function initAnimations() {
  if (prefersReducedMotion() || typeof gsap === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  initHeroAnimation();
  initScrollReveal();
  initCardAnimation();
  initLabelAnimation();
}

document.addEventListener("page:ready", initAnimations);
