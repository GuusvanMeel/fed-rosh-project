"use client";

import { motion, Reorder, useDragControls } from "framer-motion";
import { PanelData, PanelType } from "@/app/types/panel";
import { panelRegistry } from "../panels/panelRegistry";
import { PanelWrapper } from "../panels/panelWrapper";
import { panelTypes } from "../canvas/canvasSideBar";
import { Button } from "@chakra-ui/react";
import { useState } from "react";

export interface SectionData {
    id: string;
    name: string;
    panels: PanelData[];
}

export default function Section({
    data,
    onChange,
    onDelete,
    onPanelEdit,
}: {
    data: SectionData;
    onChange: (updated: SectionData) => void;
    onDelete: () => void;
    onPanelEdit?: (panelId: string) => void;
}) {
    const Controls = useDragControls();
    const [isDragging, setIsDragging] = useState(false);

    const addPanel = (type: PanelType) => {
        const id = crypto.randomUUID();
        if (type == "countdown") {
            const newPanel: PanelData = {
                i: id,
                x: 0,
                y: 0,
                w: 3,
                h: 3,
                panelProps: { id, type, content: new Date(Date.now() + 100000).toString() },
                styling: {
                    backgroundColor: "#ffff",
                    textColor: "#030303",
                },
            };
            onChange({ ...data, panels: [...data.panels, newPanel] });
        } else if (type == "url") {
            const newPanel: PanelData = {
                i: id,
                x: 0,
                y: 0,
                w: 3,
                h: 3,
                panelProps: { id, type, content: ["New Panel", "https://www.youtube.com"] },
                styling: {
                    backgroundColor: "#ffff",
                    textColor: "#030303",
                },
            };
            onChange({ ...data, panels: [...data.panels, newPanel] });
        } else {
            const newPanel: PanelData = {
                i: id,
                x: 0,
                y: 0,
                w: 3,
                h: 3,
                panelProps: { id, type, content: "New Panel" },
                styling: {
                    backgroundColor: "#ffff",
                    textColor: "#030303",
                },
            };

            onChange({ ...data, panels: [...data.panels, newPanel] });
        }
    };

    const updatePanelOrder = (newPanels: PanelData[]) => {
        onChange({ ...data, panels: newPanels });
    };

    const handlePanelClick = (panelId: string) => {
        if (!isDragging && onPanelEdit) {
            onPanelEdit(panelId);
        }
    };

    const renderPanel = (panel: PanelData) => {
        const entry = panelRegistry[panel.panelProps.type];
        if (!entry) return <div>Unknown panel type</div>;
        const Component = entry.component;
        const mappedProps = entry.mapProps(panel.panelProps.content);

        return (
            <PanelWrapper panel={panel}>
                <Component {...mappedProps} />
            </PanelWrapper>
        );
    };

    return (
        <Reorder.Item value={data} dragListener={false} dragControls={Controls} layout>
            <motion.div
                className="p-6 space-y-6 bg-gray-100 cursor-grab active:cursor-grabbing select-none"
                layout
                onPointerDown={(e) => {
                    Controls.start(e);
                }}
            >
                {/* Section header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="text-gray-400 hover:text-gray-600">⋮⋮</div>
                        <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
                    </div>
                    <div className="flex gap-2">
                        {panelTypes.map((type) => (
                            <Button
                                key={type}
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
                                onClick={() => addPanel(type)}
                            >
                                {type === "scrollingText" ? "Scrolling Text" : type}
                            </Button>
                        ))}

                        <Button
                            size="xs"
                            variant="surface"
                            style={{
                                backgroundColor: "rgba(153,27,27,0.9)",
                                color: "white",
                                borderRadius: "0.4rem",
                                padding: "0.25rem 0.6rem",
                                fontSize: "0.75rem",
                                transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = "rgba(185,28,28,1)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = "rgba(153,27,27,0.9)")
                            }
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Panels */}
                {data.panels.length === 0 ? (
                    <div className="text-gray-400 text-center py-6">No panels yet</div>
                ) : (
                    <Reorder.Group
                        axis="x"
                        values={data.panels}
                        onReorder={updatePanelOrder}
                        className="flex gap-4 overflow-x-auto pb-2"
                    >
                        {data.panels.map((panel) => (
                            <Reorder.Item
                                key={panel.i}
                                value={panel}
                                className="min-w-[200px] cursor-grab active:cursor-grabbing"
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    setIsDragging(true);
                                }}
                                onPointerUp={() => {
                                    setTimeout(() => setIsDragging(false), 100);
                                }}
                                onClick={() => handlePanelClick(panel.i)}
                            >
                                <div className="hover:ring-2 transition-all">
                                    {renderPanel(panel)}
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </motion.div>
        </Reorder.Item>
    );
}