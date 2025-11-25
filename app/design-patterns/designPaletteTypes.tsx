import React from "react";
import ColorPanel from "./ColorPanel";

type PaletteEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
};

export const paletteRegistry: Record<string, PaletteEntry> = {
  Colors: {
    component: ColorPanel,
  }
} as const;

export default paletteRegistry;