  "use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { useColors } from "@/app/design-patterns/DesignContext";
import { PanelData } from "@/app/types/panel";
import { useSensors, useSensor, PointerSensor, DragEndEvent } from "@dnd-kit/core";


  type SectionCanvasProps = {
    sections: SectionData[];
    setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
  };

  

  export default function SectionCanvas({
    sections,
    setSections,
  }: SectionCanvasProps) {       
      const [selectedPanel, setSelectedPanel] = useState<{
          panel: PanelData;
          sectionId: string;
      } | null>(null);

    const { primaryColor} = useColors();

      

     const [activeSectionId, setActiveSectionId] = useState<string | null>(null);


        const addSection = () => {
              const id = "section-" + crypto.randomUUID();
            setSections(prev => [...prev, { id, name: `Section ${prev.length + 1}`, panels: [], dropZones: [] }]);
        };


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



    // Handle panel selection
    const handlePanelEdit = (sectionId: string, panelId: string) => {
        const section = sections.find(s => s.id === sectionId);
        const panel = section?.panels.find(p => p.i === panelId);
        if (panel) {
            setSelectedPanel({ panel, sectionId });
        }
    };

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
              <div className="flex-1 p-6 space-y-6 bg-gray-200 overflow-y-auto " style={{ backgroundColor: primaryColor }}>
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

      <div className="space-y-4">
        {sections.map(section => (
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
        ))}
      </div>
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