"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";
import VideoPanel from "../component/panels/VideoPanel";
import ImagePanel from "../component/panels/ImagePanel";
import ScrollingTextPanel from "../component/panels/ScrollingTextPanel";
import TextPanel from "../component/panels/TextPanel";
import UrlPanel from "../component/panels/UrlPanel";

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

  const renderPanel = (type: string) => {
    switch (type) {
      case "VideoPanel":
        return <VideoPanel source="https://www.youtube.com/watch?v=YYjyjxeF5Jk" />;
      case "BracketPanel":
        return <BracketPanel />;
      case "CountdownPanel":
        return <CountdownPanel />;
      case "ImagePanel":
        return <ImagePanel />;
      case "ScrollingTextPanel":
        return <ScrollingTextPanel />;
      case "TextPanel":
        return <TextPanel />;
      case "UrlPanel":
        return <UrlPanel />;
      default:
        return <div>Unknown Panel</div>;
    }
  };

  return (
    <div 
      className="flex flex-col gap-4 p-4 min-h-screen"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="mb-4 p-4 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg text-center">
        <p className="text-blue-600 font-medium">Drop components here from the sidebar</p>
      </div>
      
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex flex-col gap-4"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="p-6 bg-white rounded-2xl shadow-lg cursor-grab active:cursor-grabbing h-[500px] min-w-[150px] text-center font-semibold select-none"
            whileDrag={{ scale: 1.05 }}
          >
            {renderPanel(item.type)}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}