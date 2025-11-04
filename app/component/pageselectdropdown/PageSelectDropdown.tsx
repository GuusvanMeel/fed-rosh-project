'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PanelSettingsProps } from '../canvas/canvasSideBar'

export default function PageSelectDropdown({ onSelectionChange }: { onSelectionChange: (page: PanelSettingsProps | null) => void }) {
  const [pages, setPages] = useState<PanelSettingsProps[]>([])
  const [selectedPageId, setSelectedPageId] = useState<string>('')

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await axios.get('/api/editcanvas')
        setPages(res.data.data)
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
    <div className="bg-white border rounded-lg p-4 flex items-center gap-3 w-96">
      <span className="text-black w-48">Select a page:</span>
      <select
        value={selectedPageId}
        onChange={handleSelectionChange}
        className="w-24 px-2 py-1 border rounded-md text-center text-black shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Choose --</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            Page {page.id}
          </option>
        ))}
      </select>
    </div>
  )
}