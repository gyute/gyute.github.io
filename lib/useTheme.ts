"use client";

import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const theme = savedTheme || systemTheme;

    setTheme(theme);
    localStorage.setItem("theme", theme);
  }, []);

  const toggleTheme = () => {
    const toggledTheme = theme === "light" ? "dark" : "light";
    setTheme(toggledTheme);
    localStorage.setItem("theme", toggledTheme);
    document.documentElement.classList.toggle("dark", toggledTheme === "dark");
  };

  return { theme, toggleTheme };
};
