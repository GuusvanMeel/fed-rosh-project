'use client';
import React, { useEffect, useState } from 'react'
import PanelSettings from './component/canvas/canvasSideBar';
import { PanelProps } from './component/panel';
import Canvas, { CanvasData } from './component/canvas/Canvas';
import { getPanels } from '@/lib/supabase/queries/getPanels';
import { savePanels } from '@/lib/supabase/queries/savePanels';
import { Provider } from "@/components/ui/provider"
import { Button, Dialog, DialogBody } from "@chakra-ui/react"
import DialogBox from './component/DialogBox';


export type PanelType = "text" | "video" | "image" | "carousel";

export type PanelData = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
  panelProps: PanelProps;
	backgroundColor: string;
  borderRadius?: number;
}

export default function Page() {
   const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
  });
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
       
        setDialog({
        open: true,
        title: "✅ Panels Saved",
        message: "Your panels were saved successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error saving panels:", err);

      // ❌ show error dialog
      setDialog({
        open: true,
        title: "❌ Save Failed",
        message: "Failed to save panels. Check console for details.",
        type: "error",
      });
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
    <Provider>
    <div className="flex gap-6 items-start">
      <PanelSettings
        myCanvas={myCanvas}
        setMyCanvas={setMyCanvas}
        panels={panels} 
        setPanels={setPanels} 
      />
      <Button bg="#14cc54" onClick={handleSave}>save panels</Button>
      <Canvas settings={myCanvas} setPanels={setPanels}  />
    
    </div>
    <DialogBox
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText="OK"
        onConfirm={() => setDialog((d) => ({ ...d, open: false }))}
      />
    
    </Provider>
  );
}

