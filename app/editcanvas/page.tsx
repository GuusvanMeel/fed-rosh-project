import React from 'react'
import Canvas from '../component/Canvas'
import { CanvasData } from '../component/Canvas'
import Counter from '../component/Counter';
import MyColorPicker from '../component/MyColorPicker';
import { InputSwitch } from "primereact/inputswitch";
import { redirect } from 'next/dist/server/api-utils';
import axios from 'axios';
import PanelSettings, { PanelSettingsProps } from '../component/panelsettings/PanelSettings';
import { Layout } from 'react-grid-layout';

export type PanelType = "text" | "video" | "image" | "carousel";

export type PanelData = {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	type: PanelType;
	content: string | string[];
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

  // // if you only want the first page:
  // const firstPage: PanelSettingsProps = pages[0];
  //const panels: Layout[] = firstPage.panels as Layout[];
  const emptyPanels: PanelData[] = [{
    i: "1",
    x: 4,
    y: 3,
    w: 2,
    h: 5,
    type: 'text',
    content: 'TEST TEST',
    isDraggable: true,
    backgroundColor: '#34eb5e',
    textColor: '#34eb5e',
    fontFamily: 'Serif'
  }];
  

    return (
        <div className="flex gap-6 items-start">

        <button
        >Add panel</button>
        
  

  {/* Controls on the right */}
  <PanelSettings width={370} 
        height={780}
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
                type: 'text',
                content: 'Panel 1',
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
                type: 'image',
                content: '/next.svg',
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
                type: 'video',
                content: '/window.svg',
                isDraggable: true,
                backgroundColor: '#1e3a8a',
                textColor: '#ffffff',
                fontFamily: 'Serif'
            }
        ] }></PanelSettings>
</div>
  )
}


