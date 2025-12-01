"use client";

import { useState, useRef, useEffect } from "react";

import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar, { getDefaultContent } from "../component/sidebar";
import { DndContext, DragEndEvent, DragOverlay, Modifier, UniqueIdentifier } from "@dnd-kit/core";
import { SectionData } from "../component/Sections/Section";
import { PanelData } from "../types/panel";
import { panelRegistry } from "../component/panels/panelRegistry";
import { PanelWrapper } from "../component/panels/panelWrapper";
import { handleSectionDragEnd, handlePanelDragEnd } from "../hooks/handleDrags";
import { Edge } from "../component/Sections/Droppable";
import { ColorProvider, useColors } from "../design-patterns/DesignContext";

function MovableColumnListInner() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [],  },
  ]);

  const [activePanelId, setActivePanelId] = useState<UniqueIdentifier | null>(null);

  // Get colors at the component level
  const { primaryColor, secondaryColor } = useColors();
  
  // Store current colors in refs so they're always up-to-date
  const primaryColorRef = useRef(primaryColor);
  const secondaryColorRef = useRef(secondaryColor);
  
  useEffect(() => {
    primaryColorRef.current = primaryColor;
    secondaryColorRef.current = secondaryColor;
  }, [primaryColor, secondaryColor]);

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
    console.log("Drag end triggered");
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

        // Use refs to get the CURRENT color values at drop time
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
            textColor: primaryColorRef.current,  // ✅ Use ref value
            backgroundColor: secondaryColorRef.current,  // ✅ Use ref value
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

      for (const section of prevSections) {
        const panel = section.panels.find((p) => p.i === panelId);
        if (panel) {
          panelToMove = panel;
          sourceSectionId = section.id;
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
    <div className="flex w-full h-screen">
      <DndContext 
        onDragStart={({ active }) => {
          setActivePanelId(active.id);
        }}
        onDragEnd={(event) => {
          handleDragEnd(event)
          handleSectionDragEnd({ event, setSections });
          handlePanelDragEnd({ event, setSections });
          setActivePanelId(null);
        }}
        onDragCancel={() => setActivePanelId(null)}
      >
        <Sidebar/>
        <SectionCanvas sections={sections} setSections={setSections} setPendingDrop={setPendingDrop} />
        <DragOverlay> 
          {activePanelId ? renderPanelById(activePanelId) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default function MovableColumnList() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [],  },
  ]);

  return (
    <Provider>
      <ColorProvider sections={sections} setSections={setSections}>
        <MovableColumnListInner />
      </ColorProvider>
    </Provider>
  );
}