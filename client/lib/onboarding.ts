import type { SupabaseClient } from "@supabase/supabase-js";

export const ONBOARDED_COOKIE = "potzi_onboarded";

export async function getOnboardedState(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ onboarded: boolean; error?: string }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { onboarded: false, error: error.message };
  }

  return { onboarded: data?.onboarded === true };
}
