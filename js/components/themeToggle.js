// ==========================================================================
// Modo oscuro: se guarda la preferencia en localStorage
// ==========================================================================
const STORAGE_KEY = 'superheroes-theme';
const THEMES = { LIGHT: 'light', DARK: 'dark' };

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) return savedTheme;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? THEMES.DARK : THEMES.LIGHT;
};

const applyTheme = (theme, toggleButton) => {
  const isDark = theme === THEMES.DARK;
  document.documentElement.dataset.theme = theme;
  toggleButton.setAttribute('aria-pressed', String(isDark));
  toggleButton.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
  toggleButton.querySelector('.theme-toggle__icon').textContent = isDark ? '☀️' : '🌙';
};

export const initThemeToggle = (toggleButton) => {
  let currentTheme = getInitialTheme();
  applyTheme(currentTheme, toggleButton);

  toggleButton.addEventListener('click', () => {
    currentTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    localStorage.setItem(STORAGE_KEY, currentTheme);
    applyTheme(currentTheme, toggleButton);
  });
};
