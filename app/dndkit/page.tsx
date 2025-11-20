import React from 'react'
import SectionCanvas from '../component/Sections/SectionCanvas'
import Sidebar from '../component/sidebar'

export default function page() {
  return (
    <div>
    <Sidebar></Sidebar>
    <SectionCanvas></SectionCanvas>
    </div>
  )
}
