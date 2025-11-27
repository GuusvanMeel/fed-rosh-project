"use client";

import { PanelData, PanelType } from "@/app/types/panel";
import { panelRegistry } from "../panels/panelRegistry";
import { PanelWrapper } from "../panels/panelWrapper";
import { panelTypes } from "../canvas/canvasSideBar";
import { Button } from "@chakra-ui/react";
import Droppable, { Edge } from "./Droppable";
import { SortableContext } from "@dnd-kit/sortable";
import { useColors } from "@/app/design-patterns/DesignContext";
import { useEffect, useState } from "react";

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
  onPanelEdit
}: {
  data: SectionData;
  onChange: (updated: SectionData) => void;
  onDelete: () => void;
  onPanelEdit: (panelId: string) => void;
}) {
  const { primaryColor, secondaryColor } = useColors();

      const [hoveredPanelId, setHoveredPanelId] = useState<string | null>(null);
      const columns = data.dropZones.map(zoneId => {
  const hasChild = data.panels.some(p => p.dropZoneId === zoneId);
  return hasChild ? "auto" : "1fr";
}).join(" ");
 
const [pendingDrop, setPendingDrop] = useState<{
  dropzoneId: string | null;
  edge: Edge;
}>({ dropzoneId: null, edge: null });

function handleEdgeHover({ dropzoneId, edge }: { dropzoneId: string; edge: Edge; }) {
  setPendingDrop({ dropzoneId, edge });
  console.log("hier")
}



  // -----------------------------------------
  // Drop Zones
  // -----------------------------------------
  function addDropZone() {
    const newZoneId = `${data.id}-zone-${data.dropZones.length + 1}`;

    onChange({
      ...data,
      dropZones: [...data.dropZones, newZoneId]
    });
  }
  const handleEditClick = (e: React.MouseEvent, panelId: string) => {
        e.stopPropagation();
        if (onPanelEdit) {
            onPanelEdit(panelId);
        }
    };

  function removeDropZone(zoneId: string) {
    const newZones = data.dropZones.filter(z => z !== zoneId);
    const newPanels = data.panels.filter(p => p.dropZoneId !== zoneId);

    onChange({
      ...data,
      dropZones: newZones,
      panels: newPanels
    });
  }

  // -----------------------------------------
  // Create Panel
  // -----------------------------------------
  function addPanel(type: PanelType) {
    const id = "panel-" + crypto.randomUUID();

    const newPanel: PanelData = {
      i: id,
      x: 0,
      y: 0,
      w: 300,
      h: 100,
      dropZoneId: `${data.id}-zone-1`,
      panelProps:
        type === "countdown"
          ? {
              id,
              type,
              content: new Date(Date.now() + 100000).toString()
            }
          : type === "url"
          ? {
              id,
              type,
              content: ["New Panel", "https://www.youtube.com"]
            }
          : {
              id,
              type,
              content: "New Panel"
            },
      styling: {
        backgroundColor: primaryColor,
        textColor: secondaryColor
      }
    };

    onChange({
      ...data,
      panels: [...data.panels, newPanel]
    });
  }

  // -----------------------------------------
  // Render Panel
  // -----------------------------------------
  function renderPanel(panel: PanelData) {
    const entry = panelRegistry[panel.panelProps.type];
    if (!entry) return <div>Unknown panel type</div>;

    const Component = entry.component;
    const mappedProps = entry.mapProps(panel.panelProps.content, panel.styling);

    return (
      <PanelWrapper
        key={panel.i}
        panel={panel}
      >
        <Component {...mappedProps} />
      </PanelWrapper>
    );
  }


    
  // -----------------------------------------
  // Render
  // -----------------------------------------
  return (
    <div className="p-6 space-y-6 bg-gray-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="text-gray-400">⋮⋮</div>
          <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
        </div>

        <div className="flex gap-2">
          {panelTypes.map(type => (
            <Button
              key={type}
              size="xs"
              variant="surface"
              style={{
                backgroundColor: "rgba(0,128,0,0.85)",
                color: "white",
                borderRadius: "0.4rem",
                padding: "0.25rem 0.6rem",
                fontSize: "0.75rem"
              }}
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
              fontSize: "0.75rem"
            }}
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
              fontSize: "0.75rem"
            }}
            onClick={addDropZone}
          >
            Add Column
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: columns
        }}
      >
        {data.dropZones.map(zoneId => {
          const panelsInZone = data.panels.filter(
            p => p.dropZoneId === zoneId
          );

          return (
            <Droppable
              UID={zoneId}
              key={zoneId}
              OnDelete={() => removeDropZone(zoneId)}
              hasPanels={panelsInZone.length > 0}
              onEdgeHover={handleEdgeHover}
            >
              <SortableContext items={panelsInZone.map(p => p.i)} >
                {panelsInZone.map(panel => (
                  
                  <div className="relative rounded-lg"
                              key={panel.i}
                                onMouseEnter={() => setHoveredPanelId(panel.i)}
                                onMouseLeave={() => setHoveredPanelId(null)}>
                                  
                                    {renderPanel(panel)}
                                    
                                    {hoveredPanelId === panel.i && (
                                        <button
                                            onClick={(e) => handleEditClick(e, panel.i)}
                                            className="absolute top-0 right-0 w-7 h-7 !bg-blue-600 !hover:!bg-blue-700 rounded shadow-lg flex items-center justify-center transition-all duration-200 z-10 cursor-pointer"
                                            aria-label="Edit panel"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-white"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                    )}
                                </div> 
              
              ))}

                                
              </SortableContext>
            </Droppable>
          );
        })}
      </div>
    </div>
  );
}
