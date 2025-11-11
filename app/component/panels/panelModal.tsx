'use client';
import React, { useState, useEffect } from 'react';
import { PanelData } from '@/app/page';

type Props = {
  panel: PanelData | null;
  onUpdate: (updated: PanelData) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export default function PanelSettingsModal({ panel, onUpdate, onClose, onDelete }: Props) {
  const [draft, setDraft] = useState<PanelData | null>(panel);

  // When a new panel is selected, sync into draft
  useEffect(() => {
    setDraft(panel);
  }, [panel]);

  // Close on Escape for accessibility
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-settings-title"
      aria-describedby="panel-settings-desc"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-neutral-900 text-white shadow-2xl ring-1 ring-white/10 m-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 id="panel-settings-title" className="text-lg font-semibold">Edit Panel Settings</h2>
            <p id="panel-settings-desc" className="mt-1 text-xs text-neutral-400">
              Update content and appearance for the selected panel.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 pt-4">

          <div className="flex flex-col gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Content</span>
              <input
                type="text"
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter panel content"
                value={
                  typeof draft.panelProps.content === 'string'
                    ? draft.panelProps.content
                    : ''
                }
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    panelProps: {
                      ...draft.panelProps,
                      content: e.target.value,
                    },
                  })
                }
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Background Color</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="h-9 w-12 cursor-pointer rounded border border-neutral-700 bg-neutral-800 p-1"
                  value={draft.backgroundColor}
                  onChange={(e) =>
                    setDraft({ ...draft, backgroundColor: e.target.value })
                  }
                  aria-label="Pick background color"
                  title="Pick background color"
                />
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={draft.backgroundColor}
                  onChange={(e) =>
                    setDraft({ ...draft, backgroundColor: e.target.value })
                  }
                  aria-label="Background color hex"
                  placeholder="#1e3a8a"
                />
              </div>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1">Corner Radius</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={64}
                  value={draft.borderRadius ?? 8}
                  onChange={(e) =>
                    setDraft({ ...draft, borderRadius: Number(e.target.value) })
                  }
                  className="flex-1 accent-yellow-400"
                  aria-label="Corner radius slider"
                />
                <input
                  type="number"
                  className="w-24 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={draft.borderRadius ?? 8}
                  onChange={(e) =>
                    setDraft({ ...draft, borderRadius: Number(e.target.value) })
                  }
                  aria-label="Corner radius value"
                />
              </div>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                onDelete(draft.i);
                onClose();
              }}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Delete selected panel"
            >
              Delete
            </button>

            <button
              onClick={() => {
                onUpdate(draft);
                onClose();
              }}
              className="ml-auto inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
