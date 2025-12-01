"use client";

import React, { useState } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { LuBox, LuPalette } from "react-icons/lu";
import { panelRegistry } from "@/app/component/panels/panelRegistry";
import { paletteRegistry } from "../design-patterns/designPaletteTypes";
import { PanelWrapper } from "./panels/panelWrapper";
import { PanelData } from "../types/panel";
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
    }
  ];

  const handleItemClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
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
                      type: "text",
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
export function getDefaultContent(panelType: string): string | string[] {
  switch (panelType) {
    case 'text':
      return 'Sample text content';
    case 'video':
      return 'https://example.com/sample-video.mp4';
    case 'image':
      return 'https://example.com/sample-image.png';
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
