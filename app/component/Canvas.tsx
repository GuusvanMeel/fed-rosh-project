'use client';

import React, { useMemo, useState, useEffect } from 'react'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export type CanvasData = {
  Width: number;
  Height: number;
  color: string;
  columns: number;
  rows: number;
  showgrid: boolean
  panels: Layout[]
};

export default function Canvas({ settings }: { settings: CanvasData }) {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  
  // Use useState instead of useRef for layout
  const [layout, setLayout] = useState<Layout[]>(settings.panels);

  // Only update layout when settings.panels changes (new page selected)
  useEffect(() => {
    setLayout(settings.panels);
  }, [settings.panels]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    const fixedLayout = newLayout.map(item => {
      const maxY = settings.rows - item.h;
      if (item.y > maxY) {
        return { ...item, y: maxY };
      }
      return item;
    });
    setLayout(fixedLayout);
  };

  return (
    <div
      className="bg-blue-900 rounded-2xl relative overflow-hidden"
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
        style={{height: "100%"}}
        onLayoutChange={handleLayoutChange}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 0 }}
        cols={{ lg: settings.columns }}
        rowHeight={settings.Height / settings.rows}
        width={settings.Width}
        compactType={null}
        margin={[0, 0]}
        containerPadding={[0, 0]}
        maxRows={settings.rows}
        allowOverlap
        isBounded
      >
        {layout.map((panel) => (
          <div key={panel.i} className="bg-red-500 rounded">
            <span>Item {panel.i}</span>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
