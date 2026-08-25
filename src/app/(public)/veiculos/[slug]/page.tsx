import type { Metadata } from "next";
import { Check, Gauge, MapPin, Settings2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatOpenButton } from "@/components/chat/chat-open-button";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { WhatsAppLink } from "@/components/vehicles/whatsapp-link";
import { getVehicleBySlug, getVehicles, getWhatsAppNumbers } from "@/lib/data";
import { formatCurrency, formatMileage, purposeLabel, statusLabel, whatsappUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Veículo não encontrado" };
  const description = `${vehicle.title} ${vehicle.version}, ${vehicle.modelYear}, ${formatMileage(vehicle.mileage)}. Consulte disponibilidade.`;
  return { title: `${vehicle.title} ${vehicle.modelYear}`, description, alternates: { canonical: `/veiculos/${slug}` }, openGraph: { title: `${vehicle.title} ${vehicle.modelYear} | Wellington Veículos`, description, images: [vehicle.images[0].url] } };
}

export async function generateStaticParams() { return (await getVehicles()).map((vehicle) => ({ slug: vehicle.slug })); }

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const [vehicle, whatsapps, all] = await Promise.all([getVehicleBySlug(slug), getWhatsAppNumbers(), getVehicles()]);
  if (!vehicle) notFound();
  const sector = vehicle.purpose === "rental" ? "rental" : "sales";
  const whatsapp = whatsapps.find((item) => item.sector === sector && item.active) ?? whatsapps.find((item) => item.primary) ?? whatsapps[0];
  const message = vehicle.purpose === "rental" ? `Olá! Gostaria de informações sobre a locação do ${vehicle.title} ${vehicle.modelYear}.` : `Olá! Tenho interesse no ${vehicle.title} ${vehicle.modelYear} anunciado no site. Ele ainda está disponível?`;
  const related = all.filter((item) => item.id !== vehicle.id && item.category === vehicle.category && item.status === "available").slice(0,3);
  const specs = [["Ano",`${vehicle.manufactureYear}/${vehicle.modelYear}`],["Quilometragem",formatMileage(vehicle.mileage)],["Combustível",vehicle.fuel],["Câmbio",vehicle.transmission],["Cor",vehicle.color],["Portas",String(vehicle.doors)],["Motor",vehicle.engine ?? "—"],["Potência",vehicle.power ?? "—"],["Categoria",vehicle.category],["Finalidade",purposeLabel(vehicle.purpose)]];
  return <div className="pb-20 pt-24 md:pt-28"><div className="page-shell"><div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase text-muted"><Link href="/veiculos">Veículos</Link><span>/</span><span className="text-white">{vehicle.title}</span></div><VehicleGallery images={vehicle.images} /><div className="grid gap-12 py-12 lg:grid-cols-[1fr_390px]"><div><p className="eyebrow text-acid">{vehicle.brand} · {statusLabel(vehicle.status)}</p><h1 className="editorial-title mt-4 text-5xl md:text-7xl">{vehicle.title}</h1><p className="mt-3 text-base text-muted">{vehicle.version}</p><div className="mt-9 grid grid-cols-2 border-y border-line sm:grid-cols-3">{specs.map(([label,value]) => <div key={label} className="border-b border-r border-line px-1 py-5 sm:even:border-r"><p className="eyebrow">{label}</p><p className="mt-2 text-sm font-medium">{value}</p></div>)}</div><section className="py-12"><p className="eyebrow mb-4">Sobre este veículo</p><p className="max-w-3xl text-lg leading-8 text-white/78">{vehicle.description}</p></section><section><p className="eyebrow mb-5">Equipamentos e opcionais</p><div className="grid gap-px bg-line sm:grid-cols-2">{vehicle.features.map((feature) => <div key={feature} className="flex items-center gap-3 bg-surface px-4 py-4 text-sm"><Check size={15} className="text-acid" />{feature}</div>)}</div></section></div><aside><div className="sticky top-24 border border-line bg-surface p-6"><p className="eyebrow">Valor</p><p className="mt-2 text-3xl font-semibold text-acid">{vehicle.priceOnRequest || !vehicle.showPrice ? "Sob consulta" : formatCurrency(vehicle.price)}</p>{vehicle.dailyPrice && <p className="mt-1 text-xs text-muted">Locação a partir de {formatCurrency(vehicle.dailyPrice)} / dia</p>}<div className="mt-6 space-y-2"><p className="flex items-center gap-2 text-xs text-muted"><Gauge size={14} />{formatMileage(vehicle.mileage)}</p><p className="flex items-center gap-2 text-xs text-muted"><Settings2 size={14} />{vehicle.transmission}</p><p className="flex items-center gap-2 text-xs text-muted"><MapPin size={14} />{vehicle.location}</p></div><div className="mt-7 grid gap-2">{whatsapp && <WhatsAppLink href={whatsappUrl(whatsapp.number,message)} vehicleId={vehicle.id} className="w-full" />}<ChatOpenButton className="w-full" /></div><p className="mt-5 text-[10px] leading-4 text-muted">Anúncio demonstrativo. Preço, disponibilidade e especificações devem ser confirmados pela equipe.</p></div></aside></div>{related.length > 0 && <section className="border-t border-line py-16"><div className="mb-8"><p className="eyebrow mb-2">Continue explorando</p><h2 className="text-3xl font-semibold">Veículos relacionados</h2></div><div className="grid gap-8 md:grid-cols-3">{related.map((item) => <VehicleCard key={item.id} vehicle={item} />)}</div></section>}</div><div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-line bg-canvas/95 p-2 backdrop-blur md:hidden">{whatsapp && <WhatsAppLink href={whatsappUrl(whatsapp.number,message)} vehicleId={vehicle.id} className="w-full px-2 text-xs" />}<ChatOpenButton className="w-full px-2 text-xs" /></div></div>;
}
