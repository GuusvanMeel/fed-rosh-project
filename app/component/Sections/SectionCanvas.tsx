"use client";

import { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";

export default function SectionCanvas() {
    const controls = useDragControls(); 

    const [sections, setSections] = useState<SectionData[]>([
        { id: "section-1", name: "Section 1", panels: [] },
    ]);

    const addSection = () => {
        const id = `section-${Date.now()}`;
        setSections(prev => [...prev, { id, name: `Section ${prev.length + 1}`, panels: [] }]);
    };

    const deleteSection = (sectionId: string) => {
        setSections(prev => prev.filter(s => s.id !== sectionId));
    };

    const updateSectionOrder = (next: SectionData[]) => {
        setSections(next);
    };

    // update one section (used for panel updates)
    const updateSection = (updated: SectionData) => {
        setSections(prev =>
            prev.map(s => (s.id === updated.id ? updated : s))
        );
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




             <Reorder.Group
        axis="y"
        values={sections}
        onReorder={updateSectionOrder}
        className="space-y-4"
      >
        {sections.map(section => (
          <Section
            key={section.id}
            data={section}
            onChange={updateSection}
            onDelete={() => deleteSection(section.id)}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}