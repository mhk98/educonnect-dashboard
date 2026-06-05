import React, { useLayoutEffect, useMemo } from "react";

// create context
export const ThemeContext = React.createContext();

// create context provider
export const ThemeProvider = ({ children }) => {
  const theme = "light"; // Always light mode

  // update root element class on theme change
  useLayoutEffect(() => {
    document.documentElement.classList.remove("theme-dark");
    document.documentElement.classList.add("theme-light");
    // Ensure theme in localStorage is explicitly set to light
    try {
      localStorage.setItem("theme", "light");
    } catch (e) {
      // ignore if localStorage is unavailable
    }
  }, []);

  function toggleTheme() {
    // No-op since always light mode
  }

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
