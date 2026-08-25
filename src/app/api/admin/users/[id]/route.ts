import { z } from "zod";
import { getAdminContext, unauthorized } from "@/lib/auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const schema = z.object({
  role: z.enum(["admin", "manager", "sales", "support"]).optional(),
  active: z.boolean().optional(),
}).refine((value) => value.role !== undefined || value.active !== undefined);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext(["owner", "admin"]);
  if (!context) return unauthorized();
  try {
    const { id } = await params;
    const input = schema.parse(await request.json());
    if (context.demo) return Response.json({ ok: true, demo: true });
    if (context.user.id === id && input.active === false) return Response.json({ error: "Você não pode desativar o próprio acesso." }, { status: 400 });
    const admin = createAdminSupabaseClient();
    const { data: target } = await admin.from("profiles").select("role").eq("id", id).single();
    if (!target) return Response.json({ error: "Usuário não encontrado." }, { status: 404 });
    if (target.role === "owner") return Response.json({ error: "O proprietário não pode ser alterado por esta tela." }, { status: 403 });
    const { error } = await admin.from("profiles").update(input).eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível alterar o acesso." }, { status: 400 });
  }
}
