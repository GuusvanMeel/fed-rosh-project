'use client';
import React, { useState } from 'react';
import MyColorPicker from '../MyColorPicker';
import PanelList from '../panels/PanelList';
import { PanelData, PanelType } from '@/app/types/panel';
import { CanvasData } from '@/app/types/canvas';
import { panelRegistry } from '../panels/panelRegistry';
import { Switch, Button, Heading, ColorPicker, HStack, Portal, parseColor } from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";

export const panelTypes = Object.keys(panelRegistry) as (keyof typeof panelRegistry)[];



export default function PanelSettings({
  myCanvas,
  setMyCanvas,
  panels,
  setPanels,
  onEdit,
  onSave,
  onDelete
}: {
  myCanvas: CanvasData;
  setMyCanvas: React.Dispatch<React.SetStateAction<CanvasData>>;
  panels: PanelData[];
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
  onEdit: (id: string) => void;
  onSave: () => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const addPanel = (type: PanelType) => {
    const id = crypto.randomUUID();
     
        const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          panelProps: { id, type, content: "New Panel" },
          styling:{
          backgroundColor: "#ffff",
          textColor: "#030303"
          } 
          };
        setPanels(prev => [...prev, newPanel]);
    
    setIsPickerOpen(false);
  };


  return (
    <div className="flex flex-col gap-4 w-[400px] h-full p-4 bg-neutral-800 rounded-2xl text-white shadow-lg">
      {/* Header */}
      <div className="flex ml-2! items-center justify-between">
        <Heading size="lg">Canvas Settings</Heading>
        <Button rounded="l3" mr={5} mt={2} variant="subtle" onClick={onSave}>Save Page</Button>
      </div>

      
      {/* Mobile toggle */}
      <div className="flex ml-2! items-center justify-between mt-2">
        <Heading size="lg">Mobile View</Heading>

        <Switch.Root
        size="lg"
        checked={isMobile}
        variant={"raised"}
        mr={5}
        onCheckedChange={(e) => {
          const newMobile = e.checked; // this is the updated value
          setIsMobile(newMobile);
          const newWidth = newMobile ? 390 : 1280;
          const newHeight = newMobile ? 844 : 3000;
          setMyCanvas({
            ...myCanvas,
            Mobile: newMobile,
            Width: newWidth,
            Height: newHeight,
          });
        }}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb>
            <Switch.ThumbIndicator fallback={<HiX color="black" />}>
              <HiCheck />
            </Switch.ThumbIndicator>
          </Switch.Thumb>
        </Switch.Control>
      </Switch.Root>
      </div>

      {/* Background color picker */}
      <div className="ml-2!">

        <ColorPicker.Root 
          defaultValue={parseColor(myCanvas.color)}
          maxW="200px"
          className="border border-white/20 rounded-lg p-2 shadow-sm"
          onValueChange={(e) => setMyCanvas({ ...myCanvas, color: e.value.toString("hex") })}>
          <ColorPicker.HiddenInput />
          <Heading size="lg">Background Color</Heading>
          <ColorPicker.Control
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
              padding: "0.4rem",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}>
            <ColorPicker.Input />
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="xs" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
       
      </div>

      {/* Add Panel */}
      <Button 
        variant="subtle"
        className='w-2/4 self-center'
        onClick={() => setIsPickerOpen(true)}>＋ Add Panel</Button>



      {/* Panel list */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2">
        <PanelList panels={panels} onEdit={onEdit} onDelete={onDelete} />
      </div>

    {/* --- Add Panel Modal --- */}
    {isPickerOpen && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
    <div className="bg-neutral-800 text-white rounded-2xl p-6 w-[380px] shadow-2xl border border-white/10">
      <div className="text-lg font-semibold mb-4 text-center">
        Add Panel
      </div>

      <div className="grid grid-cols-2 gap-3">
        {panelTypes.map((type) => (
          <Button
            key={type}
            variant="surface"
            size="sm"
            className="bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-all duration-150"
            onClick={() => addPanel(type)}
          >
            {type === "scrollingText" ? "Scrolling Text" : type}
          </Button>
        ))}
      </div>

      <Button
        size="sm"
        variant="surface"
        onClick={() => setIsPickerOpen(false)}
        style={{
          marginTop: "1.25rem",
          width: "100%",
          borderRadius: "0.5rem",
          padding: "0.5rem",
          backgroundColor: "rgba(64,64,64,0.9)",
          color: "white",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(82,82,82,1)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(64,64,64,0.9)")}
      >
        Close
      </Button>
    </div>
  </div>
)}

  </div>
);
}
