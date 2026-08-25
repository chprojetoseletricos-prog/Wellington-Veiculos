import { cache } from "react";
import { demoBanners, demoLaunches, demoSettings, demoStats, demoVehicles, demoWhatsApps } from "@/lib/demo-data";
import type { AdminAnalytics, AdminBanner, AdminConversation, AdminLaunch, AdminLead, AdminMessage, AdminRole, AdminUser, Vehicle } from "@/types";

export const hasSupabaseEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

export const getVehicles = cache(async (): Promise<Vehicle[]> => {
  if (!hasSupabaseEnv) return demoVehicles;

  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*), vehicle_features(name)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapVehicleRow);
});

export const getVehicleBySlug = cache(async (slug: string) => {
  const vehicles = await getVehicles();
  return vehicles.find((vehicle) => vehicle.slug === slug) ?? null;
});

export const getLaunches = cache(async () => {
  if (!hasSupabaseEnv) return demoLaunches;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("launches").select("id,slug,title,subtitle,excerpt,cover_image_url,published_at,featured,vehicles(slug)").eq("active", true).not("published_at", "is", null).order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((item) => ({ id: item.id, slug: item.slug, title: item.title, subtitle: item.subtitle ?? "", excerpt: item.excerpt ?? "", image: item.cover_image_url, date: item.published_at ?? new Date().toISOString(), featured: item.featured, vehicleSlug: Array.isArray(item.vehicles) ? item.vehicles[0]?.slug : (item.vehicles as { slug?: string } | null)?.slug }));
});

export const getSiteSettings = cache(async () => {
  if (!hasSupabaseEnv) return demoSettings;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const [{ data: rows }, { data: social }] = await Promise.all([supabase.from("site_settings").select("key,value").eq("is_public", true), supabase.from("social_links").select("platform,url").eq("active", true).order("position")]);
  if (!rows?.length) return demoSettings;
  const values = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return { companyName: String(values.company_name ?? demoSettings.companyName), tradeName: String(values.trade_name ?? demoSettings.tradeName), slogan: String(values.slogan ?? demoSettings.slogan), address: String(values.address ?? demoSettings.address), city: String(values.city ?? demoSettings.city), state: String(values.state ?? demoSettings.state), phone: String(values.phone ?? demoSettings.phone), email: String(values.email ?? demoSettings.email), hours: String(values.hours ?? demoSettings.hours), about: String(values.about ?? demoSettings.about), logoUrl: String(values.logo_url ?? ""), alternateLogoUrl: String(values.alternate_logo_url ?? ""), faviconUrl: String(values.favicon_url ?? ""), mapsUrl: String(values.maps_url ?? ""), heroUrl: String(values.hero_url ?? demoSettings.heroUrl), primaryColor: String(values.primary_color ?? demoSettings.primaryColor), accentColor: String(values.accent_color ?? demoSettings.accentColor), showSoldVehicles: Boolean(values.show_sold_vehicles), social: Object.fromEntries((social ?? []).map((item) => [item.platform, item.url])) };
});

export const getWhatsAppNumbers = cache(async () => {
  if (!hasSupabaseEnv) return demoWhatsApps;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("whatsapp_numbers").select("*").order("priority");
  if (error || !data) return [];
  return data.map((item) => ({ id: item.id, name: item.name, responsible: item.responsible, number: item.number, sector: item.sector as "sales" | "rental" | "support", defaultMessage: item.default_message, active: item.active, primary: item.is_primary, priority: item.priority }));
});

export const getActiveBanners = cache(async (): Promise<AdminBanner[]> => {
  if (!hasSupabaseEnv) return demoBanners.filter((item) => item.active).sort((a, b) => a.order - b.order);
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("banners").select("*").eq("active", true).order("position");
  if (error || !data) return [];
  return data.map((item) => ({ id: item.id, title: item.title, subtitle: item.subtitle ?? "", desktop: item.desktop_image_url, mobile: item.mobile_image_url ?? item.desktop_image_url, cta: item.cta_label ?? "Explorar", url: item.cta_url ?? "/veiculos", active: item.active, order: item.position }));
});

export const getDashboardData = cache(async () => {
  if (!hasSupabaseEnv) return { stats: demoStats, activity: [] as Array<{ action: string; created_at: string; metadata: Record<string, unknown> }> };
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const [total, available, sold, rented, archived, unread, newLeads, views, activityRows] = await Promise.all([
    supabase.from("vehicles").select("id", { count: "exact", head: true }), supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "available"), supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "sold"), supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "rented"), supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("status", "archived"), supabase.from("messages").select("id", { count: "exact", head: true }).eq("sender_type", "visitor").is("read_at", null), supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"), supabase.from("vehicle_views").select("id", { count: "exact", head: true }), supabase.from("activity_logs").select("action,created_at,metadata").order("created_at", { ascending: false }).limit(6),
  ]);
  return { stats: { totalVehicles: total.count ?? 0, available: available.count ?? 0, sold: sold.count ?? 0, rented: rented.count ?? 0, archived: archived.count ?? 0, unreadMessages: unread.count ?? 0, newLeads: newLeads.count ?? 0, views: views.count ?? 0 }, activity: activityRows.data ?? [] };
});

export const getAdminChatData = cache(async (): Promise<{ conversations: AdminConversation[]; messages: Record<string, AdminMessage[]> } | null> => {
  if (!hasSupabaseEnv) return null;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("conversations").select("id,status,assigned_to,last_message_at,visitors(name,phone,email),vehicles(title),messages(id,sender_type,content,read_at,created_at)").order("last_message_at", { ascending: false });
  if (error || !data) return { conversations: [], messages: {} };
  const messageMap: Record<string, AdminMessage[]> = {};
  const conversations = data.map((raw) => {
    const row = raw as Record<string, unknown>;
    const visitor = relation(row.visitors);
    const vehicle = relation(row.vehicles);
    const rows = (Array.isArray(row.messages) ? row.messages : []).map((value) => value as Record<string, unknown>).sort((a, b) => Date.parse(String(a.created_at)) - Date.parse(String(b.created_at)));
    messageMap[String(row.id)] = rows.map((message) => ({ id: String(message.id), sender: message.sender_type as "visitor" | "admin", content: String(message.content), time: formatTime(String(message.created_at)), createdAt: String(message.created_at) }));
    const last = rows.at(-1);
    return { id: String(row.id), name: String(visitor.name ?? "Visitante"), phone: String(visitor.phone ?? ""), email: visitor.email ? String(visitor.email) : undefined, vehicle: String(vehicle.title ?? "Atendimento geral"), last: String(last?.content ?? "Conversa iniciada"), time: formatTime(String(row.last_message_at)), unread: rows.filter((message) => message.sender_type === "visitor" && !message.read_at).length, status: row.status as AdminConversation["status"], assignedTo: row.assigned_to ? String(row.assigned_to) : undefined };
  });
  return { conversations, messages: messageMap };
});

export const getAdminLeadsData = cache(async (): Promise<AdminLead[] | null> => {
  if (!hasSupabaseEnv) return null;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("leads").select("id,name,phone,email,source,status,assigned_to,created_at,vehicles(title)").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((raw) => { const row = raw as Record<string, unknown>; const vehicle = relation(row.vehicles); return { id: String(row.id), name: String(row.name), phone: String(row.phone), email: row.email ? String(row.email) : "—", vehicle: String(vehicle.title ?? "Atendimento geral"), source: String(row.source), status: row.status as AdminLead["status"], date: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(String(row.created_at))), owner: row.assigned_to ? "Atribuído" : "Sem responsável" }; });
});

export const getAdminBannersData = cache(async (): Promise<AdminBanner[] | null> => {
  if (!hasSupabaseEnv) return demoBanners;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("banners").select("*").order("position");
  if (error || !data) return [];
  return data.map((item) => ({ id: item.id, title: item.title, subtitle: item.subtitle ?? "", desktop: item.desktop_image_url, mobile: item.mobile_image_url ?? item.desktop_image_url, cta: item.cta_label ?? "", url: item.cta_url ?? "", active: item.active, order: item.position }));
});

export const getAdminUsersData = cache(async (): Promise<AdminUser[] | null> => {
  if (!hasSupabaseEnv || !(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) return null;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data: caller } = await supabase.from("profiles").select("role,active").eq("id", user.id).single();
  if (!caller?.active || !["owner", "admin"].includes(caller.role)) return [];
  const { createAdminSupabaseClient } = await import("@/lib/supabase/admin");
  const admin = createAdminSupabaseClient();
  const [{ data: users }, { data: profiles }] = await Promise.all([admin.auth.admin.listUsers({ page: 1, perPage: 100 }), admin.from("profiles").select("id,full_name,role,active,updated_at")]);
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  return users.users.filter((item) => profileMap.has(item.id)).map((item) => { const profile = profileMap.get(item.id)!; return { id: item.id, name: profile.full_name || item.user_metadata.name || "Usuário", email: item.email ?? "", role: profile.role as AdminRole, active: profile.active, lastAccess: item.last_sign_in_at ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(item.last_sign_in_at)) : "Nunca" }; });
});

export const getAdminLaunchesData = cache(async (): Promise<AdminLaunch[]> => {
  if (!hasSupabaseEnv) return demoLaunches.map((item) => ({ ...item, published: true, gallery: [] }));
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("launches").select("id,slug,title,subtitle,excerpt,cover_image_url,video_url,published_at,created_at,featured,vehicles(slug),launch_images(url,position)").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((raw) => {
    const row = raw as Record<string, unknown>;
    const vehicle = relation(row.vehicles);
    const images = (Array.isArray(row.launch_images) ? row.launch_images : []).map((item) => item as Record<string, unknown>).sort((a, b) => Number(a.position) - Number(b.position));
    return { id: String(row.id), slug: String(row.slug), title: String(row.title), subtitle: String(row.subtitle ?? ""), excerpt: String(row.excerpt ?? ""), image: String(row.cover_image_url), date: String(row.published_at ?? row.created_at), featured: Boolean(row.featured), published: Boolean(row.published_at), video: row.video_url ? String(row.video_url) : undefined, vehicleSlug: vehicle.slug ? String(vehicle.slug) : undefined, gallery: images.map((item) => String(item.url)) };
  });
});

export const getAdminAnalyticsData = cache(async (): Promise<AdminAnalytics> => {
  const demo: AdminAnalytics = {
    totals: { views: demoStats.views, whatsapp: 186, chats: 43, leads: 27 },
    series: [{ day: "15", views: 170, leads: 5 }, { day: "16", views: 230, leads: 8 }, { day: "17", views: 190, leads: 7 }, { day: "18", views: 310, leads: 12 }, { day: "19", views: 280, leads: 10 }, { day: "20", views: 390, leads: 16 }, { day: "21", views: 360, leads: 14 }],
    topVehicles: [{ name: "Porsche 911 Carrera", views: 521, contacts: 32 }, { name: "Toyota Hilux SRX", views: 384, contacts: 27 }, { name: "BMW 320i M Sport", views: 316, contacts: 21 }, { name: "Jeep Compass Limited", views: 289, contacts: 18 }],
  };
  if (!hasSupabaseEnv) return demo;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const firstDay = new Date();
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(firstDay.getDate() - 6);
  const since = firstDay.toISOString();
  const [viewsTotal, whatsappTotal, chatsTotal, leadsTotal, viewsRows, leadRows, contactRows] = await Promise.all([
    supabase.from("vehicle_views").select("id", { count: "exact", head: true }),
    supabase.from("whatsapp_clicks").select("id", { count: "exact", head: true }),
    supabase.from("conversations").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("vehicle_views").select("vehicle_id,created_at,vehicles(title)").gte("created_at", since),
    supabase.from("leads").select("created_at").gte("created_at", since),
    supabase.from("whatsapp_clicks").select("vehicle_id,created_at,vehicles(title)").gte("created_at", since),
  ]);
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(firstDay);
    date.setDate(date.getDate() + offset);
    return { key: localDateKey(date), day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date), views: 0, leads: 0 };
  });
  const dayMap = new Map(days.map((day) => [day.key, day]));
  for (const row of viewsRows.data ?? []) {
    const day = dayMap.get(localDateKey(new Date(row.created_at)));
    if (day) day.views++;
  }
  for (const row of leadRows.data ?? []) {
    const day = dayMap.get(localDateKey(new Date(row.created_at)));
    if (day) day.leads++;
  }
  const vehicles = new Map<string, { name: string; views: number; contacts: number }>();
  for (const raw of viewsRows.data ?? []) {
    const row = raw as Record<string, unknown>;
    const id = String(row.vehicle_id);
    const item = vehicles.get(id) ?? { name: String(relation(row.vehicles).title ?? "Veículo"), views: 0, contacts: 0 };
    item.views++;
    vehicles.set(id, item);
  }
  for (const row of contactRows.data ?? []) {
    if (!row.vehicle_id) continue;
    const id = String(row.vehicle_id);
    const item = vehicles.get(id) ?? { name: String(relation((row as Record<string, unknown>).vehicles).title ?? "Veículo"), views: 0, contacts: 0 };
    item.contacts++;
    vehicles.set(id, item);
  }
  return {
    totals: { views: viewsTotal.count ?? 0, whatsapp: whatsappTotal.count ?? 0, chats: chatsTotal.count ?? 0, leads: leadsTotal.count ?? 0 },
    series: days.map(({ day, views, leads }) => ({ day, views, leads })),
    topVehicles: [...vehicles.values()].sort((a, b) => b.views - a.views || b.contacts - a.contacts).slice(0, 5),
  };
});

function relation(value: unknown): Record<string, unknown> { if (Array.isArray(value)) return (value[0] as Record<string, unknown>) ?? {}; return value && typeof value === "object" ? value as Record<string, unknown> : {}; }
function formatTime(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date); }
function localDateKey(date: Date) { return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; }

function mapVehicleRow(row: Record<string, unknown>): Vehicle {
  const images = Array.isArray(row.vehicle_images) ? row.vehicle_images : [];
  const features = Array.isArray(row.vehicle_features) ? row.vehicle_features : [];
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    brand: String(row.brand ?? ""),
    model: String(row.model ?? ""),
    version: String(row.version ?? ""),
    manufactureYear: Number(row.manufacture_year),
    modelYear: Number(row.model_year),
    price: row.price == null ? null : Number(row.price),
    dailyPrice: row.daily_price == null ? null : Number(row.daily_price),
    mileage: Number(row.mileage ?? 0),
    fuel: String(row.fuel ?? ""),
    transmission: String(row.transmission ?? ""),
    color: String(row.color ?? ""),
    doors: Number(row.doors ?? 4),
    engine: row.engine ? String(row.engine) : undefined,
    power: row.power ? String(row.power) : undefined,
    category: String(row.category ?? ""),
    purpose: row.purpose as Vehicle["purpose"],
    status: row.status as Vehicle["status"],
    description: String(row.description ?? ""),
    location: String(row.location ?? ""),
    featured: Boolean(row.featured),
    isLaunch: Boolean(row.is_launch),
    isPromotion: Boolean(row.is_promotion),
    showPrice: Boolean(row.show_price),
    priceOnRequest: Boolean(row.price_on_request),
    images: images.sort((a, b) => Number((b as Record<string, unknown>).is_cover) - Number((a as Record<string, unknown>).is_cover) || Number((a as Record<string, unknown>).position ?? 0) - Number((b as Record<string, unknown>).position ?? 0)).map((image, index) => {
      const value = image as Record<string, unknown>;
      return { id: String(value.id), url: String(value.url), alt: String(value.alt_text ?? row.title), isCover: Boolean(value.is_cover ?? index === 0) };
    }),
    features: features.map((feature) => String((feature as Record<string, unknown>).name)),
    createdAt: String(row.created_at),
  };
}
