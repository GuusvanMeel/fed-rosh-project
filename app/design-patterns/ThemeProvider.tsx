/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    fetch("patterns/design-patterns.json")
      .then((res) => res.json())
      .then((data) => {
        setTheme(data);
        applyTheme(data);
      });
  }, []);

  function applyTheme(theme: any) {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme["primary-color"]);
    root.style.setProperty("--secondary-color", theme["secondary-color"]);
    root.style.setProperty("--font-h1", theme["h1"]["font-family"]);
    root.style.setProperty("--font-p", theme["p"]["font-family"]);
  }

  if (!theme) return null;
  return <>{children}</>;
}
