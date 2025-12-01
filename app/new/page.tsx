"use client";

import { useState } from "react";

import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar from "../component/sidebar";
import { DndContext, DragEndEvent, DragOverlay, Modifier, UniqueIdentifier } from "@dnd-kit/core";
import { SectionData } from "../component/Sections/Section";
import { PanelData } from "../types/panel";
import { panelRegistry } from "../component/panels/panelRegistry";
import { PanelWrapper } from "../component/panels/panelWrapper";

import { handleSectionDragEnd, handlePanelDragEnd } from "../hooks/handleDrags";
import { Edge } from "../component/Sections/Droppable";


export default function MovableColumnList() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [],  },
  ]);

 

   const [activePanelId, setActivePanelId] = useState<UniqueIdentifier | null>(null);


  function renderPanelById(id: UniqueIdentifier) {
    const panel = sections.flatMap(s => s.panels).find(p => p.i === id);
    if (!panel) return null;
   
    const entry = panelRegistry[panel.panelProps.type];
    const Component = entry.component;
    const mappedProps = entry.mapProps(panel.panelProps.content);
   
    return (
      <div style={{ opacity: 0.5 }}>
    <PanelWrapper panel={panel}>
      <Component {...mappedProps} />
    </PanelWrapper>
  </div>
    );
  }

  const [pendingDrop, setPendingDrop] = useState<{
    dropzoneId: string | null;
    edge: Edge;
  }>({ dropzoneId: null, edge: null });

  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event;
    
    console.log("Drag ended:", {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data,
      overData: over?.data,
    });
    if (pendingDrop.edge === "left" || pendingDrop.edge === "right") {
  console.log("Edge Drop detected:", pendingDrop);
  

  const panelId = active.id as string;
  const { dropzoneId, edge } = pendingDrop;
  if (!dropzoneId) return;

  setSections(prev => {
    // 1. Find section containing this dropzone
    const sectionIndex = prev.findIndex(s => s.dropZones.includes(dropzoneId));
    if (sectionIndex === -1) return prev;

    const section = prev[sectionIndex];
    const dzIndex = section.dropZones.indexOf(dropzoneId);

    const newDropZones = [...section.dropZones];
    const newZoneId = crypto.randomUUID();

    // Insert before or after
    if (edge === "left") {
      newDropZones.splice(dzIndex, 0, newZoneId);
    } else {
      newDropZones.splice(dzIndex + 1, 0, newZoneId);
    }

    // Move panel into this new zone
    const newPanels = section.panels.map(p =>
      p.i === panelId ? { ...p, dropZoneId: newZoneId } : p
    );

    const updatedSection = {
      ...section,
      dropZones: newDropZones,
      panels: newPanels,
    };

    return prev.map((s, i) => i === sectionIndex ? updatedSection : s);
  });

  // Reset pending drop
  setPendingDrop({ dropzoneId: null, edge: null });
  return;   // ⬅️ STOP normal logic
}
    

    if (!over) {
      console.log("No drop target found");
      return;
    }

    if (!active.id.toString().includes("sidebar")) return;

    const panelId = active.id as string;
    const newZoneId = over.id as string;

    // Extract section ID from zone ID (e.g., "section-1-zone-2" -> "section-1")
    const newSectionId = newZoneId.split("-zone-")[0];

    console.log(
      `Panel ${panelId} dropped on zone ${newZoneId} in section ${newSectionId}`
    );

    setSections((prevSections) => {
      // Check if this is a new panel from sidebar - look at the active data instead of ID
      const draggedPanelData = active.data?.current?.panel;
      const isDraggedFromSidebar =
        panelId.startsWith("sidebar-") || 
        (draggedPanelData &&
          !prevSections.some((section) =>
            section.panels.some((p) => p.i === panelId)
          ));

      if (isDraggedFromSidebar) {
        console.log("Creating new panel from sidebar");

        // If we have panel data from the drag, use it; otherwise extract from ID
        let panelType: string;
        if (draggedPanelData) {
          panelType = draggedPanelData.panelProps.type;
          console.log("Using panel data from drag:", draggedPanelData);
        } else {
          panelType = panelId.split("-")[1];
          console.log("Extracting panel type from ID:", panelType);
        }

        // Create a new panel instance
        const newPanel: PanelData = {
          i: crypto.randomUUID(),
          x: 0,
          y: 0,
          w: 300,
      h: 100,
          dropZoneId: newZoneId,
          panelProps: {
            id: crypto.randomUUID(),
            type: panelType,
            content: getDefaultContent(panelType),
            currentIndex: 1,
            layout: undefined,
          },
          styling:
            draggedPanelData?.styling || {
              borderRadius: 8,
              fontSize: 14,
              fontFamily: "sans-serif",
              textColor: "#000000",
              padding: 8,
              contentAlign: "left",
            },
        };

        console.log("New panel created:", newPanel);

        // Add new panel to target section
        const updatedSections = prevSections.map((section) => {
          if (section.id === newSectionId) {
            console.log(`Adding panel to section ${newSectionId}`);
            return {
              ...section,
              panels: [...section.panels, newPanel],
            };
          }
          return section;
        });

        console.log("Updated sections:", updatedSections);
        return updatedSections;
      }

      // Existing logic for moving panels between zones
      let panelToMove: PanelData | null = null;
      let sourceSectionId: string | null = null;

      for (const section of prevSections) {
        const panel = section.panels.find((p) => p.i === panelId);
        if (panel) {
          panelToMove = panel;
          sourceSectionId = section.id;
          break;
        }
      }

      if (!panelToMove || !sourceSectionId) return prevSections;

      // Update the panel's dropZoneId
      const updatedPanel = { ...panelToMove, dropZoneId: newZoneId };

      // If moving within the same section, just update the dropZoneId
      if (sourceSectionId === newSectionId) {
        return prevSections.map((section) => {
          if (section.id === sourceSectionId) {
            return {
              ...section,
              panels: section.panels.map((p) =>
                p.i === panelId ? updatedPanel : p
              ),
            };
          }
          return section;
        });
      }

      // Moving between sections: remove from source, add to target
      return prevSections.map((section) => {
        if (section.id === sourceSectionId) {
          // Remove panel from source section
          return {
            ...section,
            panels: section.panels.filter((p) => p.i !== panelId),
          };
        }
        if (section.id === newSectionId) {
          // Add panel to target section
          return {
            ...section,
            panels: [...section.panels, updatedPanel],
          };
        }
        return section;
      });
    });
  };

  // Helper function to get default content for each panel type
  function getDefaultContent(panelType: string): string | string[] {
    switch (panelType) {
      case "text":
        return "Sample text content";
      case "video":
        return "https://example.com/sample-video.mp4";
      case "image":
        return "/globe.svg";
      case "countdown":
        return new Date(Date.now() + 24 * 60 * 60 * 1000).getTime().toString();
      case "scrollingText":
        return "This is scrolling text content";
      case "url":
        return ["Click here", "https://example.com"];
      case "bracket":
        return "Tournament Bracket";
      default:
        return "Default content";
    }
  }

  return (
    <Provider>
      <div className="flex w-full h-screen">
         <DndContext 
          onDragStart={({ active }) => {
        setActivePanelId(active.id);
        }}
          onDragEnd={(event) => {
            handleDragEnd(event)
            handleSectionDragEnd({ event, setSections });  // 🔵 handles section reordering
            handlePanelDragEnd({ event, setSections });    // 🔴 your existing panel movement logic
            setActivePanelId(null);
          }}
            onDragCancel={() => setActivePanelId(null)}>
          <Sidebar/>
          <SectionCanvas sections={sections} setSections={setSections} setPendingDrop={setPendingDrop} />
          <DragOverlay > 
            {activePanelId ? renderPanelById(activePanelId) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </Provider>
  );
}