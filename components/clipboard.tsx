"use client";

import { useEffect } from "react";

export function Clipboard() {
  useEffect(() => {
    const handleClipboard = (e: Event) => {
      const el = e.currentTarget as HTMLElement | null;
      if (!el) return;

      const target = el.getAttribute("data-clipboard");
      if (!target) return;

      let textToCopy = "";
      if (target.startsWith("#")) {
        const url = new URL(window.location.href);
        url.search = "";
        url.hash = target;
        textToCopy = url.toString();
      } else {
        textToCopy = target;
      }

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          el.classList.add("clip-icon-clicked");

          setTimeout(() => {
            el.classList.remove("clip-icon-clicked");
          }, 1000);
        })
        .catch((error) => {
          console.error("Clipboard copy failed:", error);
          alert("Copy failed\nPlease try again manually");
        });
    };

    const elements = document.querySelectorAll<HTMLElement>("[data-clipboard]");
    elements.forEach((el) => {
      el.addEventListener("click", handleClipboard);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener("click", handleClipboard);
      });
    };
  }, []);

  return null;
}
