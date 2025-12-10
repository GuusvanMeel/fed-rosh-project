"use client";

import { useState } from "react";
import Section, { SectionData } from "./Section";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { useColors } from "@/app/design-patterns/DesignContext";
import { PanelData, PanelType } from "@/app/types/panel";
import { Edge } from "./Droppable";
import { getDefaultContent } from "../sidebar";
import ChoosePanelModal from "../panels/ChoosePanelModal";
import { savePanels } from "@/lib/supabase/queries/savePanels";
import { getPanels } from "@/lib/supabase/queries/getPanels";
import DialogBox from "../DialogBox";
import { saveSections } from "@/lib/supabase/queries/saveSections";
import { getSections } from "@/lib/supabase/queries/getSections";


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



  // -----------------------------
  // PANEL EDITING
  // -----------------------------




  function onSave() {
    sections.forEach(section => {
      console.log(section.panels.length + "fdfdzsfds")
      saveSections(sections)
      savePanels(section.panels)
    });
  }

  async function onLoad() {
  const sections: SectionData[] = await getSections();
  const panels: PanelData[] = await getPanels();

  // Reset
  setSections([]);
const array : PanelData[] = []

  // Prepare empty sections
  const newSections = sections.map(section => ({
    id: section.id,
    name: section.name,
    panels: array, // will be filled later
    dropZones: section.dropZones
  }));

  // Fill each section with its matched panels
  newSections.forEach(section => {
    const matchedPanels = panels.filter(
      panel =>
        panel.dropZoneId &&
        section.dropZones.includes(panel.dropZoneId)
    );

    section.panels = matchedPanels;
  });

  // Send final result into state
  setSections(newSections);
}


  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* MAIN CANVAS */}
      <div
        className="flex-1 p-6 space-y-6 overflow-y-auto"
        style={{ backgroundColor: backgroundColor }}
      >
        <Menu.Root >
          <Menu.Trigger asChild>
            <Button variant="surface" size="sm" className="mb-1!">
              Page
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="new-txt-a" onSelect={onSave}>
                  Save page <Menu.ItemCommand>⌘E</Menu.ItemCommand>
                </Menu.Item>
                <Menu.Item value="loadbutton" onSelect={onLoad}>
                  Load Page <Menu.ItemCommand>⌘E</Menu.ItemCommand>
                </Menu.Item>
                <Menu.Item value="new-file-a" onSelect={addSection}>
                  Add Section <Menu.ItemCommand>⌘N</Menu.ItemCommand>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
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