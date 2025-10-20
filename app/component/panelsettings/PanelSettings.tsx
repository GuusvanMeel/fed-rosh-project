'use client'
import React from 'react'
import Counter from '../Counter'
import { useState, useEffect } from 'react';
import { CanvasData } from '../Canvas';
import { InputSwitch } from 'primereact/inputswitch';
import MyColorPicker from '../MyColorPicker';
import Canvas from '../Canvas';
import { Layout } from 'react-grid-layout';
import PageSelectDropdown from '../pageselectdropdown/PageSelectDropdown';
import { PanelData, PanelType } from '@/app/editcanvas/page';
import { PanelProps } from '../panel';

export type PanelSettingsProps = {
  id?: string
  width: number
  height: number
  mobile: boolean
  color: string
  columns: number
  rows: number
  panels?: PanelData[]
}

export default function PanelSettings( {width, height, color, columns, rows, panels}: PanelSettingsProps) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const [myCanvas, setMyCanvas] = useState<CanvasData>({
        Width:  width ? width : 370,
        Height: height ? height :780,
        Mobile: true,
        color: color ? color : "#1e3a8a", // Tailwind bg-blue-900 hex
        columns: columns? columns : 20,
        rows: rows ? rows : 10,
        showgrid: true,
        panels: Array.isArray(panels) ? panels : []
            
    });

    const [selectedpage, setSelectedPage] = useState<PanelSettingsProps | null>(null);
    
    // Use useEffect to handle selectedpage changes
    useEffect(() => {
        if (selectedpage != null) {
            setMyCanvas({
                Width: selectedpage.width ?? 370,
                Height: selectedpage.height ?? 780,
                Mobile: selectedpage.mobile ?? true,
                color: selectedpage.color ?? "#1e3a8a",
                columns: selectedpage.columns ?? 20,
                rows: selectedpage.rows ?? 10,
                showgrid: myCanvas.showgrid, // preserve current showgrid state
                panels: selectedpage?.panels
                    ? Array.isArray(selectedpage.panels)
                        ? selectedpage.panels
                        : [selectedpage.panels]
                    : []
            });
        }
    }, [selectedpage]);
    const addPanel = (type: PanelType) => {
        const id = crypto.randomUUID();
        const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          panelProps: {
            id,
            type,
            content:
              type === "text"
                ? "New text panel"
                : type === "image"
                ? "/placeholder.jpg"
                : type === "video"
                ? "https://example.com/video.mp4"
                : [],
          },
          isDraggable: true,
          backgroundColor: "#1e3a8a",
          textColor: "#ffffff",
          fontFamily: "Serif",
        };
      
        setMyCanvas(prev => ({
          ...prev,
          panels: [...prev.panels, newPanel],
        }));
        setIsPickerOpen(false);
      };
      

    
    
    return (
        <>
        <button onClick={() => setIsPickerOpen(true)} className="bg-neutral-600 px-4 py-3 rounded-xl text-2xl leading-none">+</button>
        
            <div className="flex flex-col gap-2">
                <PageSelectDropdown onSelectionChange={setSelectedPage}></PageSelectDropdown>

                <div className="flex items-center gap-2">
                    <InputSwitch
                        checked={myCanvas.Mobile}
                        onChange={(e) =>
                            setMyCanvas({ ...myCanvas, Mobile: e.value })
                        }
                    />
                    <span className="text-sm text-white">{myCanvas.Mobile ? "Mobile" : "Desktop"}</span>
                </div>
                <Counter
                    value={myCanvas.rows}
                    label={"Amount of rows :" + myCanvas.rows}
                    OnChange={(newRow) =>
                        setMyCanvas({ ...myCanvas, rows: newRow })
                    }
                />
                <Counter
                    value={myCanvas.columns}
                    label={"Amount of columns :" + myCanvas.columns}
                    OnChange={(newColumns) =>
                        setMyCanvas({ ...myCanvas, columns: newColumns })
                    }
                />
                <div className="flex items-center gap-2">
                    <InputSwitch
                        checked={myCanvas.showgrid}
                        onChange={(e) =>
                            setMyCanvas({ ...myCanvas, showgrid: e.value })
                        }
                    />
                    <span className="text-sm text-white">{myCanvas.showgrid ? "Grid ON" : "Grid OFF"}</span>
                </div>
                <MyColorPicker OnChange={(newColor) => setMyCanvas({ ...myCanvas, color: newColor })} />
            </div>

            <Canvas settings={myCanvas}  />
            {isPickerOpen && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center">
					<div className="bg-white text-black rounded-lg p-6 w-96">
						<div className="text-lg font-semibold mb-4">Add panel</div>
                        <div className="grid grid-cols-3 gap-3">
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("text")}>Text</button>
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("video")}>Video</button>
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("image")}>Image</button>
							<button className="bg-neutral-200 rounded py-3" onClick={() => addPanel("carousel")}>Image Carousel</button>
                        </div>
						<button className="mt-4 w-full bg-neutral-800 text-white rounded py-2" onClick={() => setIsPickerOpen(false)}>Close</button>
					</div>
				</div>
			)}
        </>
    )

}