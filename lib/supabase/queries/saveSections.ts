import { SectionData } from "@/app/component/Sections/Section";
import { PanelData } from "@/app/types/panel";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function saveSections(sections: SectionData[]) {
   const formatted = sections.map((section) => ({
    id: section.id,
    name: section.name,
    dropZones: section.dropZones
}));

  const { error } = await supabase.from("sections").upsert(formatted);
  if (error) {
    console.error("Error saving sections:", error);
    return error;
  } else {
    console.log(`✅ Saved ${sections.length} panels`);
  }
}