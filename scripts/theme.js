(() => {
  const storageKey = "wvw-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;
  let preferredTheme = null;

  const validTheme = (value) => value === "light" || value === "dark";

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (validTheme(savedTheme)) preferredTheme = savedTheme;
  } catch {
    // The toggle still works if the browser disallows local storage.
  }

  const applyTheme = () => {
    const theme = preferredTheme ?? (systemTheme.matches ? "dark" : "light");
    root.dataset.theme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === "dark" ? "#18211f" : "#f4f1e9";

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }
  };

  // This script runs before the stylesheet to avoid a flash of the wrong theme.
  applyTheme();

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    applyTheme();
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      preferredTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme();
      try {
        localStorage.setItem(storageKey, preferredTheme);
      } catch {
        // Keep the selected theme for this page even without persistence.
      }
    });
  });

  systemTheme.addEventListener("change", () => {
    if (preferredTheme === null) applyTheme();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preferredTheme = validTheme(event.newValue) ? event.newValue : null;
    applyTheme();
  });
})();
