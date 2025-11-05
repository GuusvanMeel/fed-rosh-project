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

  // ✅ Normalize database keys → frontend types
  const mapped = data.map((row: any) => ({
    i: row.id, // id from DB maps to i
    x: row.x,
    y: row.y,
    w: row.w,
    h: row.h,
    backgroundColor: row.background_color,
    panelProps: row.panel_props, // your JSONB payload
  }));

  return mapped;
}
