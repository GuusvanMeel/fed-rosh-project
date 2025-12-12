import { PanelData } from "@/app/types/panel";

export function PanelSettingsForm({
    panel,
    onUpdate,
    onDelete,
}: {
    panel: PanelData;
    onUpdate: (updated: PanelData) => void;
    onDelete: (id: string) => void;
}) {
    const panelType = panel.panelProps.type;
    
    const updateStyling = (styleUpdates: Partial<PanelData['styling']>) => {
        onUpdate({
            ...panel,
            styling: { ...panel.styling, ...styleUpdates },
        });
    };

    const updateContent = (content: string | string[]) => {
        onUpdate({
            ...panel,
            panelProps: { ...panel.panelProps, content },
        });
    };

    const updatePanelSize = (sizeUpdates: { w?: number; h?: number }) => {
        onUpdate({
            ...panel,
            ...sizeUpdates,
        });
    };

    const hasTextContent = panelType === 'text' || panelType === 'scrollingText';
    const isScrollingText = panelType === 'scrollingText';
    const hasMediaContent = panelType === 'image' || panelType === 'video';
    const isUrlPanel = panelType === 'url';

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            updateContent(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            {/* Panel Type Display */}
            <div className="pb-2 border-b border-neutral-700">
                <span className="text-xs text-neutral-400 uppercase tracking-wide">
                    {panelType} Panel
                </span>
            </div>

            {/* GLOBAL FEATURES */}
            
            {/* Panel Size - Simple Number Inputs */}
            <div className="space-y-3">
                <span className="text-sm font-medium text-white block mb-2">Panel Size</span>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col">
                        <span className="text-xs text-neutral-400 mb-1">Width (px)</span>
                        <input
                            type="number"
                            min="50"
                            max="1063"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={panel.w}
                            onChange={(e) => updatePanelSize({ w: Number(e.target.value) })}
                        />
                    </label>
                    <label className="flex flex-col">
                        <span className="text-xs text-neutral-400 mb-1">Height (px)</span>
                        <input
                            type="number"
                            min="50"
                            max="2000"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={panel.h}
                            onChange={(e) => updatePanelSize({ h: Number(e.target.value) })}
                        />
                    </label>
                </div>
            </div>

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

            {/* SPECIFIC FEATURES */}

            {/* Text Content (text, scrollingText, url) */}
            {(hasTextContent || isUrlPanel) && (
                <>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">
                            {isUrlPanel ? 'Display Text' : 'Content'}
                        </span>
                        <input
                            type="text"
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter panel content"
                            value={
                                isUrlPanel && Array.isArray(panel.panelProps.content)
                                    ? panel.panelProps.content[0]
                                    : typeof panel.panelProps.content === 'string'
                                    ? panel.panelProps.content
                                    : ''
                            }
                            onChange={(e) => {
                                if (isUrlPanel && Array.isArray(panel.panelProps.content)) {
                                    updateContent([e.target.value, panel.panelProps.content[1]]);
                                } else {
                                    updateContent(e.target.value);
                                }
                            }}
                        />
                    </label>

                    {/* URL input for url panel */}
                    {isUrlPanel && (
                        <label className="flex flex-col">
                            <span className="text-sm font-medium mb-1 text-white">URL</span>
                            <input
                                type="url"
                                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com"
                                value={
                                    Array.isArray(panel.panelProps.content)
                                        ? panel.panelProps.content[1]
                                        : ''
                                }
                                onChange={(e) => {
                                    if (Array.isArray(panel.panelProps.content)) {
                                        updateContent([panel.panelProps.content[0], e.target.value]);
                                    }
                                }}
                            />
                        </label>
                    )}

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

                    {/* Font Family */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">Font</span>
                        <select
                            value={panel.styling.fontFamily || "sans-serif"}
                            onChange={(e) => updateStyling({ fontFamily: e.target.value })}
                            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="sans-serif">Sans Serif</option>
                            <option value="serif">Serif</option>
                            <option value="monospace">Monospace</option>
                            <option value="cursive">Cursive</option>
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                        </select>
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
                </>
            )}

            {/* Scrolling Direction (scrollingText only) */}
            {isScrollingText && (
                <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1 text-white">Scroll Direction</span>
                    <select
                        value={panel.styling.scrollDirection || "left"}
                        onChange={(e) => updateStyling({ scrollDirection: e.target.value as "left" | "right" })}
                        className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="left">Left to Right</option>
                        <option value="right">Right to Left</option>
                    </select>
                </label>
            )}

            {/* File Upload (image, video) */}
            {hasMediaContent && (
                <div className="flex flex-col">
                    <span className="text-sm font-medium mb-2 text-white">
                        {panelType === 'image' ? 'Image' : 'Video'} File
                    </span>
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-neutral-800/50">
                        <svg className="w-8 h-8 text-neutral-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-neutral-400">
                            Drop {panelType} or click to upload
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept={panelType === 'image' ? 'image/*' : 'video/*'}
                            onChange={handleFileUpload}
                        />
                    </label>
                </div>
            )}

            {/* Delete Button */}
            <div className="pt-4">
                <button
                    onClick={() => {
                        if (window.confirm("Weet je zeker dat je dit item wilt verwijderen?")) {
                            onDelete(panel.i);
                        }
                    }}
                    className="!w-full !rounded-lg !bg-red-600 !hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                >
                    Delete Panel
                </button>
            </div>
        </div>
    );
}