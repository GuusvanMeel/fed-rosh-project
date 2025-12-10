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
  const clearPage = () => {
    setSections([]);
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="savebutton" onSelect={onSave}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save-icon lucide-save"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
                  Save page
                </Menu.Item>
                <Menu.Item value="loadbutton" onSelect={onLoad}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-download-icon lucide-cloud-download"><path d="M12 13v8l-4-4"/><path d="m12 21 4-4"/><path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284"/></svg>
                  Load Page
                </Menu.Item>
                <Menu.Item value="addbutton" onSelect={addSection}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Add Section
                </Menu.Item>
                <Menu.Item value="clearbutton" onSelect={clearPage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Clear Page
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