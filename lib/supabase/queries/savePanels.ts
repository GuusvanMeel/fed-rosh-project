import { PanelData } from "@/app/types/panel";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function savePanels(panels: PanelData[]) {
   const formatted = panels.map((panel) => ({
    id: panel.i,
    x: panel.x,
    y: panel.y,
    w: panel.w,
    h: panel.h,
    styling: panel.styling,
    panelProps: panel.panelProps,
  }));

  const { error } = await supabase.from("panels_v2").upsert(formatted);

  if (error) {
    console.error("Error saving panels:", error);
  } else {
    console.log(`✅ Saved ${panels.length} panels`);
  }
}