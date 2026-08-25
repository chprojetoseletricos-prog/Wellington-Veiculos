import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { Vehicle } from "@/types";

export function EditorialVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  const [lead, ...rest] = vehicles.slice(0, 4);
  if (!lead) return null;
  return (
    <section className="py-20 md:py-28">
      <div className="page-shell">
        <div className="mb-10 flex items-end justify-between gap-5"><div><p className="eyebrow mb-3">Nossa seleção</p><h2 className="editorial-title max-w-2xl text-4xl md:text-6xl">Máquinas escolhidas uma a uma.</h2></div><Link href="/veiculos" className="hidden items-center gap-2 border-b border-acid pb-2 text-sm md:flex">Ver todos <ArrowUpRight size={16} /></Link></div>
        <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          <Link href={`/veiculos/${lead.slug}`} className="group relative min-h-[520px] overflow-hidden bg-surface lg:min-h-[720px]">
            <Image src={lead.images[0].url} alt={lead.images[0].alt} fill sizes="(max-width: 1024px) 100vw, 62vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-black/25" /><div className="absolute inset-x-0 bottom-0 h-48 bg-black/55" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-9"><div><p className="font-mono text-[10px] uppercase text-acid">{lead.category} · {lead.modelYear}</p><h3 className="mt-2 text-3xl font-semibold md:text-5xl">{lead.title}</h3><p className="mt-2 text-sm text-white/70">{lead.version}</p></div><div className="hidden text-right md:block"><p className="text-lg font-semibold">{formatCurrency(lead.price)}</p><span className="mt-3 inline-grid size-12 place-items-center border border-white/45 group-hover:border-acid group-hover:bg-acid group-hover:text-canvas"><ArrowUpRight size={20} /></span></div></div>
          </Link>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((vehicle, index) => <Link key={vehicle.id} href={`/veiculos/${vehicle.slug}`} className={`group relative min-h-[300px] overflow-hidden bg-surface ${index === 2 ? "sm:col-span-2" : ""}`}><Image src={vehicle.images[0].url} alt={vehicle.images[0].alt} fill sizes="(max-width: 1024px) 50vw, 38vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-black/28" /><div className="absolute inset-x-0 bottom-0 h-28 bg-black/55" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5"><div><p className="font-mono text-[9px] uppercase text-acid">{vehicle.brand} · {vehicle.modelYear}</p><h3 className="mt-1 text-xl font-semibold">{vehicle.title}</h3></div><ArrowUpRight size={19} /></div></Link>)}
          </div>
        </div>
        <Link href="/veiculos" className="mt-8 flex items-center justify-center gap-2 border border-line py-4 text-sm md:hidden">Ver todos <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  );
}
