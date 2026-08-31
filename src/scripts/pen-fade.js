(function () {
  "use strict";

  var FADE_MS = 1400;
  var INTERVAL_MS = 3500;
  var EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initFadeSlider(root) {
    var stage = root.querySelector("[data-fade-stage]");
    if (!stage) {
      return;
    }

    var slides = [stage].concat(
      Array.prototype.slice.call(root.querySelectorAll("[data-fade-slide]"))
    );
    var captions = Array.prototype.slice.call(root.querySelectorAll("[data-fade-caption]"));
    var dotsRoot = root.querySelector("[data-fade-dots]");
    var index = 0;
    var timer = null;
    var initialTimer = null;
    var autoplayStarted = false;
    var waitVisible = root.hasAttribute("data-fade-wait-visible");
    var intervalMs = Number(root.dataset.fadeInterval) || INTERVAL_MS;

    function applyTransition(el) {
      el.style.transition = "opacity " + FADE_MS + "ms " + EASE;
    }

    function syncSlideVideos(activeIndex) {
      slides.forEach(function (slide, idx) {
        var video = slide.querySelector("[data-hero-video]");
        if (!video) {
          return;
        }

        if (idx === activeIndex && !prefersReducedMotion()) {
          video.play().catch(function () {});
          return;
        }

        video.pause();
      });
    }

    function showSlide(nextIndex) {
      slides.forEach(function (slide, idx) {
        applyTransition(slide);
        slide.style.opacity = idx === nextIndex ? "1" : "0";
        slide.style.zIndex = idx === nextIndex ? "1" : "0";
      });

      captions.forEach(function (caption, idx) {
        applyTransition(caption);
        caption.style.opacity = idx === nextIndex ? "1" : "0";
      });

      if (dotsRoot) {
        dotsRoot.querySelectorAll("[data-fade-dot]").forEach(function (dot, idx) {
          dot.classList.toggle("is-active", idx === nextIndex);
          dot.setAttribute("aria-current", idx === nextIndex ? "true" : "false");
        });
      }

      index = nextIndex;
      syncSlideVideos(nextIndex);
    }

    function nextSlide() {
      showSlide((index + 1) % slides.length);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (initialTimer) {
        clearTimeout(initialTimer);
        initialTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (slides.length < 2 || prefersReducedMotion()) {
        return;
      }

      initialTimer = setTimeout(function () {
        initialTimer = null;
        nextSlide();
        timer = setInterval(nextSlide, intervalMs);
      }, intervalMs);
    }

    function beginAutoplay() {
      if (autoplayStarted) {
        return;
      }
      autoplayStarted = true;
      showSlide(0);
      startAutoplay();
    }

    if (dotsRoot && slides.length > 1) {
      dotsRoot.innerHTML = "";
      slides.forEach(function (_, idx) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "pen-fade-dot" + (idx === 0 ? " is-active" : "");
        dot.setAttribute("data-fade-dot", "");
        dot.setAttribute("aria-label", "スライド " + (idx + 1));
        dot.setAttribute("aria-current", idx === 0 ? "true" : "false");
        dot.addEventListener("click", function () {
          showSlide(idx);
          autoplayStarted = true;
          startAutoplay();
        });
        dotsRoot.appendChild(dot);
      });
    }

    showSlide(0);

    if (waitVisible && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }
            beginAutoplay();
            observer.disconnect();
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(root);
    } else {
      beginAutoplay();
    }

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", function () {
      if (autoplayStarted) {
        startAutoplay();
      }
    });
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", function () {
      if (autoplayStarted) {
        startAutoplay();
      }
    });
  }

  function initPenFade() {
    document.querySelectorAll("[data-fade-slider]").forEach(initFadeSlider);
  }

  function isDevRuntime() {
    return Boolean(document.querySelector('script[src*="load-sections.js"]'));
  }

  if (isDevRuntime()) {
    document.addEventListener("page:ready", initPenFade);
    return;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPenFade);
  } else {
    initPenFade();
  }
})();
