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

  console.log("ColorPicker rendered with:", { primaryColor, secondaryColor, accentColor });

  return (
    <Box>
      <p className="text-center text-small">Primary Color</p>
      <Input
        type="color"
        value={primaryColor}
        onChange={(e) => {
          console.log("Primary color input changed:", e.target.value);
          setPrimaryColor(e.target.value);
        }}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <p className="text-center">Secondary Color</p>
      <Input
        type="color"
        value={secondaryColor}
        onChange={(e) => {
          console.log("Secondary color input changed:", e.target.value);
          setSecondaryColor(e.target.value);
        }}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <p className="text-center">Accent Color</p>
      <Input
        type="color"
        value={accentColor}
        onChange={(e) => {
          console.log("Accent color input changed:", e.target.value);
          setAccentColor(e.target.value);
        }}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <Button 
        onClick={() => {
          console.log("Apply button clicked");
          applyColorsToAllPanels();
        }} 
        width="100%" 
        mt={2}
      >
        Apply to all components
      </Button>
    </Box>
  );
}