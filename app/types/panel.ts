import { Layout } from "react-grid-layout";
import { panelRegistry } from "../component/panels/panelRegistry";


export type PanelType = keyof typeof panelRegistry;

export type PanelData = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  panelProps: PanelProps;

  backgroundColor: string;
  borderRadius?: number;

  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  padding?: number;

  contentAlign?: "left" | "center" | "right";
}

export type PanelProps = {
  id: string;
  type: PanelType
  content: string | string[];
  currentIndex?: number;
  layout?: Layout;
};