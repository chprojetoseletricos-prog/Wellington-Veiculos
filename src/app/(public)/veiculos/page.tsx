import type { Metadata } from "next";
import { VehicleCatalog } from "@/components/vehicles/vehicle-catalog";
import { getSiteSettings, getVehicles } from "@/lib/data";

export const metadata: Metadata = { title: "Veículos", description: "Catálogo de veículos selecionados para compra e locação em Fortaleza." };

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [vehicles, params, settings] = await Promise.all([getVehicles(), searchParams, getSiteSettings()]);
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  return <><section className="border-b border-line bg-[#0d0f11] pb-14 pt-36"><div className="page-shell"><p className="eyebrow mb-4">Comprar · Alugar · Explorar</p><h1 className="editorial-title text-5xl md:text-8xl">Veículos</h1><p className="mt-5 max-w-xl text-sm leading-6 text-muted">Uma seleção curta o suficiente para ser criteriosa e ampla o bastante para encontrar o que combina com seu momento.</p></div></section><VehicleCatalog vehicles={vehicles} showSold={settings.showSoldVehicles} initial={{ purpose: value("finalidade"), brand: value("marca"), model: value("modelo"), year: value("ano"), maxPrice: value("precoMax") }} /></>;
}
