"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const ColorContext = createContext({
  primaryColor: "#ffffff",
  setPrimaryColor: (c: string) => {},
  secondaryColor: "#000000",
  setSecondaryColor: (c: string) => {},
});

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  return (
    <ColorContext.Provider value={{ primaryColor, setPrimaryColor, secondaryColor, setSecondaryColor }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);

