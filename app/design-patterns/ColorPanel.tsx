"use client";

import { Box, Input} from "@chakra-ui/react";
import { useColors } from "../design-patterns/DesignContext";

export default function ColorPicker() {
  const { primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor } = useColors();

  return (
    <Box>
      <Input
        type="color"
        value={primaryColor}
        onChange={(e) => setPrimaryColor(e.target.value)}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />

      <Input
        type="color"
        value={secondaryColor}
        onChange={(e) => setSecondaryColor(e.target.value)}
        cursor="pointer"
        width="100%"
        height="40px"
        padding="0"
      />
    </Box>
  );
}
