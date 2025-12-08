"use client"
import { ColumnSectionData } from '@/app/types/section';
import React, { useState } from 'react'
import NewColumnSection from './NewColumnSection';


export default function NewColumnSectionCanvas() {
  const [sections, setSections] = useState<ColumnSectionData[]>([
    {
      id: "s1",
      name: "Section 1",
      dropZones: [
        { id: "dz1", span: 1 },
        { id: "dz2", span: 1 },
        { id: "dz3", span: 1 },
        { id: "dz4", span: 1 },
        { id: "dz5", span: 1 },
        { id: "dz6", span: 1 },
        { id: "dz7", span: 1 },
        { id: "dz8", span: 1 },
        { id: "dz9", span: 1 },
        { id: "dz10", span: 1 },
        { id: "dz11", span: 1 },
        { id: "dz12", span: 1 },
      ],
      panels: [],
    },
  ]);

  return (
  <div className="flex flex-1">
    <div className="flex-1 w-full">
      {sections.map((section) => (
        <NewColumnSection
          key={section.id}
          data={section}
          onChange={(updated) =>
            setSections((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            )
          }
        />
      ))}
    </div>
  </div>
);}