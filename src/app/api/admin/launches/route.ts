import { getAdminContext, unauthorized } from "@/lib/auth";
import { launchSchema, resolveVehicle } from "@/lib/admin/launch-input";

export async function POST(request: Request) {
  const context = await getAdminContext(["owner", "admin", "manager"]);
  if (!context) return unauthorized();
  try {
    const input = launchSchema.parse(await request.json());
    if (context.demo) return Response.json({ id: input.id ?? crypto.randomUUID(), demo: true }, { status: 201 });
    const vehicleId = await resolveVehicle(context.supabase, input.vehicleSlug);
    const { data, error } = await context.supabase.from("launches").insert({ title: input.title, slug: input.slug, subtitle: input.subtitle, excerpt: input.excerpt, content: input.excerpt, cover_image_url: input.image, video_url: input.video || null, vehicle_id: vehicleId, published_at: input.published ? input.date : null, featured: input.featured, active: true, created_by: context.user.id }).select("id").single();
    if (error) throw error;
    if (input.gallery.length) await context.supabase.from("launch_images").insert(input.gallery.map((url, position) => ({ launch_id: data.id, url, position })));
    return Response.json(data, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Dados inválidos." }, { status: 400 }); }
}
