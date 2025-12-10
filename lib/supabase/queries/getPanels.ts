// lib/supabase/queries/getPanels.ts
import { PanelData } from "@/app/types/panel";
import { createClient } from "../client";

export async function getPanels(): Promise<PanelData[]> {
  const supabase = createClient(); // no need to await; it's sync
  const { data, error } = await supabase
    .from("panels_v2")
    .select("*")

  if (error) {
    console.error("Error fetching panels:", error);
    return [];
  }

  if (!data) return [];

const mapped: PanelData[] = data.map((row) => ({
    i: row.id,
    x: row.x,
    y: row.y,
    w: row.w,
    h: row.h,
    backgroundColor: row.backgroundColor,
    panelProps: row.panelProps,
    styling: row.styling,
    dropZoneId: row.dropZoneId
  }));

  return mapped;
}