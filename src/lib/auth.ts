import { hasSupabaseEnv } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/types";

export async function getAdminContext(allowed: AdminRole[] = ["owner","admin","manager","sales","support"]) {
  if (!hasSupabaseEnv) return { demo: true as const, user: null, role: "owner" as AdminRole, supabase: null };
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role, active").eq("id", user.id).single();
  if (!profile?.active || !allowed.includes(profile.role as AdminRole)) return null;
  return { demo: false as const, user, role: profile.role as AdminRole, supabase };
}

export function unauthorized() { return Response.json({ error: "Não autorizado." }, { status: 401 }); }
