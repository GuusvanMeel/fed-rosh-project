"use client";

import { Reorder } from "framer-motion";
import { useState } from "react";
import VideoPanel from "../component/panels/VideoPanel";
import Section from "../component/Sections/Section";
import { chakra, ChakraProvider } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import SectionCanvas from "../component/Sections/SectionCanvas";

export default function MovableColumnList() {
 

  return (
    <Provider>

    <SectionCanvas></SectionCanvas>
    </Provider>
  );
}
