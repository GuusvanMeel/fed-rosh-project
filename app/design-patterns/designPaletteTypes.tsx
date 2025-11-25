import React from "react";
import ColorPanel from "./ColorPanel";

type PaletteEntry = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
};

export const paletteRegistry: Record<string, PaletteEntry> = {
  Colors: {
    component: ColorPanel,
  },
  Font: {
    component: () => <div>Font Panel</div>,
  }
} as const;

export default paletteRegistry;