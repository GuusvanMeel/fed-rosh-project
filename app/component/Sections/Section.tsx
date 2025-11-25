"use client";

import { PanelData, PanelType } from "@/app/types/panel";
import { panelRegistry } from "../panels/panelRegistry";
import { PanelWrapper } from "../panels/panelWrapper";
import { panelTypes } from "../canvas/canvasSideBar";
import { Button } from "@chakra-ui/react";
import Droppable from "./Droppable";
import { SortableContext } from "@dnd-kit/sortable";

export interface SectionData {
    id: string;
    name: string;
    panels: PanelData[];
    dropZones: string[];
}

export default function Section({
    data,
    onChange,
    onDelete,
}: {
    data: SectionData;
    onChange: (updated: SectionData) => void;
    onDelete: () => void;
    onPanelEdit?: (panelId: string) => void;
}) {
  
    
function removeDropZone(zoneId: string) {

  // 1. Remove zone from list
  const newZones = data.dropZones.filter(z => z !== zoneId);

  // 2. Reassign any panels that used this zone
  const newPanels = data.panels.filter(p => p.dropZoneId !== zoneId);

  // 3. Notify parent
  onChange({
    ...data,
    dropZones: newZones,
    panels: newPanels
  });
}
 
    const addPanel = (type: PanelType) => {
        const id = "panel" + crypto.randomUUID();
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
            <PanelWrapper key={panel.i} panel={panel}>
                <Component {...mappedProps} />
            </PanelWrapper>
        );
    };
    const addDropZone = () => {
  const newZoneId = `${data.id}-zone-${data.dropZones.length + 1}`;

  onChange({
    ...data,
    dropZones: [...data.dropZones, newZoneId],
  });
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
            <Button
  size="xs"
  variant="surface"
  style={{
    backgroundColor: "rgba(0,0,160,0.8)",
    color: "white",
    borderRadius: "0.4rem",
    padding: "0.25rem 0.6rem",
    fontSize: "0.75rem",
  }}
  onClick={addDropZone}
>
  Add Column
</Button>
          </div>
        </div>
        
        
     
      <div >
        
        <div
  className={`grid gap-4`}
  style={{ gridTemplateColumns: `repeat(${data.dropZones.length}, 1fr)` }}
>
  {data.dropZones.map((zoneId) => {
  // 1. Get all panels inside this zone
  const panelsInZone = data.panels.filter(
    (panel) => panel.dropZoneId === zoneId
  );

  return (
    <Droppable UID={zoneId} key={zoneId} OnDelete={() => removeDropZone(zoneId)}>
      {/* 2. SortableContext MUST get the IDs of items in this zone */}
      <SortableContext items={panelsInZone.map((p) => p.i)} >    
          {/* 3. Render sortable panels */}
          {panelsInZone.map((panel) => renderPanel(panel))}
       
      </SortableContext>
    </Droppable>
  );
})}
</div>
      </div>
 
        
     </div>
    
  );
}