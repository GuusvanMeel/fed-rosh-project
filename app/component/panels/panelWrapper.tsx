import { PanelData } from "@/app/types/panel";
import React from "react";

export function PanelWrapper({
  panel,
  children,
}: {
  panel: PanelData;
  children: React.ReactNode;
}) {
  const {
    backgroundColor,
    borderRadius = 8,
    padding = 8,
    textColor,
    fontSize,
    fontFamily,
    contentAlign,
    opacity = 1,
  } = panel.styling;

  return (
    <div
      style={{
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        color: textColor,
        fontSize: fontSize ? `${fontSize}px` : undefined,
        fontFamily: fontFamily || undefined,
        textAlign: contentAlign,
        opacity,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: contentAlign === "center" ? "center" : contentAlign === "right" ? "flex-end" : "flex-start",
      }}
    >
      {children}
    </div>
  );
}