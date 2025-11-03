'use client';
import React, { useEffect, useState } from 'react'

import PanelSettings from './component/panelsettings/PanelSettings';
import { PanelProps } from './component/panel';
import Canvas, { CanvasData } from './component/Canvas';


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
  
  const [panels, setPanels] = useState<PanelData[]>([
    {
      i: "1",
      x: 0,
      y: 0,
      w: 2,
      h: 2,
      panelProps: { id: "1", type: "text", content: "Panel 1" },
      isDraggable: true,
      backgroundColor: "#1e3a8a",
      textColor: "#ffffff",
      fontFamily: "Serif"
    },
    {
      i: "2",
      x: 2,
      y: 0,
      w: 2,
      h: 4,
      panelProps: { id: "2", type: "image", content: "/next.svg" },
      isDraggable: true,
      backgroundColor: "#1e3a8a",
      textColor: "#ffffff",
      fontFamily: "Serif"
    },
    {
      i: "3",
      x: 4,
      y: 0,
      w: 2,
      h: 5,
      panelProps: { id: "3", type: "video", content: "/window.svg" },
      isDraggable: true,
      backgroundColor: "#1e3a8a",
      textColor: "#ffffff",
      fontFamily: "Serif"
    }
  ]);
  
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

