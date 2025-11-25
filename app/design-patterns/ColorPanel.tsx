"use client";

import { Box, Button, Input } from "@chakra-ui/react";
import { useColors } from "../design-patterns/DesignContext";

export default function ColorPicker() {
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    accentColor,
    setAccentColor,
    applyColorsToAllPanels,
  } = useColors();

  return (
    <Box>
      <p className="text-center text-small">Primary Color</p>
      <Input
        type="color"
        value={primaryColor}
        onChange={(e) => setPrimaryColor(e.target.value)}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <p className="text-center">Secondary Color</p>
      <Input
        type="color"
        value={secondaryColor}
        onChange={(e) => setSecondaryColor(e.target.value)}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <p className="text-center">Accent Color</p>
      <Input
        type="color"
        value={accentColor}
        onChange={(e) => setAccentColor(e.target.value)}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <Button onClick={applyColorsToAllPanels} width="100%" mt={2}>
        Apply to all components
      </Button>
    </Box>
  );
}