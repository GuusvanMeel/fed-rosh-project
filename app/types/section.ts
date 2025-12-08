import { PanelData } from "./panel";

export interface GridDropzone {
  id: string;
  span: number;
}
export interface ColumnSectionData {
  id: string;
  name: string;
  panels: PanelData[];
  dropZones: GridDropzone[];
}