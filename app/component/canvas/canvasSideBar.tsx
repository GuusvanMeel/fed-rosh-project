'use client'
import React from 'react'
import { useState } from 'react';
import { CanvasData } from './Canvas';
import { InputSwitch } from 'primereact/inputswitch';
import MyColorPicker from '../MyColorPicker';
import { PanelData, PanelType } from '@/app/page';
import { url } from 'inspector';

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
  setPanels
}: {
  myCanvas: CanvasData;
  setMyCanvas: React.Dispatch<React.SetStateAction<CanvasData>>;
  panels: PanelData[];
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const addPanel = (type: PanelType) => {
    const id = crypto.randomUUID();
    switch(type){

      case "url": {
        const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          panelProps: { id, type, content: ["New Panel", "https://www.youtube.com"] },
          backgroundColor: "#1e3a8a",
        };
        setPanels(prev => [...prev, newPanel]);
        break;
      }

      case "countdown": {
        
        const date : string = (Date.now() + 100000).toString();

        const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,

          panelProps: { id, type, content: date},
          backgroundColor: "#1e3a8a",
        };
        setPanels(prev => [...prev, newPanel]);
        break;
      }
      

      default : {
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
        break
      }
   

    }
    
    setIsPickerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 w-[400px]">
      <button
        onClick={() => setIsPickerOpen(true)}
        className="bg-neutral-600 px-4 py-3 rounded-xl text-2xl leading-none"
      >
        +
      </button>

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

        <span className="text-sm text-white">
          {myCanvas.Mobile ? "Mobile" : "Desktop"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <InputSwitch
          checked={myCanvas.showgrid}
          onChange={(e) =>
            setMyCanvas({ ...myCanvas, showgrid: e.value })
          }
        />
        <span className="text-sm text-white">
          {myCanvas.showgrid ? "Grid ON" : "Grid OFF"}
        </span>
      </div>

      <MyColorPicker
        OnChange={(newColor) =>
          setMyCanvas({ ...myCanvas, color: newColor })
        }
      />

      {isPickerOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg p-6 w-96">
            <div className="text-lg font-semibold mb-4">Add panel</div>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => addPanel("text")}>Text</button>
              <button onClick={() => addPanel("video")}>Video</button>
              <button onClick={() => addPanel("image")}>Image</button>
              <button onClick={() => addPanel("countdown")}>countdown</button>
              <button onClick={() => addPanel("scrollingText")}>Scrolling Text</button>
              <button onClick={() => addPanel("url")}>Url</button>
              <button onClick={() => addPanel("bracket")}>Bracket</button>
            </div>
            <button
              className="mt-4 w-full bg-neutral-800 text-white rounded py-2"
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
