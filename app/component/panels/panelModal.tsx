'use client';
import React, { useState, useEffect } from 'react';
import { PanelData } from '@/app/page';

type Props = {
  panel: PanelData | null;
  onUpdate: (updated: PanelData) => void;
  onClose: () => void;
};

export default function PanelSettingsModal({ panel, onUpdate, onClose }: Props) {
  const [draft, setDraft] = useState<PanelData | null>(panel);

  // When a new panel is selected, sync into draft
  useEffect(() => {
    setDraft(panel);
  }, [panel]);

  if (!panel || !draft) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white text-black rounded-lg p-6 w-[28rem]">
        <h2 className="text-lg font-semibold mb-4">Edit Panel Settings</h2>

        <div className="flex flex-col gap-3">
          <label className="flex flex-col">
            <span className="text-sm font-medium mb-1">Content</span>
            <input
              type="text"
              className="border rounded p-2"
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
            <input
              type="color"
              value={draft.backgroundColor}
              onChange={(e) =>
                setDraft({ ...draft, backgroundColor: e.target.value })
              }
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-neutral-300 rounded px-3 py-1"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onUpdate(draft);
              onClose();
            }}
            className="bg-blue-600 text-white rounded px-3 py-1"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
