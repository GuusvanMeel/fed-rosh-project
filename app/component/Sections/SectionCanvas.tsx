"use client";

import { useState } from "react";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { useColors } from "@/app/design-patterns/DesignContext";
import { PanelData } from "@/app/types/panel";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent
} from "@dnd-kit/core";
import { PanelSettingsForm } from "@/components/ui/panelsettingsform";

type SectionCanvasProps = {
  sections: SectionData[];
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
};

export default function SectionCanvas({
  sections,
  setSections
}: SectionCanvasProps) {
  const { primaryColor } = useColors();

  const [selectedPanel, setSelectedPanel] = useState<{
    panel: PanelData;
    sectionId: string;
  } | null>(null);


  // -----------------------------
  // Add Section
  // -----------------------------
  const addSection = () => {
    const id = "section-" + crypto.randomUUID();
    setSections(prev => [
      ...prev,
      {
        id,
        name: `Section ${prev.length + 1}`,
        panels: [],
        dropZones: []
      }
    ]);
  };

  

  // -----------------------------
  // PANEL EDITING
  // -----------------------------
  const handlePanelEdit = (sectionId: string, panelId: string) => {
    const sec = sections.find(s => s.id === sectionId);
    const panel = sec?.panels.find(p => p.i === panelId);

    if (panel) setSelectedPanel({ panel, sectionId });
  };


  const handlePanelUpdate = (updatedPanel: PanelData) => {
    if (!selectedPanel) return;

    setSections(prev =>
      prev.map(sec =>
        sec.id === selectedPanel.sectionId
          ? {
              ...sec,
              panels: sec.panels.map(p =>
                p.i === updatedPanel.i ? updatedPanel : p
              )
            }
          : sec
      )
    );

    setSelectedPanel({ ...selectedPanel, panel: updatedPanel });
  };

  const handlePanelDelete = (panelId: string) => {
    if (!selectedPanel) return;

    setSections(prev =>
      prev.map(sec =>
        sec.id === selectedPanel.sectionId
          ? {
              ...sec,
              panels: sec.panels.filter(p => p.i !== panelId)
            }
          : sec
      )
    );

    setSelectedPanel(null);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* MAIN CANVAS */}
      <div
        className="flex-1 p-6 space-y-6 overflow-y-auto"
        style={{ backgroundColor: primaryColor }}
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
                onPanelEdit={(panelId) => handlePanelEdit(section.id, panelId)}
              />
            ))}
          </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[250px] bg-neutral-900 border-l border-neutral-700 shadow-2xl overflow-y-auto">
        {selectedPanel ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Panel Settings</h2>
              <button
                onClick={() => setSelectedPanel(null)}
                className="h-8 w-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <PanelSettingsForm
              panel={selectedPanel.panel}
              onUpdate={handlePanelUpdate}
              onDelete={handlePanelDelete}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Select a panel to edit its properties
          </div>
        )}
      </div>
    </div>
  );
}
