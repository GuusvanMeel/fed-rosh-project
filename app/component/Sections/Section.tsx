"use client";

import { PanelData, PanelType } from "@/app/types/panel";
import { AllPanelProps, panelRegistry } from "../panels/panelRegistry";
import { PanelWrapper } from "../panels/panelWrapper";
import { Button } from "@chakra-ui/react";
import Droppable, { Edge } from "./Droppable";
import { SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";

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
  setPendingDrop,
  onRequestAddPanel,
}: {
  data: SectionData;
  onChange: (updated: SectionData) => void;
  onDelete: () => void;
  setPendingDrop: (info: { dropzoneId: string; edge: Edge }) => void;
  onRequestAddPanel: (zoneId: string) => void;
}) {

  const columns = data.dropZones.map(zoneId => {
    const hasChild = data.panels.some(p => p.dropZoneId === zoneId);
    return hasChild ? "auto" : "1fr";
  }).join(" ");




  // -----------------------------------------
  // Drop Zones
  // -----------------------------------------
  function addDropZone() {
    if (data.dropZones.length > 5) return;
    const newZoneId = `${data.id}-zone-${crypto.randomUUID()}`;

    onChange({
      ...data,
      dropZones: [...data.dropZones, newZoneId]
    });
  }


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
  // Render Panel
  // -----------------------------------------
  function renderPanel(panel: PanelData) {
    const entry = panelRegistry[panel.panelProps.type];

    const Component = entry.component as React.ComponentType<AllPanelProps>;
    const mappedProps = entry.mapProps(panel.panelProps.content, panel.styling);

    return (
      <PanelWrapper key={panel.i} panel={panel}>
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
        </div>

        <div className="flex gap-2">
          

          <Button
            size="xs"
            variant="surface"
            style={{
              backgroundColor: "black",
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
              onEdgeHover={setPendingDrop}
              onOpenPanelModal={onRequestAddPanel}
            >
              <SortableContext items={panelsInZone.map(p => p.i)} >
                {panelsInZone.map(panel => (

                  <div className="relative rounded-lg"
                    key={panel.i}
                  >

                    {renderPanel(panel)}


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