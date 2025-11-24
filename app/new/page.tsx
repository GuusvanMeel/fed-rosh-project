"use client";

import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar from "../component/sidebar";


export default function MovableColumnList() {
  
 

return (
  <Provider>
    <div className="flex w-full h-screen overflow-x-hidden">
      <Sidebar />
      <SectionCanvas />
    </div>
  </Provider>
);


}