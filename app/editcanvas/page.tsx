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


export default async function page() {
  const response = await axios.get('http://localhost:3000/api/editcanvas');
  const pages = response.data.data; // extract the "data" array from the API

  // if you only want the first page:
  const firstPage: PanelSettingsProps = pages[0];
  const panels: Layout[] = firstPage.panels as Layout[];
 
    
  
    return (
        <div className="flex gap-6 items-start">
        
  

  {/* Controls on the right */}
  <PanelSettings width={firstPage.width} height={firstPage.height} color={firstPage.color} columns={firstPage.columns} rows={firstPage.rows} panels={panels} ></PanelSettings>
</div>
  )
}


