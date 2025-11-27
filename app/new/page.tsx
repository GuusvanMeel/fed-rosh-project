"use client";

import { useState } from "react";
import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar from "../component/sidebar";
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier } from "@dnd-kit/core";
import { SectionData } from "../component/Sections/Section";
import { PanelData } from "../types/panel";
import { panelRegistry } from "../component/panels/panelRegistry";
import { PanelWrapper } from "../component/panels/panelWrapper";
import { handleSectionDragEnd, handlePanelDragEnd } from "../hooks/handleDrags";
import { ColorProvider, useColors } from "../design-patterns/DesignContext";

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

// Main content component that uses colors from context
function MainContent({
  sections,
  setSections
}: {
  sections: SectionData[];
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
}) {
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
      <PanelWrapper panel={panel}>
        <Component {...mappedProps} />
      </PanelWrapper>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag end triggered");
    const { active, over } = event;

    console.log("Drag ended:", {
      activeId: active.id,
      overId: over?.id,
    });

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
    <DndContext 
      onDragStart={({ active }) => {
        setActivePanelId(active.id);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActivePanelId(null)}
    >
      <Sidebar />
      <SectionCanvas sections={sections} setSections={setSections} />
      <DragOverlay>
        {activePanelId ? renderPanelById(activePanelId) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default function MovableColumnList() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [] },
  ]);

  return (
    <Provider>
      <div className="flex w-full h-screen">
        <ColorProvider sections={sections} setSections={setSections}>
          <MainContent sections={sections} setSections={setSections} />
        </ColorProvider>
      </div>
    </Provider>
  );
}