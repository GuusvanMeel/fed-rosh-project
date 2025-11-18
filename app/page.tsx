'use client';
import React, { useEffect, useState } from 'react'
import PanelSettings from './component/canvas/canvasSideBar';
import { getPanels } from '@/lib/supabase/queries/getPanels';
import { savePanels } from '@/lib/supabase/queries/savePanels';
import { Provider } from "@/components/ui/provider"
import DialogBox from './component/DialogBox';
import PanelSettingsModal from './component/panels/panelModal';
import { deletePanel } from '@/lib/supabase/queries/deletePanel';
import { PanelData } from './types/panel';
import { CanvasData } from './types/canvas';
import Canvas from './component/canvas/Canvas';
import Sidebar from '@/components/ui/sidebar';




export default function Page() {
   const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info" | "warning",
  });
  const [myCanvas, setMyCanvas] = useState<CanvasData>({
    Width: 1280,
    Height: 3000,
    Mobile: false,
    color: "#838485",
    columns: 20,
    rows: 40,
    showgrid: true,
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
const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
const [isSettingsOpen, setIsSettingsOpen] = useState(false);
const selectedPanel = panels.find(p => p.i === selectedPanelId) ?? null;

// Opens modal when user wants to edit
const handleEditPanel = (id: string) => {
  setSelectedPanelId(id);
  setIsSettingsOpen(true);
};

// Updates a panel after editing
const handlePanelUpdate = (updated: PanelData) => {
  setPanels(prev =>
    prev.map(p => (p.i === updated.i ? updated : p))
  );
};

// Closes the modal
const handleClosePanelSettings = () => {
  setIsSettingsOpen(false);
  setSelectedPanelId(null);
};
const handleDeletePanel = async (id: string) => {
  try {
    await deletePanel(id);
  } catch (err) {
    console.error("Failed to delete panel from DB:", err);
  } finally {
    setPanels((prev) => prev.filter((p) => p.i !== id));
    setIsSettingsOpen(false);
    setSelectedPanelId(null);
  }
};
   
  useEffect(() => {
    getPanels().then(setPanels);
  }, []);


  return (
    <Provider>
    <Sidebar/>
    <div className="flex  items-start">
      <PanelSettings
        myCanvas={myCanvas}
        setMyCanvas={setMyCanvas}
        panels={panels} 
        setPanels={setPanels}
        onEdit={handleEditPanel} 
        onSave={handleSave}
        onDelete={handleDeletePanel}
      />
      
  <Canvas
    settings={myCanvas}
    panels={panels}
    setPanels={setPanels}
    onEdit={handleEditPanel}
  />
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
    {isSettingsOpen && selectedPanel && (
  <PanelSettingsModal
    panel={selectedPanel}
    onUpdate={handlePanelUpdate}
    onClose={handleClosePanelSettings}
    onDelete={handleDeletePanel}
  />
)}

    </Provider>
  );
}

