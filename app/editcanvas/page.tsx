import React from 'react'

import PanelSettings, { PanelSettingsProps } from '../component/panelsettings/PanelSettings';
import { PanelProps } from '../component/panel';


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

const emptyPanels: PanelData[] = [];



export default async function page() {
  // const response = await axios.get('http://localhost:3000/api/editcanvas');
  // const pages = response.data.data; // extract the "data" array from the API


  
  

    return (
        <div className="flex gap-6 items-start">
        <button
        >Add panel</button>
        
  

  {/* Controls on the right */}
  <PanelSettings width={370} 
        height={780}
        mobile= {true}
        color="#1e3a8a" // Tailwind bg-blue-900 hex
        columns={20}
        rows={10}
        panels={[
            {
                i: "1",
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                panelProps:{
                  id: "1",
                type: 'text',
                content: 'Panel 1',
                },
                isDraggable: true,
                backgroundColor: '#1e3a8a',
                textColor: '#ffffff',
                fontFamily: 'Serif'
            },
            {
                i: "2",
                x: 2,
                y: 0,
                w: 2,
                h: 4,
                panelProps:{
                  id:"2",
                type: 'image',
                content: '/next.svg',
                },
                isDraggable: true,
                backgroundColor: '#1e3a8a',
                textColor: '#ffffff',
                fontFamily: 'Serif'
            },
            {
                i: "3",
                x: 4,
                y: 0,
                w: 2,
                h: 5,
                panelProps:{
                  id: "3",
                type: 'video',
                content: '/window.svg',
                },               
                isDraggable: true,
                backgroundColor: '#1e3a8a',
                textColor: '#ffffff',
                fontFamily: 'Serif'
            }
        ] }></PanelSettings>
</div>
  )
}


