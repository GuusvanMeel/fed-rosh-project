'use client';

import React, { useMemo, useEffect, useState } from 'react'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import TextPanel from '../panels/TextPanel';
import VideoPanel from '../panels/VideoPanel';
import ImagePanel from '../panels/ImagePanel';
import { PanelData } from '../../page';
import { CountdownPanel } from '../panels/CountdownPanel';
import ScrollingTextPanel from '../panels/ScrollingTextPanel';
import UrlPanel from '../panels/UrlPanel';
import { Bracket } from 'react-brackets';
import { rounds, BracketWrapper } from '../panels/BracketPanel';


export type CanvasData = {
  Width: number;
  Height: number;
  Mobile: boolean;
  color: string;
  columns: number;
  rows: number;
  showgrid: boolean
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
          if (typeof panel.panelProps.content === "string") {
            
            return (
              <CountdownPanel targetTime={new Date(Number(panel.panelProps.content))}></CountdownPanel>
            );
          }


        case "scrollingText":
        if (typeof panel.panelProps.content === "string") {
          return (
            <ScrollingTextPanel Text={panel.panelProps.content}></ScrollingTextPanel>
          );
        }

        case "url":
        if (Array.isArray(panel.panelProps.content)) {
          return (
            <UrlPanel Text={panel.panelProps.content[0]} url={panel.panelProps.content[1]} ></UrlPanel>
          );
        }

        case "bracket":
        if (typeof panel.panelProps.content === "string") {
          return (
            <BracketWrapper rounds={rounds}></BracketWrapper>
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

export default function Canvas({ settings,panels, setPanels, onEdit }: { settings: CanvasData,panels: PanelData[], setPanels: (next: PanelData[] | ((p: PanelData[]) => PanelData[])) => void; onEdit: (id: string) => void; }) {
  
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);
  const [isDragging, setIsDragging] = useState(false);

  
const handlePanelClick = (id: string) => {
  if (!isDragging) {
    onEdit(id);
  }
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
      className="bg-gray-400 rounded-2xl relative overflow-hidden"
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
       onDragStop={(layout) => {
  handleLayoutChange(layout);
  setTimeout(() => setIsDragging(false), 150);
}}

       onResizeStart={() => setIsDragging(true)}                     
       onResizeStop={(layout) => {
  handleLayoutChange(layout);
  setTimeout(() => setIsDragging(false), 150);
}}
        className="layout"
        style={{height: "100%"}}
        layouts={{ lg: panels }}
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
  {panels.map(panel => {
  return (
    <div
      key={panel.i}
      onClick={() => handlePanelClick(panel.i)}
      className={`cursor-grab active:cursor-grabbing  rounded`}
      style={{ backgroundColor: panel.backgroundColor,
          borderRadius: panel.borderRadius ?? 8,
       }}
    >
  {renderPanel(panel)}
</div>
      )})}
    </ResponsiveGridLayout>

    </div>
  );
}
