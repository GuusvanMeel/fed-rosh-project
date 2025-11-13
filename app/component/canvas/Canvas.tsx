'use client';

import React, { useMemo, useEffect, useState } from 'react'
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { PanelData } from '@/app/types/panel';
import { CanvasData } from '@/app/types/canvas';
import { PanelWrapper } from '../panels/panelWrapper';
import { panelRegistry } from '../panels/panelRegistry';



function renderPanel(panel: PanelData) {
  const entry = panelRegistry[panel.panelProps.type];

  if (!entry) {
    return (
      <div key={panel.i} className="bg-red-500 rounded">
        <span>Unknown panel type: {panel.panelProps.type}</span>
      </div>
    );
  }

  const Component = entry.component;
  const mappedProps = entry.mapProps(panel.panelProps.content);

  return (
    <PanelWrapper panel={panel}>
      <Component {...mappedProps} />
    </PanelWrapper>
  );
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
      className="bg-gray-400 rounded-2xl relative overflow-hidden border-4 border-red-500 "
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
      
    >
  {renderPanel(panel)}
</div>
      )})}
    </ResponsiveGridLayout>

    </div>
  );
}
