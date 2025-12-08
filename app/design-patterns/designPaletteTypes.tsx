import React from "react";
import ColorPanel from "./ColorPanel";
import FontPanel from "./FontPanel";

type PaletteEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
};

export const paletteRegistry: Record<string, PaletteEntry> = {
  Colors: {
    component: ColorPanel,
  },
  Font: {
    component: FontPanel,
  }
} as const;

export default paletteRegistry;