"use client";

import { useState } from "react";

import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar, { getDefaultContent } from "../component/sidebar";
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SectionData } from "../component/Sections/Section";
import { PanelData } from "../types/panel";
import { panelRegistry } from "../component/panels/panelRegistry";
import { PanelWrapper } from "../component/panels/panelWrapper";
import { handleSectionDragEnd, handlePanelDragEnd } from "../hooks/handleDrags";
import { Edge } from "../component/Sections/Droppable";
import { useColors } from "../design-patterns/DesignContext";

export default function MovableColumnList() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [],  },
  ]);

 

   const [activePanelId, setActivePanelId] = useState<UniqueIdentifier | null>(null);

  // Get colors at the component level
  const { primaryColor, secondaryColor } = useColors();

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
    
   if (pendingDrop.edge === "left" || pendingDrop.edge === "right") {
  console.log("🟦 EDGE DROP TRIGGERED");
  
  const panelId = active.id as string;
  const { dropzoneId, edge } = pendingDrop;

  console.log("➡️ Panel ID:", panelId);
  console.log("➡️ Hovered Dropzone ID:", dropzoneId);
  console.log("➡️ Edge:", edge);

  if (!dropzoneId) {
    console.warn("❌ No dropzoneId found in pendingDrop.");
    return;
  }

  setSections(prev => {
    console.log("📂 PREV SECTIONS:", prev);

    // 1. Locate correct section
    const sectionIndex = prev.findIndex(s => s.dropZones.includes(dropzoneId));
    console.log("🔍 sectionIndex:", sectionIndex);

    if (sectionIndex === -1) {
      console.error("❌ Could not find section containing dropzone:", dropzoneId);
      return prev;
    }

    const section = prev[sectionIndex];
    console.log("📁 SECTION FOUND:", section);

    // 2. Locate dropzone index
    const dzIndex = section.dropZones.indexOf(dropzoneId);
    console.log("🔢 Dropzone index inside section:", dzIndex);
    
    if (dzIndex === -1) {
      console.error("❌ dropzoneId not found inside section.dropZones");
      return prev;
    }

    // 3. Create new dropzone ID
    const newZoneId = `${section.id}-zone-${crypto.randomUUID()}`;
    console.log("🆕 New Dropzone ID:", newZoneId);

    const newDropZones = [...section.dropZones];
    console.log("📜 Old DropZones:", section.dropZones);

    // Insert new dropzone left or right of hovered one
    if (edge === "left") {
      console.log("📥 Inserting new zone LEFT of", dropzoneId);
      newDropZones.splice(dzIndex, 0, newZoneId);
    } else {
      console.log("📥 Inserting new zone RIGHT of", dropzoneId);
      newDropZones.splice(dzIndex + 1, 0, newZoneId);
    }

    console.log("📜 New DropZones:", newDropZones);

    // 4. Move panel into new zone
    console.log("📦 OLD PANELS:", section.panels);

    const newPanels = section.panels.map(p => {
      if (p.i === panelId) {
        console.log("✅ MATCH: Moving panel", p.i, "into", newZoneId);
        return { ...p, dropZoneId: newZoneId };
      }
      return p;
    });

    const movedPanel = newPanels.find(p => p.i === panelId);
    if (movedPanel?.dropZoneId !== newZoneId) {
      console.error("❌ PANEL WAS NOT MOVED. Panel found:", movedPanel);
    } else {
      console.log("🎉 Panel successfully moved:", movedPanel);
    }

    // 5. Build updated section
    const updatedSection = {
      ...section,
      dropZones: newDropZones,
      panels: newPanels,
    };

    console.log("📦 UPDATED SECTION RESULT:", updatedSection);

    return prev.map((s, i) =>
      i === sectionIndex ? updatedSection : s
    );
  });

  console.log("🔄 Resetting pendingDrop");
  setPendingDrop({ dropzoneId: null, edge: null });

  console.log("⛔ STOPPING normal drag logic after edge drop.");
  return;
}

    
 
    if (!over) {
      console.log("No drop target found");
      return;
    }

    if (!active.id.toString().includes("sidebar")) {
      // Handle section and panel reordering
      handleSectionDragEnd({ event, setSections });
      handlePanelDragEnd({ event, setSections });
      setActivePanelId(null);
      return;
    }

    const panelId = active.id as string;
    const newZoneId = over.id as string;
    const newSectionId = newZoneId.split("-zone-")[0];

    console.log(`Panel ${panelId} dropped on zone ${newZoneId} in section ${newSectionId}`);

    setSections((prevSections) => {
      const draggedPanelData = active.data?.current?.panel;
      
      const isDraggedFromSidebar =
        panelId.startsWith("sidebar-") || 
        (draggedPanelData &&
          !prevSections.some((section) =>
            section.panels.some((p) => p.i === panelId)
          ));

      if (isDraggedFromSidebar) {
        console.log("Creating new panel from sidebar");

        let panelType: string;
        if (draggedPanelData) {
          panelType = draggedPanelData.panelProps.type;
        } else {
          panelType = panelId.split("-")[1];
        }

        // Use styling from dragged panel or current context colors
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
          styling: draggedPanelData?.styling || {
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "sans-serif",
            textColor: primaryColor,
            backgroundColor: secondaryColor,
            padding: 8,
            contentAlign: "left",
          },
        };

        console.log("New panel created with colors:", {
          textColor: newPanel.styling.textColor,
          backgroundColor: newPanel.styling.backgroundColor
        });

        return prevSections.map((section) => {
          if (section.id === newSectionId) {
            return {
              ...section,
              panels: [...section.panels, newPanel],
            };
          }
          return section;
        });
      }

      // Handle moving existing panels
      let panelToMove: PanelData | null = null;
      let sourceSectionId: string | null = null;
      console.log("hier")
      for (const section of prevSections) {
        const panel = section.panels.find((p) => p.i === panelId);
        if (panel) {
          panelToMove = panel;
          sourceSectionId = section.id;
          console.log(section.id);
          console.log(panel.i);
          break;
        }
      }

      if (!panelToMove || !sourceSectionId) return prevSections;

      const updatedPanel = { ...panelToMove, dropZoneId: newZoneId };

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

      return prevSections.map((section) => {
        if (section.id === sourceSectionId) {
          return {
            ...section,
            panels: section.panels.filter((p) => p.i !== panelId),
          };
        }
        if (section.id === newSectionId) {
          return {
            ...section,
            panels: [...section.panels, updatedPanel],
          };
        }
        return section;
      });
    });

    setActivePanelId(null);
  };

   return (
    <Provider>
      <div className="flex w-full h-screen">
         <DndContext 
          onDragStart={({ active }) => {
        setActivePanelId(active.id);
        }}
          onDragEnd={(event) => {
            handleDragEnd(event)
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