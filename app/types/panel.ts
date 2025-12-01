import { Layout } from "react-grid-layout";
import { panelRegistry } from "../component/panels/panelRegistry";


export type PanelType = keyof typeof panelRegistry;

export type PanelData = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  dropZoneId?: string; 
    panelProps: PanelProps;
    styling: PanelStyling;
}

export type contentAlign= "left" | "center" | "right";

export type PanelStyling = {
    backgroundColor: string;
    borderRadius?: number;
    fontSize?: number;
    fontFamily?: string;
    textColor?: string;
    padding?: number;
    contentAlign?: contentAlign;
    opacity?: number;
    scrollDirection?: "left" | "right";
}

export type PanelProps = {
    type: PanelType;
    content: string | string[];
    currentIndex?: number;
    layout?: Layout;
};