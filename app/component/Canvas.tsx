'use client';

import React, { useState } from 'react'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useRef, useEffect } from 'react';


export type CanvasData = {
  Width: number;
  Height: number;
  color: string;
  columns: number;
  rows: number;
  showgrid: boolean
};

export default function Canvas({ settings }: { settings: CanvasData }) {
  const ResponsiveGridLayout = WidthProvider(Responsive);
  
  const layoutRef = useRef<Layout[]>([
    { i: "1", x: 0, y: 0, w: 2, h: 2 },
    { i: "2", x: 2, y: 0, w: 2, h: 4 },
    { i: "3", x: 4, y: 0, w: 2, h: 5 },
  ]);

  const [renderKey, setRenderKey] = useState(0);
  // this will trigger a re-render *only when settings change*

  // 🔄 If settings (size/color/etc.) change, re-render canvas
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [settings.Width, settings.Height, settings.color, settings.showgrid]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    // 🧠 store latest layout positions
    layoutRef.current = newLayout;
    // optional: save to localStorage, etc.
  };

  return (
    <div
      className="bg-blue-900 rounded-2xl relative overflow-hidden" // ✅ relative keeps overlay scoped
      style={{
        backgroundColor: settings.color,
        height: settings.Height,
        width: settings.Width,
      }}
    >
      {/* Grid overlay */}
      {settings.showgrid && <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              to right,
              rgba(255,255,255,.2) 0,
              rgba(255,255,255,.2) 1px,
              transparent 1px,
              transparent ${settings.Width / settings.columns}px
            ),
            repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,.2) 0,
              rgba(255,255,255,.2) 1px,
              transparent 1px,
              transparent ${settings.Height / settings.rows}px
            )
          `,
        }}
      />}

      <ResponsiveGridLayout
        className="layout"
        onLayoutChange={handleLayoutChange}
        layouts={{ lg: layoutRef.current }}
        breakpoints={{ lg: 0 }}
        cols={{ lg: settings.columns }}
        rowHeight={settings.Height / settings.rows}
        width={settings.Width}
        compactType={null}
        margin={[0, 0]}            // ✅ align with overlay
        containerPadding={[0, 0]}  // ✅ no extra padding
      >
        <div key="1" className="bg-red-500 rounded">Item 1</div>
        <div key="2" className="bg-green-500 rounded">Item 2</div>
        <div key="3" className="bg-yellow-500 rounded">Item 3</div>
      </ResponsiveGridLayout>
    </div>
  );
}
