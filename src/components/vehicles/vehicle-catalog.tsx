"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import type { Vehicle } from "@/types";

type Filters = { purpose: string; brand: string; model: string; year: string; minPrice: string; maxPrice: string; maxMileage: string; fuel: string; transmission: string; color: string; category: string };
const empty: Filters = { purpose: "", brand: "", model: "", year: "", minPrice: "", maxPrice: "", maxMileage: "", fuel: "", transmission: "", color: "", category: "" };

export function VehicleCatalog({ vehicles, initial, showSold = false }: { vehicles: Vehicle[]; initial?: Partial<Filters>; showSold?: boolean }) {
  const [filters, setFilters] = useState<Filters>({ ...empty, ...initial });
  const [sort, setSort] = useState("recent");
  const set = (key: keyof Filters, value: string) => setFilters((state) => ({ ...state, [key]: value }));
  const options = (key: keyof Vehicle) => Array.from(new Set(vehicles.map((item) => String(item[key])).filter(Boolean))).sort();

  const filtered = useMemo(() => vehicles.filter((vehicle) => {
    if (!["available", "reserved"].includes(vehicle.status) && !(showSold && vehicle.status === "sold")) return false;
    if (filters.purpose && vehicle.purpose !== filters.purpose && vehicle.purpose !== "both") return false;
    if (filters.brand && vehicle.brand !== filters.brand) return false;
    if (filters.model && vehicle.model !== filters.model) return false;
    if (filters.year && vehicle.modelYear < Number(filters.year)) return false;
    if (filters.minPrice && (vehicle.price ?? 0) < Number(filters.minPrice)) return false;
    if (filters.maxPrice && (vehicle.price ?? Number.POSITIVE_INFINITY) > Number(filters.maxPrice)) return false;
    if (filters.maxMileage && vehicle.mileage > Number(filters.maxMileage)) return false;
    if (filters.fuel && vehicle.fuel !== filters.fuel) return false;
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
    if (filters.color && vehicle.color !== filters.color) return false;
    if (filters.category && vehicle.category !== filters.category) return false;
    return true;
  }).sort((a, b) => sort === "price-asc" ? (a.price ?? Infinity) - (b.price ?? Infinity) : sort === "price-desc" ? (b.price ?? 0) - (a.price ?? 0) : sort === "mileage-asc" ? a.mileage - b.mileage : sort === "mileage-desc" ? b.mileage - a.mileage : Date.parse(b.createdAt) - Date.parse(a.createdAt)), [filters, showSold, sort, vehicles]);

  const controls = <div className="space-y-5">
    <FilterSelect label="Finalidade" value={filters.purpose} onChange={(v) => set("purpose", v)} options={[['sale','Venda'],['rental','Aluguel']]} />
    <FilterSelect label="Marca" value={filters.brand} onChange={(v) => set("brand", v)} options={options("brand").map((v) => [v,v])} />
    <FilterSelect label="Modelo" value={filters.model} onChange={(v) => set("model", v)} options={options("model").map((v) => [v,v])} />
    <FilterSelect label="Ano mínimo" value={filters.year} onChange={(v) => set("year", v)} options={['2026','2025','2024','2023'].map((v) => [v,v])} />
    <div className="grid grid-cols-2 gap-2"><FilterInput label="Preço mín." value={filters.minPrice} onChange={(v) => set("minPrice", v)} /><FilterInput label="Preço máx." value={filters.maxPrice} onChange={(v) => set("maxPrice", v)} /></div>
    <FilterSelect label="Quilometragem até" value={filters.maxMileage} onChange={(v) => set("maxMileage", v)} options={[["10000","10.000 km"],["30000","30.000 km"],["60000","60.000 km"]]} />
    <FilterSelect label="Combustível" value={filters.fuel} onChange={(v) => set("fuel", v)} options={options("fuel").map((v) => [v,v])} />
    <FilterSelect label="Câmbio" value={filters.transmission} onChange={(v) => set("transmission", v)} options={options("transmission").map((v) => [v,v])} />
    <FilterSelect label="Cor" value={filters.color} onChange={(v) => set("color", v)} options={options("color").map((v) => [v,v])} />
    <FilterSelect label="Categoria" value={filters.category} onChange={(v) => set("category", v)} options={options("category").map((v) => [v,v])} />
    <button onClick={() => setFilters(empty)} className="w-full border border-line py-3 text-xs text-muted hover:text-white">Limpar filtros</button>
  </div>;

  return <div className="page-shell py-12"><div className="mb-7 flex items-center justify-between border-y border-line py-4"><p className="font-mono text-[11px] text-muted"><strong className="text-white">{filtered.length}</strong> veículos encontrados</p><div className="flex items-center gap-3"><Dialog.Root><Dialog.Trigger asChild><button className="flex h-10 items-center gap-2 border border-line px-3 text-xs lg:hidden"><SlidersHorizontal size={15} /> Filtros</button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[60] bg-black/70" /><Dialog.Content className="fixed inset-y-0 right-0 z-[70] w-[min(92vw,390px)] overflow-y-auto bg-surface p-5"><div className="mb-7 flex items-center justify-between"><Dialog.Title className="text-lg font-semibold">Filtrar veículos</Dialog.Title><Dialog.Close className="grid size-10 place-items-center border border-line"><X size={18} /></Dialog.Close></div>{controls}</Dialog.Content></Dialog.Portal></Dialog.Root><label className="flex items-center gap-2 text-xs text-muted"><span className="hidden sm:inline">Ordenar</span><select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 border border-line bg-canvas px-3 text-xs text-white"><option value="recent">Mais recentes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="mileage-asc">Menor km</option><option value="mileage-desc">Maior km</option></select></label></div></div><div className="grid gap-10 lg:grid-cols-[230px_1fr]"><aside className="hidden lg:block"><div className="sticky top-24">{controls}</div></aside><div>{filtered.length ? <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} priority={index < 3} />)}</div> : <div className="grid min-h-[420px] place-items-center border border-line text-center"><div><p className="font-mono text-xs uppercase text-acid">Nenhum resultado</p><h2 className="mt-3 text-2xl font-semibold">Tente ampliar seus filtros.</h2><button onClick={() => setFilters(empty)} className="mt-5 border-b border-acid pb-2 text-sm">Ver todos os veículos</button></div></div>}</div></div></div>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="block"><span className="eyebrow mb-2 block">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-full border border-line bg-canvas px-3 text-sm"><option value="">Todos</option>{options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>; }
function FilterInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block"><span className="eyebrow mb-2 block">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} type="number" min="0" className="h-11 w-full border border-line bg-canvas px-3 text-sm" /></label>; }
