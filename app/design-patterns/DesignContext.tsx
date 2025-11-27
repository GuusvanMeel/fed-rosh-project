"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SectionData } from "../component/Sections/Section";

interface ColorContextType {
  primaryColor: string;
  setPrimaryColor: (c: string) => void;
  secondaryColor: string;
  setSecondaryColor: (c: string) => void;
  accentColor: string;
  setAccentColor: (c: string) => void;
  applyColorsToAllPanels: () => void;
}

const ColorContext = createContext<ColorContextType>({
  primaryColor: "#ffffff",
  setPrimaryColor: () => {},
  secondaryColor: "#000000",
  setSecondaryColor: () => {},
  accentColor: "#57b1ff",
  setAccentColor: () => {},
  applyColorsToAllPanels: () => {},
});

export const ColorProvider = ({
  children,
  sections,
  setSections
}: {
  children: ReactNode;
  sections: SectionData[];
  setSections: React.Dispatch<React.SetStateAction<SectionData[]>>;
}) => {
  const [primaryColor, setPrimaryColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#57b1ff");

  const handleSetPrimaryColor = (c: string) => {
    console.log("Setting primary color to:", c);
    setPrimaryColor(c);
  };

  const handleSetSecondaryColor = (c: string) => {
    console.log("Setting secondary color to:", c);
    setSecondaryColor(c);
  };

  const handleSetAccentColor = (c: string) => {
    console.log("Setting accent color to:", c);
    setAccentColor(c);
  };

  const applyColorsToAllPanels = () => {
    console.log("Applying colors to all panels");
    console.log("Primary:", primaryColor, "Secondary:", secondaryColor);
    console.log("Current sections:", sections);
    
    setSections(prevSections => {
      const updated = prevSections.map(section => ({
        ...section,
        panels: section.panels.map(panel => ({
          ...panel,
          styling: {
            ...panel.styling,
            textColor: primaryColor,
            backgroundColor: secondaryColor,
          }
        }))
      }));
      console.log("Updated sections:", updated);
      return updated;
    });
  };

  return (
    <ColorContext.Provider
      value={{
        primaryColor,
        setPrimaryColor: handleSetPrimaryColor,
        secondaryColor,
        setSecondaryColor: handleSetSecondaryColor,
        accentColor,
        setAccentColor: handleSetAccentColor,
        applyColorsToAllPanels,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);