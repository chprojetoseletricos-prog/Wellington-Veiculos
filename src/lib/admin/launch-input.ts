import { z } from "zod";
import type { getAdminContext } from "@/lib/auth";

export const launchSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  subtitle: z.string(),
  excerpt: z.string().min(10),
  image: z.string(),
  date: z.string(),
  featured: z.boolean(),
  published: z.boolean(),
  video: z.string().optional(),
  vehicleSlug: z.string().optional(),
  gallery: z.array(z.string()).default([]),
});

type AdminSupabase = NonNullable<
  Awaited<ReturnType<typeof getAdminContext>>
>["supabase"];

export async function resolveVehicle(
  supabase: AdminSupabase,
  slug?: string,
) {
  if (!supabase || !slug) return null;
  const { data } = await supabase
    .from("vehicles")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  return data?.id ?? null;
}
