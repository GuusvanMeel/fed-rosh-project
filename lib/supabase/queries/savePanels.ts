import { createClient } from "@/lib/supabase/client";
import { PanelData } from "@/app/page";

const supabase = createClient();

export async function savePanels(panels: PanelData[]) {
   const formatted = panels.map((panel) => ({
    id: panel.i,
    x: panel.x,
    y: panel.y,
    w: panel.w,
    h: panel.h,
    backgroundColor: panel.backgroundColor,
    borderRadius: panel.borderRadius,
    panelProps: panel.panelProps,
  }));

  const { error } = await supabase.from("panels").upsert(formatted);

  if (error) {
    console.error("Error saving panels:", error);
  } else {
    console.log(`✅ Saved ${panels.length} panels`);
  }
}