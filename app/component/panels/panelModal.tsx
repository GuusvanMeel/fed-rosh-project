'use client';
import { PanelData } from '@/app/types/panel';
import { Button, ButtonGroup, Heading, ColorPicker, HStack, Portal, parseColor, Slider } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';

type Props = {
  panel: PanelData | null;
  onUpdate: (updated: PanelData) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export default function PanelSettingsModal({ panel, onUpdate, onClose, onDelete }: Props) {
  const [draft, setDraft] = useState<PanelData | null>(panel);

  useEffect(() => {
    setDraft(panel);
  }, [panel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!panel || !draft) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-settings-title"
      aria-describedby="panel-settings-desc"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-neutral-900 text-white shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between m-3! px-6 pt-6">
          <div>
            <h2 id="panel-settings-title" className="text-lg font-semibold">Edit Panel Settings</h2>
            <p id="panel-settings-desc" className="mt-1 text-xs text-neutral-400">
              Update content and appearance for the selected panel.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 h-8 w-8 flex items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4 m-3! flex flex-col gap-4">
          {/* Panel Content */}
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Content</span>
            <input
              type="text"
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
          <ColorPicker.Root
            defaultValue={parseColor(draft.backgroundColor)}
            maxW="200px"
            className="border border-white/20 rounded-lg p-2 shadow-sm"
            onValueChange={(e) => setDraft({ ...draft, backgroundColor: e.value.toString("hex") })}>
            <ColorPicker.HiddenInput />
            <Heading size="lg">Background Color</Heading>
            <ColorPicker.Control
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.5rem",
                padding: "0.4rem",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}>
              <ColorPicker.Input />
              <ColorPicker.Trigger />
            </ColorPicker.Control>
            <Portal>
              <ColorPicker.Positioner>
                <ColorPicker.Content>
                  <ColorPicker.Area />
                  <HStack>
                    <ColorPicker.EyeDropper size="xs" variant="outline" />
                    <ColorPicker.Sliders />
                  </HStack>
                </ColorPicker.Content>
              </ColorPicker.Positioner>
            </Portal>
          </ColorPicker.Root>



          {/* Corner Radius */}

          <Slider.Root min={0} max={100} size="md" defaultValue={[draft.borderRadius ?? 8]}
            variant="outline"
            onValueChange={(e) => setDraft({ ...draft, borderRadius: Number(e.value) })}
          >
            <HStack justify="space-between">
              <Slider.Label
              >Corner Radius</Slider.Label>
              <Slider.ValueText />
            </HStack>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>


          {/* Text Color */}
          <ColorPicker.Root
            defaultValue={parseColor(draft.textColor || "#ffffff")}
            maxW="200px"
            className="border border-white/20 rounded-lg p-2 shadow-sm"
            onValueChange={(e) => setDraft({ ...draft, textColor: e.value.toString("hex") })}>
            <ColorPicker.HiddenInput />
            <Heading size="lg">Text Color</Heading>
            <ColorPicker.Control
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.5rem",
                padding: "0.4rem",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}>
              <ColorPicker.Input />
              <ColorPicker.Trigger />
            </ColorPicker.Control>
            <Portal>
              <ColorPicker.Positioner>
                <ColorPicker.Content>
                  <ColorPicker.Area />
                  <HStack>
                    <ColorPicker.EyeDropper size="xs" variant="outline" />
                    <ColorPicker.Sliders />
                  </HStack>
                </ColorPicker.Content>
              </ColorPicker.Positioner>
            </Portal>
          </ColorPicker.Root>

          {/* Font Size */}
          <Slider.Root min={8} max={64} size="md" defaultValue={[draft.fontSize ?? 16]}
            variant="outline"
            onValueChange={(e) => setDraft({ ...draft, fontSize: Number(e.value) })}
          >
            <HStack justify="space-between">
              <Slider.Label
              >Font Size</Slider.Label>
              <Slider.ValueText />
            </HStack>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>


          {/* Padding */}
          <Slider.Root min={0} max={50} size="md" defaultValue={[draft.padding ?? 8]}
            variant="outline"
            onValueChange={(e) => setDraft({ ...draft, padding: Number(e.value) })}
          >
            <HStack justify="space-between">
              <Slider.Label
              >Padding</Slider.Label>
              <Slider.ValueText />
            </HStack>
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
            </Slider.Control>
          </Slider.Root>

          {/* Text Align */}
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Text Align</span>
            <select
              value={draft.contentAlign ?? "left"}
              onChange={(e) => setDraft({ ...draft, contentAlign: e.target.value as any })}
              className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </label>

          {/* Actions */}
          <div className="mt-6 flex self-center gap-3">
            <ButtonGroup size="sm" variant="outline">
              <Button colorPalette="blue" onClick={() => { onUpdate(draft); onClose(); }} >Save Panel</Button>
              <Button onClick={() => { onClose(); }}>Cancel</Button>
            </ButtonGroup>
          </div>

        </div>
      </div>
    </div>
  );
}
