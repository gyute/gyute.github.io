"use client";

import { useEffect, useState } from "react";

export function Comments() {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const html = document.documentElement;
    const isDarkMode = html.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const isDarkMode = html.classList.contains("dark");
        setTheme(isDarkMode ? "dark" : "light");
      });
    });
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "gyute/comments");
    script.setAttribute("data-repo-id", "R_kgDOM-8Qdw");
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", "DIC_kwDOM-8Qd84CjRvo");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    const commnets = document.getElementById("giscus");
    if (commnets) {
      commnets.appendChild(script);
    }
  }, [theme]);

  return theme ? <div id="giscus" className="mt-12"></div> : null;
}
