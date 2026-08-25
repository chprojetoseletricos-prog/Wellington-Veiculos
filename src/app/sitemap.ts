import type { MetadataRoute } from "next";
import { getLaunches, getVehicles } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [vehicles, launches] = await Promise.all([getVehicles(), getLaunches()]);
  const staticRoutes: MetadataRoute.Sitemap = ["", "/veiculos", "/lancamentos", "/sobre", "/contato"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "daily" : "weekly", priority: path === "" ? 1 : 0.8 }));
  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.filter((item) => !["archived", "unavailable"].includes(item.status)).map((item) => ({ url: `${base}/veiculos/${item.slug}`, lastModified: new Date(item.createdAt), changeFrequency: "weekly", priority: 0.7 }));
  const launchRoutes: MetadataRoute.Sitemap = launches.map((item) => ({ url: `${base}/lancamentos/${item.slug}`, lastModified: new Date(item.date), changeFrequency: "monthly", priority: 0.6 }));
  return [...staticRoutes, ...vehicleRoutes, ...launchRoutes];
}
