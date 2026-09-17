import { useEffect, useState } from "react";
import { ThemeContext } from "./themeContext";

const STORAGE_KEY = "gym_tracker_theme";

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }) {
  // null = follow system preference; "light"/"dark" = explicit user choice
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");

    try {
      if (theme) localStorage.setItem(STORAGE_KEY, theme);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => {
      const resolvedCurrent = current ?? (systemPrefersDark() ? "dark" : "light");
      return resolvedCurrent === "dark" ? "light" : "dark";
    });
  }

  const resolvedTheme = theme ?? (systemPrefersDark() ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
