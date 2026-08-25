import { ArrowUpRight, Gauge, Settings2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, formatMileage, purposeLabel, statusLabel } from "@/lib/utils";
import type { Vehicle } from "@/types";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  return (
    <article className="group min-w-0 border-t border-line pt-3">
      <Link href={`/veiculos/${vehicle.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          <Image src={vehicle.images[0].url} alt={vehicle.images[0].alt} fill priority={priority} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
          <div className="absolute left-3 top-3 flex gap-1.5"><span className="bg-canvas/90 px-2 py-1 font-mono text-[9px] uppercase text-white">{purposeLabel(vehicle.purpose)}</span>{vehicle.status !== "available" && <span className="bg-signal px-2 py-1 font-mono text-[9px] uppercase text-white">{statusLabel(vehicle.status)}</span>}</div>
          <span className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center bg-acid text-canvas opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={17} /></span>
        </div>
        <div className="pt-4">
          <p className="font-mono text-[10px] uppercase text-muted">{vehicle.brand} · {vehicle.modelYear}</p>
          <div className="mt-1 flex items-start justify-between gap-4"><h3 className="text-lg font-semibold leading-tight">{vehicle.title}<span className="block text-xs font-normal text-muted">{vehicle.version}</span></h3><p className="whitespace-nowrap text-sm font-semibold text-acid">{vehicle.priceOnRequest || !vehicle.showPrice ? "Sob consulta" : formatCurrency(vehicle.price)}</p></div>
          <div className="mt-4 flex gap-4 border-t border-line pt-3 text-[11px] text-muted"><span className="flex items-center gap-1.5"><Gauge size={13} />{formatMileage(vehicle.mileage)}</span><span className="flex items-center gap-1.5"><Settings2 size={13} />{vehicle.transmission}</span></div>
        </div>
      </Link>
    </article>
  );
}
