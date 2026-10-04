"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const getSupabaseAdmin = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function saveExperienceAction(formData, id = null) {
  try {
    const supabase = getSupabaseAdmin();

    // Strip read-only fields
    const { id: _id, created_at, ...cleanData } = formData;

    // Use RPC function to bypass PostgREST schema cache entirely
    // This handles is_development correctly via raw SQL
    const { data, error } = await supabase.rpc("upsert_experience", {
      p_id: id || null,
      p_company: cleanData.company || "",
      p_position: cleanData.position || "",
      p_duration: cleanData.duration || "",
      p_location: cleanData.location || "",
      p_type: cleanData.type || "",
      p_description: cleanData.description || "",
      p_skills: Array.isArray(cleanData.skills) ? cleanData.skills : [],
      p_logo_url: cleanData.logo_url || "",
      p_is_development: cleanData.is_development !== false,
      p_company_url: cleanData.company_url || "",
      p_links: Array.isArray(cleanData.links) ? cleanData.links : [],
    });

    if (error) {
      console.error("Experience RPC error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/mdtadmin/experience");
    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteExperienceAction(id) {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("experience").delete().eq("id", id);

    if (error) {
      console.error("Experience delete error:", error);
      return { success: false, error: error.message };
    }
    revalidatePath("/mdtadmin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Server action error:", error);
    return { success: false, error: error.message };
  }
}
