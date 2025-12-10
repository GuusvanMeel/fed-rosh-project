import { PanelData } from "@/app/types/panel";
import { createClient } from "../client";
import { SectionData } from "@/app/component/Sections/Section";

export async function getSections(): Promise<SectionData[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sections")
    .select("*")

  if (error) {
    console.error("Error fetching panels:", error);
    return [];
  }

  if (!data) return [];
const array : PanelData[] = []
const mapped: SectionData[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    panels: array,
    dropZones: row.dropZones
  }));

  return mapped;
}