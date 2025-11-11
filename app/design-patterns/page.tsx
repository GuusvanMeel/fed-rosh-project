"use client";
import React, { useState, useEffect } from "react";

export default function Page() {
  const [color, setColor] = useState("#000000");

  async function saveColor(newColor: string) {
    setColor(newColor);
    document.documentElement.style.setProperty("--primary-color", newColor);

    await fetch("/api/save-pattern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "primary-color": newColor }),
    });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--secondary-color)", color: "var(--primary-color)" }}
    >
      <h1 className="text-2xl mb-4">Edit Theme Color</h1>

      <input
        type="color"
        value={color}
        onChange={(e) => saveColor(e.target.value)}
        className="w-16 h-10 cursor-pointer border border-gray-300 rounded"
      />

      <p className="mt-4 text-gray-500">Current primary color: {color}</p>
    </div>
  );
}
