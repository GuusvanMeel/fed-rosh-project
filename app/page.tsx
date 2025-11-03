'use client';
import React, { useEffect, useState } from 'react'

import PanelSettings from './component/canvas/canvasSideBar';
import { PanelProps } from './component/panel';
import Canvas, { CanvasData } from './component/canvas/Canvas';


export type PanelType = "text" | "video" | "image" | "carousel";

export type PanelData = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
  panelProps: PanelProps;
	isDraggable: boolean;
	backgroundColor: string;
	textColor: string;
	fontFamily: string;
    isPlaying?: boolean;
}

export default function Page() {
  const [myCanvas, setMyCanvas] = useState<CanvasData>({
    Width: 370,
    Height: 780,
    Mobile: true,
    color: "#1e3a8a",
    columns: 20,
    rows: 10,
    showgrid: true,
    panels: []
  });
  
  const [panels, setPanels] = useState<PanelData[]>([]);
  
  useEffect(() => {
  // Whenever panels change, sync them into myCanvas
  setMyCanvas(prev => ({
    ...prev,
    panels: panels,
  }));
}, [panels]);

  return (
    <div className="flex gap-6 items-start">
      <PanelSettings
        myCanvas={myCanvas}
        setMyCanvas={setMyCanvas}
        panels={panels} 
        setPanels={setPanels} 
      />
      <Canvas settings={myCanvas} setPanels={setPanels}  />
    </div>
  );
}

