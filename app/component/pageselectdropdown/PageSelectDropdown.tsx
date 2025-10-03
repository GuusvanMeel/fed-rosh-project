'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PanelSettingsProps } from '../panelsettings/PanelSettings'

export default function PageSelectDropdown({ onSelectionChange }: { onSelectionChange: (page: PanelSettingsProps | null) => void }) {
  const [pages, setPages] = useState<PanelSettingsProps[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>('')

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await axios.get('/api/editcanvas') // your API
        setPages(res.data.data) // extract the "data" array
      } catch (err) {
        console.error(err)
      }
    }

    fetchPages()
  }, [])

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedPageId(selectedId);
    
    if (selectedId === '') {
      onSelectionChange(null);
    } else {
      const selectedPage = pages.find(page => page.id === selectedId);
      onSelectionChange(selectedPage || null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="page-select" className="text-white">Select a page:</label>
      <select
        id="page-select"
        value={selectedPageId}
        onChange={handleSelectionChange}
        className="p-2 rounded"
      >
        <option value="">-- Choose a page --</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            Page {page.id} ({page.width}x{page.height})
          </option>
        ))}
      </select>
    </div>
  )
}