'use client'
import React, { useMemo } from 'react'
import { PanelData } from '@/app/page'

export default function PanelEditor({
  panels,
  setPanels,
  selectedPanelId,
  setSelectedPanelId,
}: {
  panels: PanelData[]
  setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>
  selectedPanelId: string | null
  setSelectedPanelId: (id: string | null) => void
}) {
  const sorted = useMemo(
    () => [...panels].sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [panels]
  )

  const selected = panels.find(p => p.i === selectedPanelId) ?? null

  const handleDelete = () => {
    if (!selected) return
    setPanels(prev => prev.filter(p => p.i !== selected.i))
    setSelectedPanelId(null)
  }

  const handleZChange = (value: number) => {
    if (!selected) return
    setPanels(prev =>
      prev.map(p => (p.i === selected.i ? { ...p, zIndex: value } : p))
    )
  }

  const handleRadiusChange = (value: number) => {
    if (!selected) return
    setPanels(prev =>
      prev.map(p => (p.i === selected.i ? { ...p, borderRadius: value } : p))
    )
  }

  const swapZ = (aId: string, bId: string) => {
    setPanels(prev => {
      const a = prev.find(p => p.i === aId)
      const b = prev.find(p => p.i === bId)
      if (!a || !b) return prev
      const az = a.zIndex ?? 0
      const bz = b.zIndex ?? 0
      return prev.map(p =>
        p.i === aId ? { ...p, zIndex: bz } : p.i === bId ? { ...p, zIndex: az } : p
      )
    })
  }

  const moveUp = (id: string) => {
    const idx = sorted.findIndex(p => p.i === id)
    if (idx < 0 || idx === sorted.length - 1) return
    const below = sorted[idx + 1]
    swapZ(id, below.i)
  }

  const moveDown = (id: string) => {
    const idx = sorted.findIndex(p => p.i === id)
    if (idx <= 0) return
    const above = sorted[idx - 1]
    swapZ(id, above.i)
  }

  return (
    <aside
      className="w-[320px] rounded-xl bg-neutral-900 text-white p-4 shadow-xl sticky top-4"
      aria-label="Panel editor sidebar"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Layers</h3>
        <p className="text-xs text-neutral-400">
          Topmost first{!selected && ' · Select a panel to adjust layers'}
        </p>
      </div>

      <ul role="list" className="space-y-2 mb-6">
        {sorted.map(p => {
          const isSelected = p.i === selectedPanelId
          const canAdjustThis = isSelected && !!selected
          return (
            <li
              key={p.i}
              className={`flex items-center justify-between rounded-lg border transition-colors ${
                isSelected ? 'border-yellow-400 bg-yellow-400/10' : 'border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedPanelId(p.i)}
                className="flex-1 text-left px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 focus:ring-offset-neutral-900"
                aria-pressed={isSelected}
                aria-label={`Select panel ${p.panelProps.type}`}
              >
                <div className="text-sm font-medium capitalize">{p.panelProps.type}</div>
                <div className="text-xs text-neutral-400">z {p.zIndex ?? 0}</div>
              </button>
              {canAdjustThis && (
                <div className="flex items-center gap-1 pr-2">
                  <button
                    type="button"
                    onClick={() => moveUp(p.i)}
                    className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
                    aria-label="Move layer up"
                    title="Move up"
                    disabled={sorted.findIndex(x => x.i === p.i) === sorted.length - 1}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(p.i)}
                    className="px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50"
                    aria-label="Move layer down"
                    title="Move down"
                    disabled={sorted.findIndex(x => x.i === p.i) === 0}
                  >
                    ↓
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="space-y-4">
        <div>
          <label htmlFor="zindex" className="block text-sm font-medium mb-1">
            Z-Index
          </label>
          <div className="flex items-center gap-2">
            <input
              id="zindex"
              type="range"
              min={0}
              max={999}
              value={selected?.zIndex ?? 0}
              onChange={(e) => handleZChange(Number(e.target.value))}
              className="w-full"
              aria-valuemin={0}
              aria-valuemax={999}
              aria-valuenow={selected?.zIndex ?? 0}
              aria-label="Z-index slider"
              disabled={!selected}
            />
            <input
              type="number"
              className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1"
              value={selected?.zIndex ?? 0}
              onChange={(e) => handleZChange(Number(e.target.value))}
              aria-label="Z-index value"
              disabled={!selected}
            />
          </div>
        </div>

        <div>
          <label htmlFor="radius" className="block text-sm font-medium mb-1">
            Corner Radius
          </label>
          <div className="flex items-center gap-2">
            <input
              id="radius"
              type="range"
              min={0}
              max={64}
              value={selected?.borderRadius ?? 8}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="w-full"
              aria-valuemin={0}
              aria-valuemax={64}
              aria-valuenow={selected?.borderRadius ?? 8}
              aria-label="Corner radius slider"
              disabled={!selected}
            />
            <input
              type="number"
              className="w-20 bg-neutral-800 border border-neutral-700 rounded px-2 py-1"
              value={selected?.borderRadius ?? 8}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              aria-label="Corner radius value"
              disabled={!selected}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-500 text-white rounded-lg py-2 disabled:opacity-50"
          aria-label="Delete selected panel"
          disabled={!selected}
        >
          Delete Selected Panel
        </button>
      </div>
    </aside>
  )
}


