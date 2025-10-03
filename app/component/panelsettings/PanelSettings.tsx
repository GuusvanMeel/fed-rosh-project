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

export type PanelSettingsProps = {
  id?: string
  width: number
  height: number
  color: string
  columns: number
  rows: number
  panels?: Layout[]
}

export default function PanelSettings( {width, height, color, columns, rows, panels}: PanelSettingsProps) {
    
    const [myCanvas, setMyCanvas] = useState<CanvasData>({
        Width:  width ? width : 370,
        Height: height ? height :780,
        color: color ? color : "#1e3a8a", // Tailwind bg-blue-900 hex
        columns: columns? columns : 20,
        rows: rows ? rows : 10,
        showgrid: true,
        panels: panels ? panels : [
            { i: "1", x: 0, y: 0, w: 2, h: 2 },
            { i: "2", x: 2, y: 0, w: 2, h: 4 },
            { i: "3", x: 4, y: 0, w: 2, h: 5 },
        ]
    });

    const [selectedpage, setSelectedPage] = useState<PanelSettingsProps | null>(null);
    
    // Use useEffect to handle selectedpage changes
    useEffect(() => {
        if (selectedpage != null) {
             if (selectedpage.panels != null) {
            console.log(selectedpage.panels[0].x + " " +selectedpage.panels[0].y  + " " + selectedpage.panels[0].w + " "  + selectedpage.panels[0].h )
             }
            setMyCanvas({
                Width: selectedpage.width ?? 370,
                Height: selectedpage.height ?? 780,
                color: selectedpage.color ?? "#1e3a8a",
                columns: selectedpage.columns ?? 20,
                rows: selectedpage.rows ?? 10,
                showgrid: myCanvas.showgrid, // preserve current showgrid state
                panels: selectedpage?.panels ?? [
                    { i: "1", x: 0, y: 0, w: 2, h: 2 },
                    { i: "2", x: 2, y: 0, w: 2, h: 4 },
                    { i: "3", x: 4, y: 0, w: 2, h: 5 },
                ]
            });
        }
    }, [selectedpage]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <PageSelectDropdown onSelectionChange={setSelectedPage}></PageSelectDropdown>
                <span>Dropdown value id: {selectedpage?.id || 'No selection'}</span>

                <Counter
                    value={myCanvas.Height}
                    label={"Height of canvas " + myCanvas.Height + "px"}
                    OnChange={(newHeight) =>
                        setMyCanvas({ ...myCanvas, Height: newHeight })
                    }
                />
                <Counter
                    value={myCanvas.Width}
                    label={"Width of canvas :" + myCanvas.Width + "px"}
                    OnChange={(newWidth) =>
                        setMyCanvas({ ...myCanvas, Width: newWidth })
                    }
                />
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

            <Canvas settings={myCanvas} />
        </>
    )
}
