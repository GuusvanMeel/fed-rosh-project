"use client";

import { useState } from "react";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { PanelData } from "@/app/types/panel";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { SortableSectionWrapper } from "./SectionWrapper";
import { panelRegistry } from "../panels/panelRegistry";
import { PanelWrapper } from "../panels/panelWrapper";

export default function SectionCanvas() {
        const [sections, setSections] = useState<SectionData[]>([
            { id: "section-1", name: "Section 1", panels: [], dropZones: [] },
        ]);

    const [activePanelId, setActivePanelId] = useState<UniqueIdentifier | null>(null);

    const [selectedPanel, setSelectedPanel] = useState<{
        panel: PanelData;
        sectionId: string;
    } | null>(null);

        const addSection = () => {
              const id = "section" + crypto.randomUUID();
            setSections(prev => [...prev, { id, name: `Section ${prev.length + 1}`, panels: [], dropZones: [] }]);
        };
     const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  function handleSectionDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over) return;

  if (active.id !== over.id) {
    setSections((prev) => {
      const oldIndex = prev.findIndex(s => s.id === active.id);
      const newIndex = prev.findIndex(s => s.id === over.id);

      return arrayMove(prev, oldIndex, newIndex);
    });
  }
}


 const handlePanelDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
    console.log("🔵 DRAG END", {
  activeId: active.id,
  overId: over?.id,
});
  if (!over) return;

  const activeId = active.id as string;
  const overId = over.id as string;

  setSections(prevSections => {
    // ---- Step 1: FIND ACTIVE PANEL + SOURCE SECTION ----
    let panelToMove: PanelData | null = null;
    let sourceSectionId: string | null = null;
    

    for (const section of prevSections) {
      const panel = section.panels.find(p => p.i === activeId);
      if (panel) {        
        panelToMove = panel;
        sourceSectionId = section.id;
        
        break;
      }
    }

    if (!panelToMove || !sourceSectionId) return prevSections;

    const sourceSection = prevSections.find(s => s.id === sourceSectionId)!;

    // ---- Helper: find panel by ID ----
    const isPanel = (id: string) =>
      sourceSection.panels.some(p => p.i === id);

    // ---- CASE A — Sorting inside same dropzone ----
    if (isPanel(overId)) {
      const overPanel = sourceSection.panels.find(p => p.i === overId)!;

      // same dropzone?
      if (panelToMove.dropZoneId === overPanel.dropZoneId) {
        const zone = panelToMove.dropZoneId;

        const zonePanels = sourceSection.panels.filter(
          p => p.dropZoneId === zone
        );

        const oldIndex = zonePanels.findIndex(p => p.i === activeId);
        const newIndex = zonePanels.findIndex(p => p.i === overId);

        const reordered = arrayMove(zonePanels, oldIndex, newIndex);

        return prevSections.map(s => {
          if (s.id !== sourceSectionId) return s;

          return {
            ...s,
            panels: [
              // keep panels from other zones
              ...s.panels.filter(p => p.dropZoneId !== zone),
              // insert reordered zone panels
              ...reordered,
            ],
          };
        });
      }
    }

            const newSectionId = overId.split("-zone-")[0];

        if (overId.includes("-zone-") && newSectionId === sourceSectionId) {
        console.log("🟣 SAME SECTION - SWITCH ZONE");

        const updatedPanel = { ...panelToMove, dropZoneId: overId };

        return prevSections.map(section => {
            if (section.id !== sourceSectionId) return section;

            return {
            ...section,
            panels: section.panels.map(p =>
                p.i === activeId ? updatedPanel : p
            ),
            };
        });
}
    // ---- CASE B — Dropped over a dropzone (change dropzone) ----
    const isDropzone = overId.includes("-zone-");

    if (isDropzone && sourceSectionId !== newSectionId) {
      const newZoneId = overId;
      const updatedPanel = { ...panelToMove, dropZoneId: newZoneId };

      return prevSections.map(section => {
        if (section.id === sourceSectionId) {
          // remove from old section
                    console.log("❌ REMOVE from source section", {
            sectionId: section.id,
            activeId,
            sourceSectionId
            });
          return {
            ...section,
            panels: section.panels.filter(p => p.i !== activeId),
          };
        }

        if (section.dropZones.includes(newZoneId)) {
          // add to target section at the end of its zone
                    console.log("➕ ADD to target section", {
            sectionId: section.id,
            newZoneId,
            activeId
            });
          return {
            ...section,
            panels: [...section.panels, updatedPanel],
          };
        }

        return section;
      });
    }

    return prevSections;
  });
};
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


   

    // Handle panel update from modal
    const handlePanelUpdate = (updatedPanel: PanelData) => {
        if (!selectedPanel) return;
        
        setSections(prev =>
            prev.map(section => {
                if (section.id === selectedPanel.sectionId) {
                    return {
                        ...section,
                        panels: section.panels.map(p =>
                            p.i === updatedPanel.i ? updatedPanel : p
                        ),
                    };
                }
                return section;
            })
        );
    };

    // Handle panel delete
    const handlePanelDelete = (panelId: string) => {
        if (!selectedPanel) return;
        
        setSections(prev =>
            prev.map(section => {
                if (section.id === selectedPanel.sectionId) {
                    return {
                        ...section,
                        panels: section.panels.filter(p => p.i !== panelId),
                    };
                }
                return section;
            })
        );
        setSelectedPanel(null);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Main canvas area */}
            <div className="flex-1 p-6 space-y-6 bg-gray-200 overflow-y-auto">
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
                    onClick={() => addSection()}
                >
                    Add Section
                </Button>

          <DndContext sensors={sensors}
          onDragStart={({ active }) => {
        setActivePanelId(active.id);
        }}
   onDragEnd={(event) => {
    handleSectionDragEnd(event);  // 🔵 handles section reordering
    handlePanelDragEnd(event);    // 🔴 your existing panel movement logic
    setActivePanelId(null);
  }}
    onDragCancel={() => setActivePanelId(null)}>
    
    
            <SortableContext items={sections.map(s => s.id)}>
      <div className="space-y-4">
        {sections.map(section => (
            <SortableSectionWrapper id={section.id} key={section.id}>
          <Section
            
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
          </SortableSectionWrapper>
        ))}
      </div>
      </SortableContext>
    <DragOverlay>
    {activePanelId ? renderPanelById(activePanelId) : null}
  </DragOverlay>
    </DndContext>
    </div>


{/* Right-side panel menu */}
            {selectedPanel && (
                <div className="w-[400px] bg-neutral-900 shadow-2xl overflow-y-auto border-l border-neutral-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Panel Settings</h2>
                            <button
                                onClick={() => setSelectedPanel(null)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white"
                                aria-label="Close panel menu"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Panel settings form */}
                        <div className="space-y-4">
                            <PanelSettingsForm
                                panel={selectedPanel.panel}
                                onUpdate={handlePanelUpdate}
                                onDelete={handlePanelDelete}
                            />
                        </div>
                    </div>
                </div>
            )}

           
        </div>
        );
        }

 


function PanelSettingsForm({
    panel,
    onUpdate,
    onDelete,
}: {
    panel: PanelData;
    onUpdate: (updated: PanelData) => void;
    onDelete: (id: string) => void;
}) {
    const [draft, setDraft] = useState<PanelData>(panel);

    return (
        <div className="space-y-4">
            {/* Panel Content */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Content</span>
                <input
                    type="text"
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter panel content"
                    value={typeof draft.panelProps.content === 'string' ? draft.panelProps.content : ''}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            panelProps: { ...draft.panelProps, content: e.target.value },
                        })
                    }
                />
            </label>

            {/* Background Color */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Background Color</span>
                <input
                    type="color"
                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 cursor-pointer"
                    value={draft.styling.backgroundColor}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            styling: { ...draft.styling, backgroundColor: e.target.value },
                        })
                    }
                />
            </label>

            {/* Text Color */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Text Color</span>
                <input
                    type="color"
                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 cursor-pointer"
                    value={draft.styling.textColor || "#ffffff"}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            styling: { ...draft.styling, textColor: e.target.value },
                        })
                    }
                />
            </label>

            {/* Font Size */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Font Size: {draft.styling.fontSize || 16}px
                </span>
                <input
                    type="range"
                    min="8"
                    max="64"
                    className="w-full"
                    value={draft.styling.fontSize || 16}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            styling: { ...draft.styling, fontSize: Number(e.target.value) },
                        })
                    }
                />
            </label>

            {/* Border Radius */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Corner Radius: {draft.styling.borderRadius || 8}px
                </span>
                <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full"
                    value={draft.styling.borderRadius || 8}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            styling: { ...draft.styling, borderRadius: Number(e.target.value) },
                        })
                    }
                />
            </label>

            {/* Padding */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Padding: {draft.styling.padding || 8}px
                </span>
                <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full"
                    value={draft.styling.padding || 8}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            styling: { ...draft.styling, padding: Number(e.target.value) },
                        })
                    }
                />
            </label>

            {/* Text Align */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Text Align</span>
                <select
                    value={draft.styling.contentAlign || "left"}
                    onChange={(e) =>
                        setDraft({
                            ...draft,
                            styling: {
                                ...draft.styling,
                                contentAlign: e.target.value as "left" | "center" | "right",
                            },
                        })
                    }
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={() => onUpdate(draft)}
                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                    Apply Changes
                </button>
                <button
                    onClick={() => onDelete(panel.i)}
                    className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}