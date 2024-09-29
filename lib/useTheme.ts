"use client";

import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const savedTheme = localStorage.getItem("theme");

      const handleChange = () => {
        setTheme(mediaQuery.matches ? "dark" : "light");
      };

      if (savedTheme !== null) {
        setTheme(savedTheme);
      } else {
        const t = mediaQuery.matches ? "dark" : "light";
        setTheme(t);
        localStorage.setItem("theme", t);
      }

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const toggleTheme = () => {
    let t: string;

    if (theme === "light") {
      t = "dark";
    } else {
      t = "light";
    }

    setTheme(t);
    localStorage.setItem("theme", t);
  };

  return { theme, toggleTheme };
};
