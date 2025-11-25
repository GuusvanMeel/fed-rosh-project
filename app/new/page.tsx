"use client";

import { Reorder } from "framer-motion";
import { SetStateAction, useState } from "react";
import VideoPanel from "../component/panels/VideoPanel";
import ImagePanel from "../component/panels/ImagePanel";
import ScrollingTextPanel from "../component/panels/ScrollingTextPanel";
import TextPanel from "../component/panels/TextPanel";
import UrlPanel from "../component/panels/UrlPanel";
import { CountdownPanel } from "../component/panels/CountdownPanel";
import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar from "../component/sidebar";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SectionData } from "../component/Sections/Section";
import { PanelData } from "../types/panel";


export default function MovableColumnList() {
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [], dropZones: [] },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("Drag ended:", {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data,
      overData: over?.data,
    });

    if (!over) {
      console.log("No drop target found");
      return;
    }

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
          w: 0,
          h: 0,
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
        <DndContext onDragEnd={handleDragEnd}>
          <Sidebar setSections={setSections} />
          <SectionCanvas sections={sections} setSections={setSections} />
        </DndContext>
      </div>
    </Provider>
  );
}