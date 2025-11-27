/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { act, useState } from "react";
import { Box, Flex, VStack, Text, Color } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { LuBox, LuPalette } from "react-icons/lu";
import { motion } from "framer-motion";
import { panelRegistry } from "@/app/component/panels/panelRegistry";
import { paletteRegistry } from "../design-patterns/designPaletteTypes";
import Droppable from "./Sections/Droppable";
import { PanelWrapper } from "./panels/panelWrapper";
import { PanelData } from "../types/panel";
import { DndContext } from "@dnd-kit/core";
import { SectionData } from "./Sections/Section";
import ColorPicker from "../design-patterns/ColorPanel";
import { useColors } from "../design-patterns/DesignContext";


// Dynamically get all panel types from the registry
export const panelTypes = Object.keys(panelRegistry) as (keyof typeof panelRegistry)[];
export const designTypes = Object.keys(paletteRegistry) as (keyof typeof paletteRegistry)[];

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const {primaryColor, secondaryColor} = useColors();

  const navItems = [
    {
      label: "Components",
      icon: LuBox,
      submenu: panelTypes,
      cursor: "grab",
      type: "components"
    },
    {
      label: "Design",
      icon: LuPalette,
      submenu: designTypes,
      cursor: "pointer",
      type: "design"
    },
    {
      label: "Settings",
      icon: FiSettings,
      submenu: ["Profile", "Account", "Privacy", "Notifications"],
      cursor: "pointer",
      type: "settings"
    },
  ];

  const handleItemClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const handleDragStart = (e: React.DragEvent, componentName: string) => {
    e.dataTransfer.setData("component", componentName);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const locationX = e.pageX;
    const locationY = e.pageY;

    console.log("Drag ended at:", locationX, locationY);
    };

  // Function to render component or text based on menu type
  const renderSubmenuItem = (subItem: string, menuType: string) => {
    if (menuType === "design") {
      const PaletteComponent = paletteRegistry[subItem]?.component;
      return (
        <Box>
          <Text color="white" fontSize="md" mb={2} fontWeight="semibold">
            {subItem}
          </Text>
          {PaletteComponent && <PaletteComponent />}
        </Box>
      );
    }
    
    return (
      <Text color="white" fontSize="lg">
        {subItem}
      </Text>
    );
  };

  return (
    <>
      {/* Main Sidebar */}
      <Flex
        h="100vh"
        w="70px"
        bg="gray.800"
        borderRight="1px solid #090909ff"
        boxShadow="xl"
      >
        <Box w={"70px"} transition="width 0.2s" p={1}>
          <VStack align="stretch" gap={4}>
            {navItems.map((item) => (
              <Flex
                key={item.label}
                align="center"
                p={3}
                borderRadius="md"
                bg={activeMenu === item.label ? "gray.900" : "transparent"}
                _hover={{ bg: "gray.900", cursor: "pointer" }}
                onClick={() => handleItemClick(item.label)}
              >
                <item.icon size={40} />
              </Flex>
            ))}
          </VStack>
        </Box>
      </Flex>

      {/* Secondary Sidebar */}
      {activeMenu && (
        <Flex
          position="fixed"
          left={"70px"}
          top={0}
          h="100vh"
          w="250px"
          bg="gray.700"
          borderRight="1px solid #090909ff"
          zIndex={999}
          boxShadow="xl"
          transition="left 0.2s"
        >
          <Box w="100%" p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={2} color="white" textAlign="center" bg="black" w={"100%"} borderRadius={6} p={2}>
              {activeMenu}
            </Text>
            <VStack align="stretch" gap={2}>
              {navItems
                .find((item) => item.label === activeMenu)
                ?.submenu.map((subItem, index) => {
                  if (activeMenu === "Design") {
                  return (
                    DesignComponent(activeMenu, subItem as string)
                  );
                }else{
                  const uniqueId = `sidebar-${subItem}-${Date.now()}-${index}`;
                  const newPanel: PanelData = {
                    i: uniqueId,
                    x: 0,
                    y: 0,
                    w: 220,
                    h: 50,
                    panelProps: {
                      id: crypto.randomUUID(),
                      type: subItem,
                      content: getDefaultContent(subItem),
                      currentIndex: 1,
                      layout: undefined
                    },
                    styling: {
                      backgroundColor: secondaryColor,
                      borderRadius: 8,
                      fontSize: 14,
                      fontFamily: "sans-serif",
                      textColor: primaryColor,
                      padding: 8,
                      contentAlign: "left"
                      
                    }
                  };

                  console.log("Creating sidebar panel with ID:", uniqueId);

                  return (
                    <div 
                      key={`sidebar-item-${subItem}-${index}`}
                      className="p-2 rounded bg-gray-600 hover:bg-gray-500 cursor-grab active:cursor-grabbing"
                    >
                      <PanelWrapper panel={newPanel}>
                        <Text color={primaryColor} fontSize="lg">
                          {subItem}
                        </Text>
                      </PanelWrapper>
                    </div>
                  );
                  }
                })}
            </VStack>
          </Box>
        </Flex>
      )}
    </>
  );
}

// Helper function to get default content for each panel type
function getDefaultContent(panelType: string): string | string[] {
  switch (panelType) {
    case 'text':
      return 'Sample text content';
    case 'video':
      return 'https://example.com/sample-video.mp4';
    case 'image':
      return '/globe.svg';
    case 'countdown':
      return new Date(Date.now() + 24 * 60 * 60 * 1000).getTime().toString(); // 24 hours from now
    case 'scrollingText':
      return 'This is scrolling text content';
    case 'url':
      return ['Click here', 'https://example.com'];
    case 'bracket':
      return 'Tournament Bracket';
    default:
      return 'Default content';
  }
}

function DesignComponent(menuType : string, subItem: string) {
  if (menuType !== "Design") return null;

  const PaletteComponent = paletteRegistry[subItem]?.component;

  return (
    <Box key={subItem} mb={4}>
      <Text color="white" fontSize="md" mb={2} fontWeight="semibold">
        {subItem}
      </Text>
      {<PaletteComponent />}
      
    </Box>
  );
}
