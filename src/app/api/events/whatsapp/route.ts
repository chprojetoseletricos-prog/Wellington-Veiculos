import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
const schema=z.object({vehicleId:z.string().uuid()});
export async function POST(request:Request){try{const{vehicleId}=schema.parse(await request.json());if(hasSupabaseEnv){const supabase=await createServerSupabaseClient();await supabase.from("whatsapp_clicks").insert({vehicle_id:vehicleId,referrer:request.headers.get("referer"),user_agent:request.headers.get("user-agent")});}return new Response(null,{status:204});}catch{return new Response(null,{status:400});}}
