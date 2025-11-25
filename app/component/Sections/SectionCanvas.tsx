"use client";

import { Reorder } from "framer-motion";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { useColors } from "@/app/design-patterns/DesignContext";

export default function SectionCanvas() {
  const { primaryColor, sections, setSections } = useColors();

  const addSection = () => {
    const id = `section-${Date.now()}`;
    setSections([...sections, { id, name: `Section ${sections.length + 1}`, panels: [] }]);
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const updateSectionOrder = (next: SectionData[]) => {
    setSections(next);
  };

  const updateSection = (updated: SectionData) => {
    setSections(sections.map(s => (s.id === updated.id ? updated : s)));
  };

  return (
    <div className="flex-1 p-6 space-y-6" style={{ backgroundColor: primaryColor }}>
      <Button
        size="xs"
        variant="surface"
        style={{
          backgroundColor: "rgba(0,128,0,0.85)",
          color: "white",
          borderRadius: "0.4rem",
          padding: "0.25rem 0.6rem",
          fontSize: "0.75rem",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,160,0,1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,128,0,0.85)")
        }
        onClick={addSection}
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