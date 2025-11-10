import { createClient } from "@/lib/supabase/client";
import { PanelData } from "@/app/page";

const supabase = createClient();

export async function savePanels(panels: PanelData[]) {
   const formatted = panels.map((panel) => ({
    id: panel.i, // maps to your DB id (uuid)
    x: panel.x,
    y: panel.y,
    w: panel.w,
    h: panel.h,
    backgroundColor: panel.backgroundColor,
    panelProps: panel.panelProps, // 👈 JSONB field
  }));

  const { error } = await supabase.from("panels").upsert(formatted);

  if (error) {
    console.error("Error saving panels:", error);
  } else {
    console.log(`✅ Saved ${panels.length} panels`);
  }
}