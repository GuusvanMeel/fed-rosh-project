"use client";

import { PanelData, PanelType } from "@/app/types/panel";
import { panelRegistry } from "../panels/panelRegistry";
import { PanelWrapper } from "../panels/panelWrapper";
import { panelTypes } from "../canvas/canvasSideBar";
import { Button } from "@chakra-ui/react";
import { DndContext, DragEndEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import Droppable from "./Droppable";

export interface SectionData {
    id: string;
    name: string;
    panels: PanelData[];
}

export default function Section({
    data,
    onChange,
    onDelete,

}: {
    data: SectionData;
    onChange: (updated: SectionData) => void;
    onDelete: () => void;

}) {
  
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Prevents accidental drags
    },
  })
);

    

    const addPanel = (type: PanelType) => {
        const id = crypto.randomUUID();
        if (type == "countdown")
        {  console.log("hier")
          const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          dropZoneId: `${data.id}-zone-1`,
          panelProps: { id, type, content: (new Date(Date.now() + 100000).toString())},
          styling:{
          backgroundColor: "#ffff",
          textColor: "#030303"
          } 
          };
        onChange({ ...data, panels: [...data.panels, newPanel] });
        }else if (type == "url")
        {   
          const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          dropZoneId: `${data.id}-zone-1`,
          panelProps: { id, type, content: (["New Panel" , "https://www.youtube.com"])},
          styling:{
          backgroundColor: "#ffff",
          textColor: "#030303"
          } 
          };
        onChange({ ...data, panels: [...data.panels, newPanel] });
        } else{
            console.log(type)
        const newPanel: PanelData = {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          dropZoneId: `${data.id}-zone-1`,
          panelProps: { id, type, content: "New Panel" },
          styling:{
          backgroundColor: "#ffff",
          textColor: "#030303"
          } 
          };

        onChange({ ...data, panels: [...data.panels, newPanel] });
    }};

    const renderPanel = (panel: PanelData) => {
        const entry = panelRegistry[panel.panelProps.type];
        if (!entry) return <div>Unknown panel type</div>;
        const Component = entry.component;
        const mappedProps = entry.mapProps(panel.panelProps.content);

        return (
            <PanelWrapper panel={panel}>
                <Component {...mappedProps} />
            </PanelWrapper>
        );
    };

    return (
    
      <div
        className="p-6 space-y-6 bg-gray-100 cursor-grab active:cursor-grabbing select-none"
       
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="text-gray-400 hover:text-gray-600">
              ⋮⋮
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {data.name}
            </h2>
          </div>
          <div className="flex gap-2">
            {panelTypes.map((type) => (
              <Button
                key={type}
                size="xs"
                variant="surface"
                style={{
                  backgroundColor: "rgba(0,128,0,0.85)",
                  color: "white",
                  borderRadius: "0.4rem",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(0,160,0,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(0,128,0,0.85)")
                }
                onClick={() => addPanel(type)}
              >
                {type === "scrollingText" ? "Scrolling Text" : type}
              </Button>
            ))}

            <Button
              size="xs"
              variant="surface"
              style={{
                backgroundColor: "rgba(153,27,27,0.9)",
                color: "white",
                borderRadius: "0.4rem",
                padding: "0.25rem 0.6rem",
                fontSize: "0.75rem",
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(185,28,28,1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(153,27,27,0.9)")
              }
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        
        
     
      <div className="grid grid-cols-4 gap-4">
        
        <Droppable UID={`${data.id}-zone-1`}>
            <div className="space-y-2">
              {data.panels
                .filter(panel => panel.dropZoneId === `${data.id}-zone-1`)
                .map(panel => renderPanel(panel))
              }
            </div>
          </Droppable>
        <Droppable UID={`${data.id}-zone-2`}>
            <div className="space-y-2">
              {data.panels
                .filter(panel => panel.dropZoneId === `${data.id}-zone-2`)
                .map(panel => renderPanel(panel))
              }
            </div>
          </Droppable>
          
          <Droppable UID={`${data.id}-zone-3`}>
            <div className="space-y-2">
              {data.panels
                .filter(panel => panel.dropZoneId === `${data.id}-zone-3`)
                .map(panel => renderPanel(panel))
              }
            </div>
          </Droppable>
          
          <Droppable UID={`${data.id}-zone-4`}>
            <div className="space-y-2">
              {data.panels
                .filter(panel => panel.dropZoneId === `${data.id}-zone-4`)
                .map(panel => renderPanel(panel))
              }
            </div>
          </Droppable>
      </div>
 
        
     </div>
    
  );
}