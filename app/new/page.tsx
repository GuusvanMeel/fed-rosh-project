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

interface PanelItem {
  id: string;
  type: string;
}

export default function MovableColumnList() {
  
 

return (
  <Provider>
    <div className="flex w-full h-screen">
      <Sidebar />
      <SectionCanvas />
    </div>
  </Provider>
);


}