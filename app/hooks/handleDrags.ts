import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { PanelData } from "../types/panel";
import { SectionData } from "../component/Sections/Section";

export type HandleProps = {
  event: DragEndEvent;
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
};

export function handleSectionDragEnd({ event, setSections }: HandleProps) {
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


export const handlePanelDragEnd = ({ event, setSections }: HandleProps) => {
  const { active, over } = event;
  console.log("🔵 DRAG END", {
    event,
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