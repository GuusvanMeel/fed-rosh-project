"use client"
import NewColumnSectionCanvas from '../component/Sections/NewSection/NewColumnSectionCanvas'
import { DndContext } from '@dnd-kit/core'
import Sidebar from '../component/sidebar'

export default function page() {
  return (
   <div className="flex w-full">
    <DndContext>
    <Sidebar/>
    <div className="flex-1">
          <NewColumnSectionCanvas />
        </div>

    </DndContext> 
    </div>
  )
}
