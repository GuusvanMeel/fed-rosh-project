"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";
import VideoPanel from "../component/panels/VideoPanel";
import ImagePanel from "../component/panels/ImagePanel";
import ScrollingTextPanel from "../component/panels/ScrollingTextPanel";
import TextPanel from "../component/panels/TextPanel";
import UrlPanel from "../component/panels/UrlPanel";
import { CountdownPanel } from "../component/panels/CountdownPanel";
import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";
import Sidebar from "../component/sidebar";
import { Flex } from "@chakra-ui/react";
import { ColorProvider } from "../design-patterns/DesignContext";

interface PanelItem {
  id: string;
  type: string;
}

export default function MovableColumnList() {
  const [items, setItems] = useState<PanelItem[]>([
    { id: "1", type: "VideoPanel" },
    { id: "2", type: "VideoPanel" },
    { id: "3", type: "VideoPanel" },
    { id: "4", type: "VideoPanel" },
  ]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentName = e.dataTransfer.getData("component");
    
    if (componentName) {
      const newItem: PanelItem = {
        id: `${Date.now()}`,
        type: componentName,
      };
      setItems([...items, newItem]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

 

return (
  <Provider>
    <ColorProvider>
    <div className="flex w-full h-screen">
      <Sidebar />
      <SectionCanvas />
    </div>
    </ColorProvider>
  </Provider>
);


}