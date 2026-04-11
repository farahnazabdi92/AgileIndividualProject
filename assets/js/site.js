// Shared theme keys used across all pages.
const THEME_KEY = "skilltrack.theme";
const THEME_LIGHT = "light";
const THEME_DARK = "dark";

const isThemeValue = (value) => value === THEME_LIGHT || value === THEME_DARK;

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return isThemeValue(stored) ? stored : null;
  } catch (error) {
    // If storage is blocked, continue with non-persistent theme behavior.
    return null;
  }
};

const getSystemTheme = () => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return THEME_DARK;
  }
  return THEME_LIGHT;
};

const getInitialTheme = () => getStoredTheme() || getSystemTheme();

const applyTheme = (theme) => {
  // Keep both custom theme tokens and Bootstrap components in sync.
  const safeTheme = isThemeValue(theme) ? theme : THEME_LIGHT;
  document.documentElement.setAttribute("data-theme", safeTheme);
  document.documentElement.setAttribute("data-bs-theme", safeTheme);
};

const persistTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Ignore storage failures; theme still applies for this session.
  }
};

const setupThemeToggle = () => {
  const toggle = document.querySelector("#theme-toggle");
  if (!toggle) {
    // Pages without a shared header can skip theme controls safely.
    return;
  }

  const toggleText = toggle.querySelector(".theme-toggle-text");
  const syncToggleState = () => {
    // Mirror the active theme in button text/ARIA for accessibility.
    const currentTheme = document.documentElement.getAttribute("data-theme") || THEME_LIGHT;
    const isDark = currentTheme === THEME_DARK;
    toggle.classList.toggle("is-dark", isDark);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    if (toggleText) {
      toggleText.textContent = isDark ? "Light mode" : "Dark mode";
    }
  };

  toggle.addEventListener("click", () => {
    // Persist explicit user choice so it overrides system preference on later visits.
    const currentTheme = document.documentElement.getAttribute("data-theme") || getInitialTheme();
    const nextTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(nextTheme);
    persistTheme(nextTheme);
    syncToggleState();
  });

  if (window.matchMedia) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event) => {
      // Respect system changes only until the user picks a manual theme.
      if (!getStoredTheme()) {
        applyTheme(event.matches ? THEME_DARK : THEME_LIGHT);
        syncToggleState();
      }
    };
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSystemChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSystemChange);
    }
  }

  syncToggleState();
};

const markActiveNav = () => {
  const currentPage = document.body.dataset.page;
  if (!currentPage) {
    return;
  }

  const navLinks = document.querySelectorAll(".site-nav .nav-link");
  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // Re-apply the resolved theme after DOM load and initialize shared header behavior.
  applyTheme(getInitialTheme());
  setupThemeToggle();
  markActiveNav();
});
