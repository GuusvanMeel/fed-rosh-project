"use client";

import { UniqueIdentifier, DragEndEvent, DndContext, DragOverlay } from "@dnd-kit/core";
import { useState, useRef, useEffect } from "react";
import { panelRegistry, AllPanelProps, isPanelType } from "./component/panels/panelRegistry";
import { PanelWrapper } from "./component/panels/panelWrapper";
import { Edge } from "./component/Sections/Droppable";
import { SectionData } from "./component/Sections/Section";
import SectionCanvas from "./component/Sections/SectionCanvas";
import Sidebar, { getDefaultContent } from "./component/sidebar";
import { ColorProvider, useColors } from "./design-patterns/DesignContext";
import { handleSectionDragEnd, handlePanelDragEnd } from "./hooks/handleDrags";
import { PanelType, PanelData } from "./types/panel";
import EditForm from "./component/editForm";

export default function MovableColumnListInner() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const { primaryColor, secondaryColor } = useColors();
  const [activePanelId, setActivePanelId] = useState<UniqueIdentifier | null>(null);
  
  // Lifted state for edit form
  const [selectedPanel, setSelectedPanel] = useState<{
    panel: PanelData;
    sectionId: string;
  } | null>(null);


  function renderPanelById(id: UniqueIdentifier) {
    const panel = sections.flatMap(s => s.panels).find(p => p.i === id);
    if (!panel) return null;
   
    const entry = panelRegistry[panel.panelProps.type];
    const Component = entry.component as React.ComponentType<AllPanelProps>;
    const mappedProps = entry.mapProps(panel.panelProps.content, panel.styling);
   
    return (
      <div style={{ opacity: 0.5 }}>
        <PanelWrapper panel={panel}>
          <Component {...mappedProps} />
        </PanelWrapper>
      </div>
    );
  }

  const [pendingDrop, setPendingDrop] = useState<{
    dropzoneId: string | null;
    edge: Edge;
  }>({ dropzoneId: null, edge: null });

  // Handler for updating panel from edit form
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

    // Keep selectedPanel in sync with the updated panel
    setSelectedPanel({ ...selectedPanel, panel: updatedPanel });
  };

  // Sync selectedPanel with sections when sections change (e.g., after drag)
  useEffect(() => {
    if (!selectedPanel) return;
    
    // Find the current version of the selected panel
    for (const section of sections) {
      const currentPanel = section.panels.find(p => p.i === selectedPanel.panel.i);
      if (currentPanel) {
        // Update selectedPanel with the current panel data from sections
        setSelectedPanel({ panel: currentPanel, sectionId: section.id });
        break;
      }
    }
  }, [sections]);
  
  // Handler for deleting panel from edit form
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;    
    
    if (pendingDrop.edge === "left" || pendingDrop.edge === "right") {
  const panelId = active.id as string;
  const { dropzoneId, edge } = pendingDrop;
  if (!dropzoneId) return;

  setSections(prev => {
    // 1) Find target section (where the edge/dropzone lives)
    const targetSectionIndex = prev.findIndex(s =>
      s.dropZones.includes(dropzoneId)
    );
    if (targetSectionIndex === -1) return prev;

    const targetSection = prev[targetSectionIndex];
    if (targetSection.dropZones.length >= 6) {
    return prev; // Prevent adding more columns
  }
    const dzIndex = targetSection.dropZones.indexOf(dropzoneId);

    // 2) Create new dropzone left/right of the hovered one
    const newDropZones = [...targetSection.dropZones];
    const newZoneId = `${targetSection.id}-zone-${crypto.randomUUID()}`;

    if (edge === "left") {
      newDropZones.splice(dzIndex, 0, newZoneId);
    } else {
      newDropZones.splice(dzIndex + 1, 0, newZoneId);
    }

    // 3) Find the panel & the section it currently lives in
    let sourceSectionIndex = -1;
    let panelToMove: PanelData | null = null;

    prev.forEach((section, idx) => {
      const found = section.panels.find(p => p.i === panelId);
      if (found) {
        sourceSectionIndex = idx;
        panelToMove = found;
      }
    });

    if (!panelToMove) return prev;

    // 4) Build new sections array with:
    //    - panel removed from source section
    //    - panel added to target section with new dropZoneId
    return prev.map((section, idx) => {
      // Source == target: just update dropZoneId in-place
      if (idx === sourceSectionIndex && idx === targetSectionIndex) {
        return {
          ...section,
          dropZones: newDropZones,
          panels: section.panels.map(p =>
            p.i === panelId ? { ...p, dropZoneId: newZoneId } : p
          ),
        };
      }

      // Source only: remove panel
      if (idx === sourceSectionIndex) {
        return {
          ...section,
          panels: section.panels.filter(p => p.i !== panelId),
        };
      }

      // Target only: add moved panel
      if (idx === targetSectionIndex) {
        return {
          ...section,
          dropZones: newDropZones,
          panels: [
            ...section.panels,
            { ...panelToMove!, dropZoneId: newZoneId },
          ],
        };
      }

      // Unaffected sections
      return section;
    });
  });

  setPendingDrop({ dropzoneId: null, edge: null });
  return;
}

    
    if (!over) {
      console.log("No drop target found");
      return;
    }

    if (!active.id.toString().includes("sidebar")) {
      handleSectionDragEnd({ event, setSections });
      handlePanelDragEnd({ event, setSections });
      setActivePanelId(null);
      return;
    }

    const panelId = active.id as string;
    const newZoneId = over.id as string;
    const newSectionId = newZoneId.split("-zone-")[0];

    console.log(`Panel ${panelId} dropped on zone ${newZoneId} in section ${newSectionId}`);

    setSections((prevSections) => {
      const draggedPanelData = active.data?.current?.panel;
      
      const isDraggedFromSidebar =
        panelId.startsWith("sidebar-") || 
        (draggedPanelData &&
          !prevSections.some((section) =>
            section.panels.some((p) => p.i === panelId)
          ));
      
      if (isDraggedFromSidebar) {
        console.log("Creating new panel from sidebar");
        
        const panelTypeString = panelId.split("-")[1];

        if (!isPanelType(panelTypeString)) {
          console.error(`Invalid panel type: ${panelTypeString}`);
          return prevSections;
        }

        const panelType: PanelType = panelTypeString;
        console.log(secondaryColor + "background colour")
        console.log(primaryColor + "text  colour")
        const newPanel: PanelData = {
          i: crypto.randomUUID(),
          x: 0,
          y: 0,
          w: 300,
          h: 100,
          dropZoneId: newZoneId,
          panelProps: {
            type: panelType,
            content: getDefaultContent(panelTypeString),
            currentIndex: 1,
          },
         styling: {
              backgroundColor: secondaryColor,
              textColor: primaryColor
            }
        };

        console.log("New panel created with colors:", {
          textColor: newPanel.styling.textColor,
          backgroundColor: newPanel.styling.backgroundColor
        });

        return prevSections.map((section) => {
          if (section.id === newSectionId) {
            return {
              ...section,
              panels: [...section.panels, newPanel],
            };
          }
          return section;
        });
      }

      let panelToMove: PanelData | null = null;
      let sourceSectionId: string | null = null;
      console.log("hier")
      for (const section of prevSections) {
        const panel = section.panels.find((p) => p.i === panelId);
        if (panel) {
          panelToMove = panel;
          sourceSectionId = section.id;
          console.log(section.id);
          console.log(panel.i);
          break;
        }
      }

      if (!panelToMove || !sourceSectionId) return prevSections;

      const updatedPanel = { ...panelToMove, dropZoneId: newZoneId };

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

      return prevSections.map((section) => {
        if (section.id === sourceSectionId) {
          return {
            ...section,
            panels: section.panels.filter((p) => p.i !== panelId),
          };
        }
        if (section.id === newSectionId) {
          return {
            ...section,
            panels: [...section.panels, updatedPanel],
          };
        }
        return section;
      });
    });

    setActivePanelId(null);
  };

  return (
    <div className="flex w-full h-screen">
      <ColorProvider sections={sections} setSections={setSections}>
      <DndContext 
        onDragStart={({ active }) => {
          setActivePanelId(active.id);
          
          // When dragging a panel, automatically select it for editing
          const panelId = active.id as string;
          
          // Skip if dragging from sidebar
          if (panelId.startsWith("sidebar-")) return;
          
          // Find the panel being dragged
          for (const section of sections) {
            const panel = section.panels.find((p) => p.i === panelId);
            if (panel) {
              setSelectedPanel({ panel, sectionId: section.id });
              break;
            }
          }
        }}
        onDragEnd={(event) => {
          handleDragEnd(event)
          setActivePanelId(null);
        }}
        onDragCancel={() => setActivePanelId(null)}
      >
        <Sidebar/>
        <SectionCanvas 
          sections={sections} 
          setSections={setSections} 
          setPendingDrop={setPendingDrop}
        />
        
        {/* RIGHT SIDEBAR - Edit Form */}
        <div className="w-[250px] bg-neutral-900 border-l border-neutral-700 shadow-2xl overflow-y-auto">
          {selectedPanel ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                
                <button
                  onClick={() => setSelectedPanel(null)}
                  className="h-8 w-8  bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <EditForm
                panel={selectedPanel.panel}
                onUpdate={handlePanelUpdate}
                onDelete={handlePanelDelete}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              Drag a panel to edit its properties
            </div>
          )}
        </div>
        
        <DragOverlay> 
          {activePanelId ? renderPanelById(activePanelId) : null}
        </DragOverlay>
        
      </DndContext>
      </ColorProvider>
    </div>
  );
}