"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Use the SECRET KEY to bypass RLS for admin operations
const getSupabaseAdmin = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function saveAchievementAction(formData, id = null) {
  try {
    const supabase = getSupabaseAdmin();

    const cleanData = {
      type: formData.type,
      url: formData.url,
      title: formData.title,
      description: formData.description || "",
      thumbnail_url: formData.thumbnail_url || "",
      date: formData.date || new Date().toISOString().split("T")[0],
    };

    if (id) {
      const { data, error } = await supabase.from("achievements").update(cleanData).eq("id", id).select();

      if (error) {
        console.error("Supabase update error:", error);
        return { success: false, error: error.message };
      }
      revalidatePath("/mdtadmin");
      return { success: true, data };
    } else {
      const { data, error } = await supabase.from("achievements").insert([cleanData]).select();

      if (error) {
        console.error("Supabase insert error:", error);
        return { success: false, error: error.message };
      }
      revalidatePath("/mdtadmin");
      return { success: true, data };
    }
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAchievementAction(id) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("achievements").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }
    revalidatePath("/mdtadmin");
    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: error.message };
  }
}
