"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuickSearch({ brands, models }: { brands: string[]; models: string[] }) {
  const router = useRouter();
  const [purpose, setPurpose] = useState("sale");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");

  function search() {
    const params = new URLSearchParams();
    if (purpose) params.set("finalidade", purpose);
    if (brand) params.set("marca", brand);
    if (model) params.set("modelo", model);
    if (year) params.set("ano", year);
    if (price) params.set("precoMax", price);
    router.push(`/veiculos?${params.toString()}`);
  }

  return (
    <section id="explorar" className="border-b border-line bg-[#0d0f11] py-10">
      <div className="page-shell">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div><p className="eyebrow mb-2">Busca rápida</p><h2 className="text-xl font-semibold md:text-2xl">O que move você agora?</h2></div>
          <div className="flex border border-line p-1" aria-label="Finalidade">
            {[['sale','Comprar'],['rental','Alugar']].map(([value, label]) => <button key={value} onClick={() => setPurpose(value)} className={`h-9 px-4 text-xs font-semibold ${purpose === value ? "bg-ink text-canvas" : "text-muted"}`}>{label}</button>)}
          </div>
        </div>
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
          <label className="bg-surface px-4 py-3"><span className="eyebrow block pb-2">Marca</span><select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-transparent text-sm outline-none"><option value="">Todas as marcas</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="bg-surface px-4 py-3"><span className="eyebrow block pb-2">Modelo</span><select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-transparent text-sm outline-none"><option value="">Todos os modelos</option>{models.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="bg-surface px-4 py-3"><span className="eyebrow block pb-2">Ano mínimo</span><select value={year} onChange={(e) => setYear(e.target.value)} className="w-full bg-transparent text-sm outline-none"><option value="">Qualquer ano</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option></select></label>
          <label className="bg-surface px-4 py-3"><span className="eyebrow block pb-2">Até</span><select value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-transparent text-sm outline-none"><option value="">Qualquer valor</option><option value="180000">R$ 180 mil</option><option value="300000">R$ 300 mil</option><option value="500000">R$ 500 mil</option></select></label>
          <button onClick={search} className="flex min-h-16 items-center justify-center gap-2 bg-acid px-7 text-sm font-semibold text-canvas hover:bg-white"><Search size={17} /> Encontrar veículos</button>
        </div>
      </div>
    </section>
  );
}
