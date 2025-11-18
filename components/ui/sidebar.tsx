"use client";

import React, { useState } from "react";
import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { LuBox, LuPalette } from "react-icons/lu";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Components", icon: LuBox },
    { label: "Design", icon: LuPalette },
    { label: "Settings", icon: FiSettings },
  ];

  return (
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
      <Box w={collapsed ? "70px" : "200px"} transition="width 0.2s" p={1}>
        <VStack align="stretch" spacing={4}>
          {navItems.map((item) => (
            <Flex
              key={item.label}
              align="center"
              p={3}
              borderRadius="md"
              _hover={{ bg: "gray.900", cursor: "pointer" }}
              onClick={() => setCollapsed(!collapsed)}
            >
              <item.icon size={50} />
              {!collapsed && (
                <Text ml={3} fontSize="md" fontWeight="medium">
                  {item.label}
                </Text>
              )}
            </Flex>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
}