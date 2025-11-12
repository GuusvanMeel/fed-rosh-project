'use client'
import React from 'react'
import { useState } from 'react';
import { CanvasData } from './Canvas';
import { InputSwitch } from 'primereact/inputswitch';
import MyColorPicker from '../MyColorPicker';
import { PanelData, PanelType } from '@/app/page';
import PanelList from '../panels/PanelList';

export type PanelSettingsProps = {
  id?: string
  mobile: boolean
  color: string
  columns: number
  rows: number
  panels?: PanelData[]
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
}

export default function PanelSettings({
  myCanvas,
  setMyCanvas,
  panels,
  setPanels,
  onEdit,
  onSave
}: {
  myCanvas: CanvasData;
  setMyCanvas: React.Dispatch<React.SetStateAction<CanvasData>>;
  panels: PanelData[];
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
  onEdit: (id: string) => void;
  onSave: () => Promise<void>; 
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const addPanel = (type: PanelType) => {
    const id = crypto.randomUUID();
    const newPanel: PanelData = {
      i: id,
      x: 0,
      y: 0,
      w: 3,
      h: 3,
      panelProps: { id, type, content: "New Panel" },
      backgroundColor: "#1e3a8a",
    };
    setPanels(prev => [...prev, newPanel]);
    setIsPickerOpen(false);
  };

return (
  <div className="flex flex-col gap-3 w-[400px] p-3 bg-neutral-700 rounded-lg text-white">
    {/* --- Add / Save buttons --- */}
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setIsPickerOpen(true)}
        className="bg-neutral-500 hover:bg-neutral-600 px-3 py-2 rounded text-sm font-semibold"
      >
        ＋ Add Panel
      </button>
      <button
        onClick={onSave} // placeholder for save
        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-semibold"
      >
        💾 Save
      </button>
    </div>

    {/* --- Mobile/Desktop toggle --- */}
    <div className="flex items-center justify-between">
      <span className="text-xs">Device:</span>
      <div className="flex items-center gap-2">
        <InputSwitch
          checked={myCanvas.Mobile}
          onChange={(e) => {
            const isMobile = e.value;
            const newWidth = isMobile ? 390 : 1280;
            const newHeight = isMobile ? 844 : 720;
            setMyCanvas({
              ...myCanvas,
              Mobile: isMobile,
              Width: newWidth,
              Height: newHeight,
            });
          }}
        />
        <span className="text-xs">{myCanvas.Mobile ? "Mobile" : "Desktop"}</span>
      </div>
    </div>

    {/* --- Grid toggle --- */}
    <div className="flex items-center justify-between">
      <span className="text-xs">Grid:</span>
      <div className="flex items-center gap-2">
        <InputSwitch
          checked={myCanvas.showgrid}
          onChange={(e) => setMyCanvas({ ...myCanvas, showgrid: e.value })}
        />
        <span className="text-xs">{myCanvas.showgrid ? "On" : "Off"}</span>
      </div>
    </div>

    {/* --- Color picker --- */}
    <div>
      <span className="text-xs block mb-1">Background</span>
      <MyColorPicker
        OnChange={(newColor) => setMyCanvas({ ...myCanvas, color: newColor })}
      />
    </div>

    {/* --- Panel list --- */}
    <div className="flex-1 overflow-y-auto">
      <PanelList panels={panels} onEdit={onEdit} />
    </div>

    {/* --- Add Panel Modal --- */}
    {isPickerOpen && (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-white text-black rounded-lg p-4 w-80">
          <div className="text-base font-semibold mb-3">Add panel</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-neutral-200 hover:bg-neutral-300 py-2 rounded text-sm" onClick={() => addPanel("text")}>Text</button>
            <button className="bg-neutral-200 hover:bg-neutral-300 py-2 rounded text-sm" onClick={() => addPanel("video")}>Video</button>
            <button className="bg-neutral-200 hover:bg-neutral-300 py-2 rounded text-sm" onClick={() => addPanel("image")}>Image</button>
            <button className="bg-neutral-200 hover:bg-neutral-300 py-2 rounded text-sm" onClick={() => addPanel("carousel")}>Carousel</button>
          </div>
          <button
            className="mt-3 w-full bg-neutral-800 hover:bg-neutral-900 text-white rounded py-2 text-sm"
            onClick={() => setIsPickerOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </div>
);
}
