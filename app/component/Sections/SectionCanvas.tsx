"use client";

import { useState } from "react";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { useColors } from "@/app/design-patterns/DesignContext";
import { PanelType } from "@/app/types/panel";
import { Edge } from "./Droppable";
import { getDefaultContent } from "../sidebar";
import ChoosePanelModal from "../panels/ChoosePanelModal";


type SectionCanvasProps = {
  sections: SectionData[];
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
  setPendingDrop: (info: { dropzoneId: string | null; edge: Edge }) => void;
};

export default function SectionCanvas({
  sections,
  setSections,
  setPendingDrop
}: SectionCanvasProps) {

  const { backgroundColor, primaryColor, secondaryColor } = useColors();

  const [modalOpen, setModalOpen] = useState(false);
  const [targetZone, setTargetZone] = useState<string | null>(null);

  function handleRequestAddPanel(zoneId: string) {
    setTargetZone(zoneId);
    setModalOpen(true);
  }

  function handleSelectPanelType(type: PanelType) {
    if (!targetZone) return;
    console.log("sectioncanvas" + backgroundColor + primaryColor)
    setSections(prev =>
      prev.map(section => ({
        ...section,
        panels: [
          ...section.panels,
          {
            i: "panel-" + crypto.randomUUID(),
            x: 0,
            y: 0,
            w: 300,
            h: 100,
            dropZoneId: targetZone,
            panelProps: {
              type,
              content: getDefaultContent(type)
            },
            styling: {
              backgroundColor: secondaryColor,
              textColor: primaryColor
            }
          }
        ]
      }))
    );

    setModalOpen(false);
    setTargetZone(null);
  }

  const addSection = () => {
    const id = "section-" + crypto.randomUUID();
    const firstZone = `${id}-zone-${crypto.randomUUID()}`;
    setSections(prev => [
      ...prev,
      {
        id,
        name: `Section ${prev.length + 1}`,
        panels: [],
        dropZones: [firstZone],
      }
    ]);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* MAIN CANVAS */}
      <div
        className="flex-1 p-6 space-y-6 overflow-y-auto"
        style={{ backgroundColor: backgroundColor }}
      >
        <Button
          size="xs"
          style={{
            backgroundColor: "rgba(0,128,0,0.85)",
            color: "white",
            borderRadius: "0.4rem",
            padding: "0.25rem 0.6rem"
          }}
          onClick={addSection}
        >
          Add Section
        </Button>
        <div className="space-y-4">
          {sections.map(section => (
            <Section
              key={section.id}
              data={section}
              onChange={updated =>
                setSections(prev =>
                  prev.map(s => (s.id === section.id ? updated : s))
                )
              }
              onDelete={() =>
                setSections(prev => prev.filter(s => s.id !== section.id))
              }
              setPendingDrop={setPendingDrop}
              onRequestAddPanel={handleRequestAddPanel}
            />
          ))}
        </div>
      </div>

      <ChoosePanelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelectPanelType}
      />
    </div>
  );
}