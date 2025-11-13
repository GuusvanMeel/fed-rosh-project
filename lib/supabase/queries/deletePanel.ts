import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function deletePanel(id: string) {
  const { error } = await supabase.from("panels").delete().eq("id", id);
  if (error) {
    console.error("Error deleting panel:", error);
    throw error;
  }
}


