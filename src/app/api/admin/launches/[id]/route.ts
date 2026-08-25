import { getAdminContext, unauthorized } from "@/lib/auth";
import { launchSchema, resolveVehicle } from "@/lib/admin/launch-input";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext(["owner", "admin", "manager"]);
  if (!context) return unauthorized();
  const { id } = await params;
  const body = await request.json();
  if (context.demo) return Response.json({ ok: true, demo: true });
  if (Object.keys(body).length === 1 && typeof body.published === "boolean") { const { error } = await context.supabase.from("launches").update({ published_at: body.published ? new Date().toISOString() : null }).eq("id", id); return error ? Response.json({ error: error.message }, { status: 400 }) : Response.json({ ok: true }); }
  try {
    const input = launchSchema.parse(body);
    const vehicleId = await resolveVehicle(context.supabase, input.vehicleSlug);
    const { error } = await context.supabase.from("launches").update({ title: input.title, slug: input.slug, subtitle: input.subtitle, excerpt: input.excerpt, content: input.excerpt, cover_image_url: input.image, video_url: input.video || null, vehicle_id: vehicleId, published_at: input.published ? input.date : null, featured: input.featured }).eq("id", id);
    if (error) throw error;
    await context.supabase.from("launch_images").delete().eq("launch_id", id);
    if (input.gallery.length) await context.supabase.from("launch_images").insert(input.gallery.map((url, position) => ({ launch_id: id, url, position })));
    return Response.json({ ok: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Falha ao atualizar." }, { status: 400 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const context = await getAdminContext(["owner", "admin"]); if (!context) return unauthorized(); const { id } = await params; if (context.demo) return Response.json({ ok: true, demo: true }); const { error } = await context.supabase.from("launches").delete().eq("id", id); return error ? Response.json({ error: error.message }, { status: 400 }) : Response.json({ ok: true }); }
