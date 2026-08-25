import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({ slug: z.string().regex(/^[a-z0-9-]+$/), sessionId: z.string().min(8).max(120) });

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    if (hasSupabaseEnv) {
      const supabase = await createServerSupabaseClient();
      const { data: vehicle } = await supabase.from("vehicles").select("id").eq("slug", input.slug).maybeSingle();
      if (!vehicle) return new Response(null, { status: 404 });
      const { error } = await supabase.from("vehicle_views").insert({ vehicle_id: vehicle.id, session_id: input.sessionId, referrer: request.headers.get("referer"), user_agent: request.headers.get("user-agent") });
      if (error) throw error;
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
