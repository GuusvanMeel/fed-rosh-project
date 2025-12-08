import { ColumnSectionData } from '@/app/types/section';
import React, { useState } from 'react'
import NewDroppable from './NewDroppable';

export default function NewColumnSection({ data,
  onChange,
}: {
  data: ColumnSectionData;
  onChange: (updated: ColumnSectionData) => void;
}) 

{
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

 const onZoneClick = (zoneId: string) => {
  console.log("Clicked zone:", zoneId);
  setSelectedZones(prev =>
    prev.includes(zoneId) ? prev : [...prev, zoneId]
  );
};

return (
  <div className="p-4 rounded border border-gray-600 bg-gray-200">
    <h2 className="font-bold mb-3 text-gray-900">{data.name}</h2>

    {/* --- FIXED 12-COLUMN GRID WRAPPER --- */}
    <div
      className="grid gap-2 p-2"
      style={{
        gridTemplateColumns: "repeat(12, 1fr)",
        background: "rgba(0,0,0,0.05)",
        outline: "2px dashed #666",
      }}
    >
      {data.dropZones.map((zone, i) => (
        <div
          key={zone.id}
          style={{
            gridColumn: `span ${zone.span}`,
            background: i % 2 === 0 ? "rgba(255,180,0,0.25)" : "rgba(0,180,255,0.25)",
            border: "2px solid #444",
            minHeight: "80px",
          }}
          className="p-2 rounded-lg relative"
          onClick={() => onZoneClick(zone.id)}
        >
          <NewDroppable UID={zone.id} OnDelete={() => {}}>
            <div className="font-semibold text-sm mb-1 text-gray-900">
              Dropzone: {zone.id} (span {zone.span})
            </div>

            {/* Panels */}
            {data.panels
              .filter((p) => p.dropZoneId === zone.id)
              .map((panel) => (
                <div
                  key={panel.i}
                  className="p-2 mb-2 rounded bg-gray-800 text-white shadow-md"
                >
                  Panel: {panel.i}
                </div>
              ))}
          </NewDroppable>
        </div>
      ))}
    </div>
     <div
    className="fixed bottom-4 right-4 bg-black shadow-xl rounded-lg border border-gray-300 p-4 w-56 z-50"
  >
    <h3 className="font-bold mb-2">Selected Dropzones</h3>

    <ul className="space-y-1 text-sm">
      {selectedZones.map(id => (
        <li
          key={id}
          className="flex justify-between items-center bg-black-100 rounded px-2 py-1"
        >
          {id}
          <button
            onClick={() =>
              setSelectedZones(prev => prev.filter(z => z !== id))
            }
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>

    <button
      onClick={() => setSelectedZones([])}
      className="mt-2 text-sm text-blue-600 hover:underline"
    >
      Clear All
    </button>
    
  </div>


  </div>
  
);}
