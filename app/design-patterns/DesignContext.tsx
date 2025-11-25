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
  sections: SectionData[];
  setSections: (sections: SectionData[]) => void;
  applyColorsToAllPanels: () => void;
}

const ColorContext = createContext<ColorContextType>({
  primaryColor: "#ffffff",
  setPrimaryColor: () => {},
  secondaryColor: "#000000",
  setSecondaryColor: () => {},
  accentColor: "#57b1ff",
  setAccentColor: () => {},
  sections: [],
  setSections: () => {},
  applyColorsToAllPanels: () => {},
});

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [primaryColor, setPrimaryColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [accentColor, setAccentColor] = useState("#57b1ff");
  const [sections, setSections] = useState<SectionData[]>([
    { id: "section-1", name: "Section 1", panels: [] },
  ]);

  const applyColorsToAllPanels = () => {
    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        panels: section.panels.map(panel => ({
          ...panel,
          styling: {
            ...panel.styling,
            backgroundColor: primaryColor,
            textColor: secondaryColor,
            // accentColor: accentColor, // if your panels support this
          },
        })),
      }))
    );
  };

  return (
    <ColorContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        secondaryColor,
        setSecondaryColor,
        accentColor,
        setAccentColor,
        sections,
        setSections,
        applyColorsToAllPanels,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColors = () => useContext(ColorContext);