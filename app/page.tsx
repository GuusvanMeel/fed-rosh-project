'use client';
import React, { useEffect, useState } from 'react'
import PanelSettings from './component/canvas/canvasSideBar';
import { PanelProps } from './component/panel';
import Canvas, { CanvasData } from './component/canvas/Canvas';
import { getPanels } from '@/lib/supabase/queries/getPanels';
import { savePanels } from '@/lib/supabase/queries/savePanels';


export type PanelType = "text" | "video" | "image" | "carousel";

export type PanelData = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
  panelProps: PanelProps;
	backgroundColor: string;
}

export default function Page() {
  const [myCanvas, setMyCanvas] = useState<CanvasData>({
    Width: 1280,
    Height: 720,
    Mobile: false,
    color: "#1e3a8a",
    columns: 20,
    rows: 10,
    showgrid: true,
    panels: []
  });
  const handleSave = async () => {
    try {
      await savePanels(panels);
      alert("✅ Panels saved successfully!");
    } catch (err) {
      console.error("Error saving panels:", err);
      alert("❌ Failed to save panels. Check console for details.");
    }
  };
  
  const [panels, setPanels] = useState<PanelData[]>([]);
   
  useEffect(() => {
    getPanels().then(setPanels);
  }, []);
  useEffect(() =>
     {
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
       <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md"
      >
        💾 Save All Panels
      </button>
      <Canvas settings={myCanvas} setPanels={setPanels}  />
    
    </div>
  );
}

