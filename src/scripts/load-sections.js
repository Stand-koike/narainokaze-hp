async function loadSections() {
  const placeholders = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(placeholders).map(async (placeholder) => {
      const src = placeholder.getAttribute("data-include");
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`Failed to load section: ${src}`);
      }
      placeholder.outerHTML = await response.text();
    })
  );
}

loadSections();
