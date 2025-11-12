"use client";
import { VStack, HStack, Text, Button, Box } from "@chakra-ui/react";
import { PanelData } from "@/app/page";

export default function PanelList({
  panels,
  onEdit,
}: {
  panels: PanelData[];
  onEdit: (id: string) => void;
}) {


  return (
    <Box
      bg="gray.700"
      color="white"
      borderRadius="md"
      p={4}
      overflowY="auto"
      maxH="300px"
    >
      <Text fontWeight="bold" mb={3}>
        Panels in use
      </Text>

      <VStack align="stretch">
        {panels.map((panel) => (
          <HStack
            key={panel.i}
            justify="space-between"
            p={2}
            borderRadius="md"
            bg="gray.600"
            _hover={{ bg: "gray.500" }}
          >
            <Text>{panel.panelProps.type}</Text>
            <HStack>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => onEdit(panel.i)}
              >
                Edit
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                
              >
                Delete(not implemented)
              </Button>
            </HStack>
          </HStack>
        ))}
        {panels.length === 0 && (
          <Text fontSize="sm" color="gray.400">
            No panels yet
          </Text>
        )}
      </VStack>
    </Box>
  );
}
