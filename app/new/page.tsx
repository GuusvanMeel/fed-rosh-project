"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";
import VideoPanel from "../component/panels/VideoPanel";

export default function MovableColumnList() {
  const [items, setItems] = useState([
    "Column A",
    "Column B",
    "Column C",
    "Column D",
  ]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="flex flex-col gap-4"
      >
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            className="p-6 bg-white rounded-2xl shadow-lg cursor-grab active:cursor-grabbing h-[500px] min-w-[150px] text-center font-semibold pointer-none: select-none"
            whileDrag={{ scale: 1.05 }}
          >
            <VideoPanel source="https://www.youtube.com/watch?v=cN9p0AYDA8A"></VideoPanel>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
