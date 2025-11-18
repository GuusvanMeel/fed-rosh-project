"use client";

import React, { useState } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { LuBox, LuPalette } from "react-icons/lu";
import { motion } from "framer-motion";
import { panelRegistry } from "@/app/component/panels/panelRegistry";

// Dynamically get all panel types from the registry
export const panelTypes = Object.keys(panelRegistry) as (keyof typeof panelRegistry)[];

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navItems = [
    { 
      label: "Components", 
      icon: LuBox,
      submenu: panelTypes,
      cursor: "grab"
    },
    { 
      label: "Design", 
      icon: LuPalette,
      submenu: ["Colors", "Typography", "Spacing", "Layout"],
      cursor: "pointer"
    },
    { 
      label: "Settings", 
      icon: FiSettings,
      submenu: ["Profile", "Account", "Privacy", "Notifications"],
      cursor: "pointer"
    },
  ];

  const handleItemClick = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const handleDragStart = (e: React.DragEvent, componentName: string) => {
    e.dataTransfer.setData("component", componentName);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <>
      {/* Main Sidebar */}
      <Flex
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        bg="gray.800"
        borderRight="1px solid #090909ff"
        zIndex={1000}
        boxShadow="xl"
      >
        <Box w={"70px"} transition="width 0.2s" p={1}>
          <VStack align="stretch" spacing={4}>
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
            <Text fontSize="lg" fontWeight="bold" mb={4} color="white">
              {activeMenu}
            </Text>
            <VStack align="stretch" spacing={2}>
              {navItems
                .find((item) => item.label === activeMenu)
                ?.submenu.map((subItem) => (
                  <motion.div
                    key={subItem}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, subItem)}
                    whileHover={{ backgroundColor: "rgba(0, 0, 0)" }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "12px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(17, 17, 17, 0.55)",
                      userSelect: "none",
                      cursor: navItems.find((item) => item.label === activeMenu)?.cursor || "pointer",
                    }}
                  >
                    <Text color="white" fontSize="lg">
                      {subItem}
                    </Text>
                  </motion.div>
                ))}
            </VStack>
          </Box>
        </Flex>
      )}
    </>
  );
}
