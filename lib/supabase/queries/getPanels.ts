// lib/supabase/queries/getPanels.ts
import { createClient } from "../client";
import { PanelData } from "@/app/page";

export async function getPanels(): Promise<PanelData[]> {
  const supabase = createClient(); // no need to await; it's sync

  const { data, error } = await supabase
    .from("panels")
    .select("*")
    .order("created_at", { ascending: false });

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
  }));

  return mapped;
}