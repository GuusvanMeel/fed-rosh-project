"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PanelData } from "@/app/types/panel";

export default function SectionCanvas() {
    const controls = useDragControls(); 

        const [sections, setSections] = useState<SectionData[]>([
            { id: "section-1", name: "Section 1", panels: [] },
        ]);

        const addSection = () => {
              const id = crypto.randomUUID();
            setSections(prev => [...prev, { id, name: `Section ${prev.length + 1}`, panels: [] }]);
        };


    // update one section (used for panel updates)
    const updateSection = (updated: SectionData) => {
        setSections(prev =>
            prev.map(s => (s.id === updated.id ? updated : s))
        );
    };
     const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (!over) return;
  
  const panelId = active.id as string;
  const newZoneId = over.id as string;
  
  // Extract section ID from zone ID (e.g., "section-1-zone-2" -> "section-1")
  const newSectionId = newZoneId.split('-zone-')[0];
  
  console.log(`Panel ${panelId} dropped on zone ${newZoneId} in section ${newSectionId}`);
  
  setSections(prevSections => {
    // Find which section currently has the panel
    let panelToMove: PanelData | null = null;
    let sourceSectionId: string | null = null;
    
    for (const section of prevSections) {
      const panel = section.panels.find(p => p.i === panelId);
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
      return prevSections.map(section => {
        if (section.id === sourceSectionId) {
          return {
            ...section,
            panels: section.panels.map(p => 
              p.i === panelId ? updatedPanel : p
            )
          };
        }
        return section;
      });
    }
    
    // Moving between sections: remove from source, add to target
    return prevSections.map(section => {
      if (section.id === sourceSectionId) {
        // Remove panel from source section
        return {
          ...section,
          panels: section.panels.filter(p => p.i !== panelId)
        };
      }
      if (section.id === newSectionId) {
        // Add panel to target section
        return {
          ...section,
          panels: [...section.panels, updatedPanel]
        };
      }
      return section;
    });
  });
};

    return (
        <div className="flex-1 p-6 space-y-6 bg-gray-200">
            <Button

                size="xs"
                variant="surface"
                style={{
                    backgroundColor: "rgba(0,128,0,0.85)", // darker green
                    color: "white",
                    borderRadius: "0.4rem",
                    padding: "0.25rem 0.6rem",
                    fontSize: "0.75rem",
                    transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(0,160,0,1)") // lighter green
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(0,128,0,0.85)")
                }
                onClick={() => addSection()}
            >
                Add Section
            </Button>




           <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {sections.map(section => (
          <Section
            key={section.id}
            data={section}
            onChange={(updated) => {
              setSections(prev => 
                prev.map(s => s.id === section.id ? updated : s)
              );
            }}
            onDelete={() => {
              setSections(prev => prev.filter(s => s.id !== section.id));
            }}
          />
        ))}
      </div>
    </DndContext>
    </div>
  );
}