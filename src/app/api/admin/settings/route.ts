import { getAdminContext, unauthorized } from "@/lib/auth";

const keyMap: Record<string, string> = {
  companyName: "company_name", tradeName: "trade_name", slogan: "slogan", address: "address", city: "city", state: "state", phone: "phone", email: "email", hours: "hours", about: "about", logoUrl: "logo_url", alternateLogoUrl: "alternate_logo_url", faviconUrl: "favicon_url", mapsUrl: "maps_url", heroUrl: "hero_url", primaryColor: "primary_color", accentColor: "accent_color", showSoldVehicles: "show_sold_vehicles",
};
const socialPlatforms = new Set(["instagram", "facebook", "tiktok", "youtube", "linkedin"]);

export async function PATCH(request: Request) {
  const context = await getAdminContext(["owner", "admin"]);
  if (!context) return unauthorized();
  const body = await request.json() as Record<string, unknown>;
  if (context.demo) return Response.json({ ok: true, demo: true });

  for (const [inputKey, settingKey] of Object.entries(keyMap)) {
    const raw = inputKey === "showSoldVehicles" ? body[inputKey] === "on" || body[inputKey] === true : body[inputKey];
    if (raw === undefined) continue;
    const { error } = await context.supabase.from("site_settings").upsert({ key: settingKey, value: raw, is_public: true, updated_by: context.user.id }, { onConflict: "key" });
    if (error) return Response.json({ error: error.message }, { status: 400 });
  }
  for (const platform of socialPlatforms) {
    const url = body[platform];
    if (typeof url !== "string") continue;
    const { error } = await context.supabase.from("social_links").upsert({ platform, url, active: Boolean(url) }, { onConflict: "platform" });
    if (error) return Response.json({ error: error.message }, { status: 400 });
  }
  return Response.json({ ok: true });
}
