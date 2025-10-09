'use client';

import React, { useMemo, useState, useEffect } from 'react'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { PanelData } from '../editcanvas/page';
import TextPanel from './panels/TextPanel';
import VideoPanel from './panels/VideoPanel';
import ImagePanel from './panels/ImagePanel';

export type CanvasData = {
  Width: number;
  Height: number;
  Mobile: boolean;
  color: string;
  columns: number;
  rows: number;
  showgrid: boolean
  panels: PanelData[]
};

function renderPanel(panel : PanelData){
switch (panel.type) {
      case "text":
        if (typeof panel.content === "string") {
          return (
            <TextPanel Text={panel.content}></TextPanel>
          );
        }

      case "video":
        if (typeof panel.content === "string") {
          return (
            <VideoPanel source={panel.content}></VideoPanel>
          );
        }
      
        case "image":
        if (typeof panel.content === "string") {
          return (
            <ImagePanel source={panel.content}></ImagePanel>
          );
        }
              
      default:
        return (
          <div key={panel.i} className="bg-red-500 rounded">
            <span>Item {panel.i}</span>
          </div>
        );
    }
}

export default function Canvas({ settings }: { settings: CanvasData }) {
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  
  // Use useState instead of useRef for layout
  const [layout, setLayout] = useState<PanelData[]>(settings.panels);

  // Only update layout when settings.panels changes (new page selected)
  useEffect(() => {
    setLayout(settings.panels);
  }, [settings.panels]);
  useEffect(() => {
    if (settings.Mobile) {
      // example mobile size (iPhone 14-ish)
      settings.Width=390
      settings.Height=844
    } else {
      // example desktop size
      settings.Width=1280
      settings.Height=720
    }
  }, [settings.Mobile]);
  

  const handleLayoutChange = (newLayout: PanelData[]) => {
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
            {renderPanel(panel)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
