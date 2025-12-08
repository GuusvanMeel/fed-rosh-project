"use client";

import { useState, useRef, useEffect } from "react";

import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar, { getDefaultContent } from "../component/sidebar";
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SectionData } from "../component/Sections/Section";
import { PanelData, PanelType } from "../types/panel";
import { AllPanelProps, isPanelType, panelRegistry } from "../component/panels/panelRegistry";
import { PanelWrapper } from "../component/panels/panelWrapper";
import { handleSectionDragEnd, handlePanelDragEnd } from "../hooks/handleDrags";
import { Edge } from "../component/Sections/Droppable";
import { ColorProvider, useColors } from "../design-patterns/DesignContext";

export default function MovableColumnListInner() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [],  },
  ]);

  const [activePanelId, setActivePanelId] = useState<UniqueIdentifier | null>(null);

  // Get colors at the component level
  const { primaryColor, secondaryColor, font} = useColors();
  
  // Store current colors in refs so they're always up-to-date
  const primaryColorRef = useRef(primaryColor);
  const secondaryColorRef = useRef(secondaryColor);
  const fontRef = useRef(font);
  
  useEffect(() => {
    primaryColorRef.current = primaryColor;
    secondaryColorRef.current = secondaryColor;
    fontRef.current = font;
  }, [primaryColor, secondaryColor, font]);

  function renderPanelById(id: UniqueIdentifier) {
    const panel = sections.flatMap(s => s.panels).find(p => p.i === id);
    if (!panel) return null;
   
    const entry = panelRegistry[panel.panelProps.type];
    const Component = entry.component as React.ComponentType<AllPanelProps>;
    const mappedProps = entry.mapProps(panel.panelProps.content, panel.styling);
   
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
      
  const panelId = active.id as string;
  const { dropzoneId, edge } = pendingDrop;
  if (!dropzoneId) return;

  setSections(prev => {
    // 1. Find section containing this dropzone
    const sectionIndex = prev.findIndex(s => s.dropZones.includes(dropzoneId));
    

    const section = prev[sectionIndex];
    const dzIndex = section.dropZones.indexOf(dropzoneId);

    const newDropZones = [...section.dropZones];
    const newZoneId = `${section.id}-zone-${crypto.randomUUID()}`;

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
        
              const panelTypeString = panelId.split("-")[1];

        if (!isPanelType(panelTypeString)) {
          console.error(`Invalid panel type: ${panelTypeString}`);
          return prevSections;
        }

        const panelType: PanelType = panelTypeString;
        

        // Use refs to get the CURRENT color values at drop time
        const newPanel: PanelData = {
          i: crypto.randomUUID(),
          x: 0,
          y: 0,
          w: 300,
          h: 100,
          dropZoneId: newZoneId,
          panelProps: {
            type: panelType,
            content: getDefaultContent(panelTypeString),
            currentIndex: 1,
            layout: undefined,
          },
          styling: draggedPanelData?.styling || {
            borderRadius: 8,
            fontSize: 14,
            fontFamily: fontRef.current,
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
          <ColorProvider sections={sections} setSections={setSections}>
          <Sidebar/>
          <SectionCanvas sections={sections} setSections={setSections} setPendingDrop={setPendingDrop} />
          <DragOverlay > 
            {activePanelId ? renderPanelById(activePanelId) : null}
          </DragOverlay>
          </ColorProvider>
        </DndContext>
      </div>
   
  );
}