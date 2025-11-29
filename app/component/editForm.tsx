import React from 'react'
import { PanelData } from '../types/panel';
import UploadWidget from './UploadWidget';
import { ColorPicker, ColorPickerChannelSlider, Slider, Stack, parseColor, Input, InputGroup, NumberInput, Button, Menu, Portal, NativeSelect, For, Select, createListCollection } from '@chakra-ui/react';
import { LuCheck } from "react-icons/lu"

export default function EditForm({
    panel,
    onUpdate,
    onDelete,
}: {
    panel: PanelData;
    onUpdate: (updated: PanelData) => void;
    onDelete: (id: string) => void;
}) {
    const panelType = panel.panelProps.type;


    const swatches = ["red", "blue", "green"]

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

    const updateMedia = (content: string) => {
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

            {/* Panel Size */}
            <div className="space-y-3">
                <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1 text-white">
                        Width: {panel.w} units
                    </span>
                    <Slider.Root defaultValue={[panel.w]} size={"md"} min={20} max={400} key={"width-slider-" + panel.i}
                        onValueChange={(e) => updatePanelSize({ w: Number(e.value) })}>
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1 text-white">
                        Height: {panel.h} units
                    </span>
                    <Slider.Root defaultValue={[panel.w]} size={"md"} min={20} max={1000} key={"height-slider-" + panel.i}
                        onValueChange={(e) => updatePanelSize({ h: Number(e.value) })}>
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                </label>
            </div>

            {/* Background Color */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">Background Color</span>
                <ColorPicker.Root
                    defaultValue={parseColor(panel.styling.backgroundColor)}
                    key={"Background-color-picker-" + panel.i}
                    onValueChange={(e) => {
                        // Update background color
                        updateStyling({ backgroundColor: e.value.toString("hex") });

                        // Get the alpha channel value (0-1)
                        const alpha = e.value.getChannelValue("alpha");
                        updateStyling({ opacity: alpha });
                    }}>
                    <ColorPicker.HiddenInput />
                    <ColorPicker.Label />
                    <ColorPicker.Control>
                        <ColorPicker.Input />
                        <ColorPicker.Trigger />
                    </ColorPicker.Control>
                    <ColorPicker.Positioner>
                        <ColorPicker.Content>
                            <ColorPicker.Area />
                            <ColorPicker.EyeDropper />
                            <Stack>
                                <ColorPickerChannelSlider channel="hue" />
                                <ColorPickerChannelSlider channel="alpha" />
                            </Stack>

                            <ColorPicker.SwatchGroup>
                                {swatches.map((item) => (
                                    <ColorPicker.SwatchTrigger key={item} value={item}>
                                        <ColorPicker.Swatch value={item}>
                                            <ColorPicker.SwatchIndicator>
                                                <LuCheck />
                                            </ColorPicker.SwatchIndicator>
                                        </ColorPicker.Swatch>
                                    </ColorPicker.SwatchTrigger>
                                ))}
                            </ColorPicker.SwatchGroup>
                        </ColorPicker.Content>
                    </ColorPicker.Positioner>
                </ColorPicker.Root>
            </label>

            {/* Border Radius */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Corner Radius: {panel.styling.borderRadius || 8}px
                </span>
                <Slider.Root defaultValue={[panel.w]} size={"md"} min={0} max={50} key={"corner-radius-slider-" + panel.i}
                    onValueChange={(e) => updateStyling({ borderRadius: Number(e.value) })}>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumbs />
                    </Slider.Control>
                </Slider.Root>
            </label>

            {/* Padding */}
            <label className="flex flex-col">
                <span className="text-sm font-medium mb-1 text-white">
                    Padding: {panel.styling.padding || 8}px
                </span>
                <Slider.Root defaultValue={[panel.w]} size={"md"} min={0} max={50} key={"padding-slider-" + panel.i}
                    onValueChange={(e) => updateStyling({ padding: Number(e.value) })}>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Range />
                        </Slider.Track>
                        <Slider.Thumbs />
                    </Slider.Control>
                </Slider.Root>
            </label>

            {/* Text Content (text, scrollingText, url) */}
            {(hasTextContent || isUrlPanel) && (
                <>
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">
                            {isUrlPanel ? 'Display Text' : 'Content'}
                        </span>
                        <Input
                            placeholder="Enter panel content"
                            defaultValue={isUrlPanel && Array.isArray(panel.panelProps.content)
                                ? panel.panelProps.content[0]
                                : typeof panel.panelProps.content === 'string'
                                    ? panel.panelProps.content
                                    : ''}
                            onChange={(e) => {
                                if (isUrlPanel && Array.isArray(panel.panelProps.content)) {
                                    updateContent([e.target.value, panel.panelProps.content[1]]);
                                } else {
                                    updateContent(e.target.value);
                                }

                            }}>
                        </Input>
                    </label>

                    {/* URL input for url panel */}
                    {isUrlPanel && (
                        <label className="flex flex-col">
                            <span className="text-sm font-medium mb-1 text-white">URL</span>
                            <InputGroup startAddon="https://">
                                <Input
                                    placeholder="example.com"
                                    defaultValue={Array.isArray(panel.panelProps.content)
                                        ? panel.panelProps.content[1]
                                        : ''}
                                    onChange={(e) => {
                                        if (Array.isArray(panel.panelProps.content)) {
                                            updateContent([panel.panelProps.content[0], e.target.value]);
                                        }

                                    }}>
                                </Input>
                            </InputGroup>
                        </label>
                    )}

                    {/* Text Color */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">Text Color</span>
                        <ColorPicker.Root
                            value={parseColor(panel.styling.textColor ?? "#000000")}
                            key={"Background-color-picker-" + panel.i}
                            onValueChange={(e) => {
                                // Update background color
                                updateStyling({ textColor: e.value.toString("hex") });
                            }}>
                            <ColorPicker.HiddenInput />
                            <ColorPicker.Label />
                            <ColorPicker.Control>
                                <ColorPicker.Input />
                                <ColorPicker.Trigger />
                            </ColorPicker.Control>
                            <ColorPicker.Positioner>
                                <ColorPicker.Content>
                                    <ColorPicker.Area />
                                    <ColorPicker.EyeDropper />
                                    <Stack>
                                        <ColorPickerChannelSlider channel="hue" />
                                    </Stack>

                                    <ColorPicker.SwatchGroup>
                                        {swatches.map((item) => (
                                            <ColorPicker.SwatchTrigger key={item} value={item}>
                                                <ColorPicker.Swatch value={item}>
                                                    <ColorPicker.SwatchIndicator>
                                                        <LuCheck />
                                                    </ColorPicker.SwatchIndicator>
                                                </ColorPicker.Swatch>
                                            </ColorPicker.SwatchTrigger>
                                        ))}
                                    </ColorPicker.SwatchGroup>
                                </ColorPicker.Content>
                            </ColorPicker.Positioner>
                        </ColorPicker.Root>
                    </label>

                    {/* Font Size */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">
                            Font Size: {panel.styling.fontSize || 16}px
                        </span>

                        <NumberInput.Root
                            value={panel.styling.fontSize?.toString() ?? "16"}
                            min={8} max={64}
                            onValueChange={(e) => updateStyling({ fontSize: Number(e.value) })}>

                            <NumberInput.Label />
                            <NumberInput.Control>
                                <NumberInput.IncrementTrigger />
                                <NumberInput.DecrementTrigger />
                            </NumberInput.Control>
                            <NumberInput.Scrubber />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </label>

                    {/* Font Family */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">
                            Font Family: {panel.styling.fontFamily || "sans-serif"}
                        </span>

                        <NativeSelect.Root size="md" width="240px">
                            <NativeSelect.Field
                                value={panel.styling.fontFamily}
                                onChange={(e) => updateStyling({ fontFamily: e.currentTarget.value })}
                            >
                                <option style={{ fontFamily: "sans-serif" }} value="sans-serif">Sans Serif</option>
                                <option style={{ fontFamily: "serif" }} value="serif">Serif</option>
                                <option style={{ fontFamily: "monospace" }} value="monospace">Monospace</option>
                                <option style={{ fontFamily: "cursive" }} value="cursive">Cursive</option>
                                <option style={{ fontFamily: "Arial" }} value="Arial">Arial</option>
                                <option style={{ fontFamily: "Times New Roman" }} value="Times New Roman">Times New Roman</option>
                                <option style={{ fontFamily: "Courier New" }} value="Courier New">Courier New</option>
                                <option style={{ fontFamily: "Georgia" }} value="Georgia">Georgia</option>
                                <option style={{ fontFamily: "Verdana" }} value="Verdana">Verdana</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />

                        </NativeSelect.Root>
                        
                    </label>

                    {/* Text Align */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium mb-1 text-white">Text Align</span>
                        <NativeSelect.Root size="md" width="240px">
                            <NativeSelect.Field
                                value={panel.styling.contentAlign}
                                onChange={(e) => updateStyling({ contentAlign: e.target.value as "left" | "center" | "right" })}
                            >
                                <option  value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />

                        </NativeSelect.Root>
                    </label>
                </>
            )}

            {/* Scrolling Direction (scrollingText) */}
            {isScrollingText && (
                <label className="flex flex-col">
                    <span className="text-sm font-medium mb-1 text-white">Scroll Direction</span>

                    <NativeSelect.Root size="md" width="240px">
                            <NativeSelect.Field
                                onChange={(e) => updateStyling({ scrollDirection: e.target.value as "left" | "right" })}
                                value={panel.styling.scrollDirection}
                            >
                                <option  value="left">Left</option>
                                <option value="right">Right</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />

                        </NativeSelect.Root>
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
                        <UploadWidget changeMedia={updateMedia}>

                        </UploadWidget>
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
                    className="!w-full !rounded-lg !bg-red-600 hover:!bg-red-700 px-4 py-2 text-sm !font-medium text-white transition-colors"
                >
                    Delete Panel
                </button>
            </div>
        </div>
    );
}
