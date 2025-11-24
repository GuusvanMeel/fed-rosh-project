"use client";

import { useState } from "react";
import { Reorder } from "framer-motion";
import Section, { SectionData } from "./Section";
import { Button } from "@chakra-ui/react";
import { PanelData } from "@/app/types/panel";

export default function SectionCanvas() {
    const [sections, setSections] = useState<SectionData[]>([
        { id: "section-1", name: "Section 1", panels: [] },
    ]);

    const [selectedPanel, setSelectedPanel] = useState<{
        panel: PanelData;
        sectionId: string;
    } | null>(null);

    const addSection = () => {
        const id = `section-${Date.now()}`;
        setSections(prev => [...prev, { id, name: `Section ${prev.length + 1}`, panels: [] }]);
    };

    const deleteSection = (sectionId: string) => {
        setSections(prev => prev.filter(s => s.id !== sectionId));
        if (selectedPanel?.sectionId === sectionId) {
            setSelectedPanel(null);
        }
    };

    const updateSectionOrder = (next: SectionData[]) => {
        setSections(next);
    };

    const updateSection = (updated: SectionData) => {
        setSections(prev => prev.map(s => (s.id === updated.id ? updated : s)));
        
        // Update selectedPanel if it's in this section
        if (selectedPanel?.sectionId === updated.id) {
            const updatedPanel = updated.panels.find(p => p.i === selectedPanel.panel.i);
            if (updatedPanel) {
                setSelectedPanel({ ...selectedPanel, panel: updatedPanel });
            }
        }
    };

    const handlePanelEdit = (sectionId: string, panelId: string) => {
        const section = sections.find(s => s.id === sectionId);
        const panel = section?.panels.find(p => p.i === panelId);
        if (panel) {
            setSelectedPanel({ panel, sectionId });
        }
    };

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
        
        setSelectedPanel({ ...selectedPanel, panel: updatedPanel });
    };

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
                            onPanelEdit={(panelId) => handlePanelEdit(section.id, panelId)}
                        />
                    ))}
                </Reorder.Group>
            </div>

            {/* Right-side panel menu - always visible */}
            <div className="w-[400px] bg-neutral-900 shadow-2xl overflow-y-auto border-l border-neutral-700">
                {selectedPanel ? (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Panel Settings</h2>
                            <button
                                onClick={() => setSelectedPanel(null)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                                aria-label="Close panel settings"
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
                        <p className="text-center px-8">
                            Select a panel to edit its properties
                        </p>
                    </div>
                )}
            </div>
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
    const updateStyling = (styleUpdates: Partial<PanelData['styling']>) => {
        onUpdate({
            ...panel,
            styling: { ...panel.styling, ...styleUpdates },
        });
    };

    const updateContent = (content: string) => {
        onUpdate({
            ...panel,
            panelProps: { ...panel.panelProps, content },
        });
    };

    return (
        <div className="space-y-4">
            {/* Panel Content */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Content</span>
                <input
                    type="text"
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter panel content"
                    value={typeof panel.panelProps.content === 'string' ? panel.panelProps.content : ''}
                    onChange={(e) => updateContent(e.target.value)}
                />
            </label>

            {/* Background Color */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Background Color</span>
                <input
                    type="color"
                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 cursor-pointer"
                    value={panel.styling.backgroundColor}
                    onChange={(e) => updateStyling({ backgroundColor: e.target.value })}
                />
            </label>

            {/* Text Color */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Text Color</span>
                <input
                    type="color"
                    className="h-10 w-full rounded-lg border border-neutral-700 bg-neutral-800 cursor-pointer"
                    value={panel.styling.textColor || "#ffffff"}
                    onChange={(e) => updateStyling({ textColor: e.target.value })}
                />
            </label>

            {/* Font Size */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Font Size: {panel.styling.fontSize || 16}px
                </span>
                <input
                    type="range"
                    min="8"
                    max="64"
                    className="w-full accent-blue-500"
                    value={panel.styling.fontSize || 16}
                    onChange={(e) => updateStyling({ fontSize: Number(e.target.value) })}
                />
            </label>

            {/* Border Radius */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Corner Radius: {panel.styling.borderRadius || 8}px
                </span>
                <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full accent-blue-500"
                    value={panel.styling.borderRadius || 8}
                    onChange={(e) => updateStyling({ borderRadius: Number(e.target.value) })}
                />
            </label>

            {/* Padding */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Padding: {panel.styling.padding || 8}px
                </span>
                <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full accent-blue-500"
                    value={panel.styling.padding || 8}
                    onChange={(e) => updateStyling({ padding: Number(e.target.value) })}
                />
            </label>

            {/* Text Align */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Text Align</span>
                <select
                    value={panel.styling.contentAlign || "left"}
                    onChange={(e) =>
                        updateStyling({
                            contentAlign: e.target.value as "left" | "center" | "right",
                        })
                    }
                    className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>
            </label>

            {/* Delete Button */}
            <div className="pt-4">
                <button
                    onClick={() => onDelete(panel.i)}
                    className="w-full rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                    Delete Panel
                </button>
            </div>
        </div>
    );
}