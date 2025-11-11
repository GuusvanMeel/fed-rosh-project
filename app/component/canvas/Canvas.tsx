'use client';

import React, { useMemo, useEffect, useState } from 'react'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import TextPanel from '../panels/TextPanel';
import VideoPanel from '../panels/VideoPanel';
import ImagePanel from '../panels/ImagePanel';
import { PanelData } from '../../page';
import PanelSettingsModal from '../panels/panelModal';
import { CountdownPanel } from '../panels/CountdownPanel';
import ScrollingTextPanel from '../panels/ScrollingTextPanel';


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
switch (panel.panelProps.type) {
      case "text":
        if (typeof panel.panelProps.content === "string") {
          return (
            <TextPanel Text={panel.panelProps.content}></TextPanel>
          );
        }

      case "video":
        if (typeof panel.panelProps.content === "string") {
          return (
            <VideoPanel source={panel.panelProps.content}></VideoPanel>
          );
        }
      
        case "image":
        if (typeof panel.panelProps.content === "string") {
          return (
            <ImagePanel source={panel.panelProps.content}></ImagePanel>
          );
        }

        case "countdown":
          const date : Date = new Date(Date.now() + 10000);
          return (
            <CountdownPanel targetTime={date}></CountdownPanel>
          );


        case "scrollingText":
        if (typeof panel.panelProps.content === "string") {
          return (
            <ScrollingTextPanel Text={panel.panelProps.content}></ScrollingTextPanel>
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

export default function Canvas({ settings, setPanels }: { settings: CanvasData, setPanels: (next: PanelData[] | ((p: PanelData[]) => PanelData[])) => void; }) {
  
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const selectedPanel = settings.panels.find(p => p.i === selectedPanelId) ?? null;
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  
const handlePanelClick = (id: string) => {
  if (!isDragging) {
    setSelectedPanelId(id);
  }
};

// React to selectedPanel changes
useEffect(() => {
  if (selectedPanel) {
    setIsSettingsOpen(true);
  }
}, [selectedPanel]);

useEffect(() => {
  if (!selectedPanel) setIsSettingsOpen(false);
}, [selectedPanel]);

  const handlePanelUpdate = (updated: PanelData) => {
    setPanels(prev =>
      prev.map(p => (p.i === updated.i ? updated : p))
    );
  };
  

 const handleLayoutChange = (newLayout: Layout[]) => {
  setPanels(prevPanels =>
    prevPanels.map(panel => {
      const layoutItem = newLayout.find(l => l.i === panel.i);
      return layoutItem
        ? { ...panel, x: layoutItem.x, y: layoutItem.y, w: layoutItem.w, h: layoutItem.h }
        : panel;
    })
  );
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
       onDragStart={() => setIsDragging(true)}
       onDragStop={() => setTimeout(() => setIsDragging(false), 150)} 
       onResizeStart={() => setIsDragging(true)}                     
       onResizeStop={() => setTimeout(() => setIsDragging(false), 150)} 
        className="layout"
        style={{height: "100%"}}
        onLayoutChange={handleLayoutChange}
        layouts={{ lg: settings.panels }}
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
  {settings.panels.map(panel => {
  return (
    <div
      key={panel.i}
      onClick={() => handlePanelClick(panel.i)}
      className={`cursor-pointer rounded ${
        selectedPanelId === panel.i ? "ring-4 ring-yellow-400" : ""
      }`}
      style={{ backgroundColor: panel.backgroundColor }}
    >
  {renderPanel(panel)}
</div>
      )})}
    </ResponsiveGridLayout>
  {isSettingsOpen && (
  <PanelSettingsModal
    panel={selectedPanel}
    onUpdate={handlePanelUpdate}
   onClose={() => {
      setIsSettingsOpen(false);
      setSelectedPanelId(null); // ✅ clear selection
    }}
  />
)}

    </div>
  );
}
