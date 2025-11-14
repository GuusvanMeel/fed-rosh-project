"use client";
import { PanelData } from "@/app/types/panel";
import { VStack, HStack, Text, Button, Box } from "@chakra-ui/react";



export default function PanelList({
  panels,
  onEdit,
  onDelete
}: {
  panels: PanelData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  
  return (
    <Box
      bg="rgba(32, 32, 32, 0.9)"
      color="white"
      borderRadius="xl"
      p={5}
      border="1px solid rgba(255,255,255,0.08)"
      boxShadow="0 8px 20px rgba(0,0,0,0.4)"
      maxH="300px"
      overflowY="auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.1) transparent",
      }}
    >
      <Text fontWeight="semibold" mb={4} fontSize="md" color="whiteAlpha.900">
        Panels in Use
      </Text>

      <VStack align="stretch"  gap={2} >
        {panels.map((panel) => (
          <HStack
            key={panel.i}
            justify="space-between"
            p={3}
            borderRadius="lg"
            bg="rgba(255,255,255,0.04)"
            _hover={{
              bg: "rgba(255,255,255,0.08)",
              transform: "translateY(-1px)",
              transition: "all 0.15s ease",
            }}
          >
            <Text fontSize="sm" color="whiteAlpha.900">
              {panel.panelProps.type}
            </Text>
            <HStack  gap={2}>
              <Button
                size="xs"
                variant="surface"
                style={{
                  backgroundColor: "rgba(64,64,64,0.9)",
                  color: "white",
                  borderRadius: "0.4rem",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(82,82,82,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(64,64,64,0.9)")
                }
                onClick={() => onEdit(panel.i)}
              >
                Edit
              </Button>
              <Button
                size="xs"
                variant="surface"
                style={{
                  backgroundColor: "rgba(153,27,27,0.9)",
                  color: "white",
                  borderRadius: "0.4rem",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(185,28,28,1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(153,27,27,0.9)")
                }
                onClick={() => onDelete(panel.i)}
              >
                Delete
              </Button>
            </HStack>
          </HStack>
        ))}

        {panels.length === 0 && (
          <Text fontSize="sm" color="whiteAlpha.600" textAlign="center" py={3}>
            No panels yet
          </Text>
        )}
      </VStack>
    </Box>
  );
}
