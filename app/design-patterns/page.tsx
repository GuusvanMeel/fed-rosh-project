"use client";
import React, { useState, useEffect } from "react";

export default function Page() {
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#ffffffff");
  const [accentColor, setAccentColor] = useState("#9700abff");

  async function saveColor(newColor: string, colorType: "primary" | "secondary" | "accent") {
    switch (colorType) {
    case "primary":
      setPrimaryColor(newColor);
      break;
    case "secondary":
      setSecondaryColor(newColor);
      break;
    case "accent":
      setAccentColor(newColor);
      break;
    default:
      console.warn(`Unknown colorType: ${colorType}`);
      return;
    }
    
    document.documentElement.style.setProperty(colorType, newColor);

    await fetch("/api/save-pattern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colorType: newColor }),
    });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--secondary-color)", color: "var(--primary-color)" }}
    >
      <h1 className="" style={{ background: `${secondaryColor}`, color: `${primaryColor}`}}>Edit Theme Color</h1>

      <input
        type="color"
        value={primaryColor}
        onChange={(e) => saveColor(e.target.value, "primary")}
        className="w-16 h-10 cursor-pointer border border-gray-300 rounded"
      />
      <input
        type="color"
        value={secondaryColor}
        onChange={(e) => saveColor(e.target.value, "secondary")}
        className="w-16 h-10 cursor-pointer border border-gray-300 rounded"
      />
      <input
        type="color"
        value={accentColor}
        onChange={(e) => saveColor(e.target.value, "accent")}
        className="w-16 h-10 cursor-pointer border border-gray-300 rounded"
      />

      <p className="mt-4 text-gray-500">Current primary color: {primaryColor}</p>
      <p className="mt-4 text-gray-500">Current secondary color: {secondaryColor}</p>
      <p className="mt-4 text-gray-500">Current accent color: {accentColor}</p>
    </div>
  );
}
