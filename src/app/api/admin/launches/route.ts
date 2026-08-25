import { z } from "zod";
import { getAdminContext, unauthorized } from "@/lib/auth";

export const launchSchema = z.object({ id: z.string().uuid().optional(), title: z.string().min(3), slug: z.string().regex(/^[a-z0-9-]+$/), subtitle: z.string(), excerpt: z.string().min(10), image: z.string(), date: z.string(), featured: z.boolean(), published: z.boolean(), video: z.string().optional(), vehicleSlug: z.string().optional(), gallery: z.array(z.string()).default([]) });

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

export async function resolveVehicle(supabase: NonNullable<Awaited<ReturnType<typeof getAdminContext>>>["supabase"], slug?: string) { if (!supabase || !slug) return null; const { data } = await supabase.from("vehicles").select("id").eq("slug", slug).maybeSingle(); return data?.id ?? null; }
