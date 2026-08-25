import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema=z.object({name:z.string().min(2).max(120),phone:z.string().min(8).max(30),email:z.string().email().max(180),subject:z.string().min(2).max(160),message:z.string().min(10).max(3000),source:z.string().max(50).default("contact_form")});
export async function POST(request:Request){try{const input=schema.parse(await request.json());if(!hasSupabaseEnv)return Response.json({ok:true,demo:true},{status:201});const supabase=await createServerSupabaseClient();const{error}=await supabase.from("leads").insert({name:input.name,phone:input.phone,email:input.email,source:input.source,status:"new",notes:`${input.subject}\n\n${input.message}`});if(error)throw error;return Response.json({ok:true},{status:201});}catch(error){return Response.json({error:error instanceof Error?error.message:"Dados inválidos."},{status:400});}}
