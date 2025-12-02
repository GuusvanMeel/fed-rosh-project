"use client";

import { Box, Button } from "@chakra-ui/react";
import { NativeSelectField, NativeSelectRoot } from "@chakra-ui/react";
import { useColors } from "../design-patterns/DesignContext";

export default function FontPicker() {
  const fontList = ["Arial", "Helvetica", "Times New Roman", "Courier New", "Verdana"];
  const { font, setFont, applyFontToAllPanels } = useColors();

  console.log("FontPicker rendered with:", { font });

  return (
    <Box>
      <NativeSelectRoot className="bg-gray-900 radius-xl"
  onChange={(e) => {
    setFont((e.target as HTMLSelectElement).value);
    console.log("Font changed to:", (e.target as HTMLSelectElement).value);
  }}
>
  <NativeSelectField
  value={font}
  onChange={(e) => {
    setFont(e.target.value);
    console.log("Font changed:", e.target.value);
  }}
>
  <option value="">Select font</option>

  {fontList.map((f) => (
    <option key={f} value={f} style={{ fontFamily: f }}>
      {f}
    </option>
  ))}
</NativeSelectField>
</NativeSelectRoot>

      <Button
        onClick={() => {
          console.log("Apply font button clicked");
          applyFontToAllPanels?.();
        }}
        width="100%"
        mt={2}
      >
        Apply font to all panels
      </Button>
    </Box>
  );
}