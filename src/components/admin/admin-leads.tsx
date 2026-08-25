"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AdminLead } from "@/types";

const seed: AdminLead[] = [
  { id: "63000000-0000-4000-8000-000000000001", name: "Ana Beatriz", phone: "(85) 99982-2120", email: "ana@email.com", vehicle: "BMW 320i M Sport", source: "WhatsApp", status: "new", date: "Hoje, 10:32", owner: "Rafael" },
  { id: "63000000-0000-4000-8000-000000000002", name: "Pedro Monte", phone: "(85) 98821-7710", email: "pedro@email.com", vehicle: "Toyota Hilux SRX", source: "Chat", status: "contacted", date: "Hoje, 09:10", owner: "Marina" },
  { id: "63000000-0000-4000-8000-000000000003", name: "Luiza Santos", phone: "(85) 99731-0821", email: "luiza@email.com", vehicle: "Honda Civic Advanced", source: "Formulário", status: "negotiation", date: "Ontem, 16:42", owner: "Rafael" },
  { id: "63000000-0000-4000-8000-000000000004", name: "Mateus Costa", phone: "(85) 99602-1109", email: "—", vehicle: "Jeep Compass Limited", source: "Chat", status: "won", date: "18 ago", owner: "Wellington" },
];
const labels: Record<AdminLead["status"], string> = { new: "Novo", contacted: "Contatado", negotiation: "Negociação", won: "Ganho", lost: "Perdido" };

export function AdminLeads({ initial }: { initial?: AdminLead[] }) {
  const [items, setItems] = useState(initial ?? seed);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => items.filter((item) => (!query || `${item.name} ${item.vehicle} ${item.phone}`.toLowerCase().includes(query.toLowerCase())) && (!filter || item.status === filter)), [items, query, filter]);

  async function change(id: string, status: AdminLead["status"]) {
    const previous = items;
    setItems((values) => values.map((item) => item.id === id ? { ...item, status } : item));
    const response = await fetch(`/api/admin/leads/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    if (response.ok) toast.success("Status do lead atualizado.");
    else { setItems(previous); toast.error("Não foi possível atualizar o lead."); }
  }

  return <><div className="mb-6"><p className="eyebrow mb-2">Comercial</p><h1 className="text-2xl font-semibold">Leads</h1><p className="mt-1 text-xs text-muted">Acompanhe cada contato até o fechamento.</p></div><div className="mb-4 flex flex-col gap-2 sm:flex-row"><label className="relative flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar nome, telefone ou veículo" className="h-11 w-full border border-line bg-surface pl-9 pr-3 text-xs" /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-11 border border-line bg-surface px-3 text-xs"><option value="">Todos os status</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="border border-line bg-surface"><div className="hidden grid-cols-[1fr_1.1fr_90px_130px_100px] gap-3 border-b border-line px-4 py-3 font-mono text-[9px] uppercase text-muted lg:grid"><span>Contato</span><span>Interesse</span><span>Origem</span><span>Status</span><span>Responsável</span></div><div className="divide-y divide-line">{filtered.map((lead) => <article key={lead.id} className="grid gap-3 p-4 text-xs lg:grid-cols-[1fr_1.1fr_90px_130px_100px] lg:items-center"><div><strong>{lead.name}</strong><p className="mt-1 text-[10px] text-muted">{lead.phone} · {lead.email}</p></div><div><p>{lead.vehicle}</p><p className="mt-1 text-[10px] text-muted">{lead.date}</p></div><span className="text-muted">{lead.source}</span><select value={lead.status} onChange={(event) => change(lead.id, event.target.value as AdminLead["status"])} className="h-9 border border-line bg-canvas px-2 text-[10px]"><option value="new">Novo</option><option value="contacted">Contatado</option><option value="negotiation">Negociação</option><option value="won">Ganho</option><option value="lost">Perdido</option></select><span>{lead.owner}</span></article>)}{filtered.length === 0 && <div className="p-12 text-center text-xs text-muted">Nenhum lead encontrado.</div>}</div></div></>;
}
