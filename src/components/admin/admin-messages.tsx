"use client";

import { CheckCheck, MoreHorizontal, Search, Send, UserCheck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { AdminConversation, AdminMessage } from "@/types";

const fallbackConversations: AdminConversation[] = [
  { id: "61000000-0000-4000-8000-000000000001", name: "Marina Alves", phone: "(85) 99901-4421", vehicle: "Jeep Compass Limited", last: "Gostaria de saber o valor da diária.", time: "10:42", unread: 2, status: "open" },
  { id: "61000000-0000-4000-8000-000000000002", name: "João Pedro", phone: "(85) 98810-3360", vehicle: "Toyota Corolla XEi", last: "Ele ainda está disponível?", time: "09:18", unread: 1, status: "open" },
  { id: "61000000-0000-4000-8000-000000000003", name: "Carlos Lima", phone: "(85) 99770-1204", vehicle: "Porsche 911 Carrera", last: "Obrigado pelo atendimento.", time: "Ontem", unread: 0, status: "pending" },
];
const fallbackMessages: Record<string, AdminMessage[]> = {
  "61000000-0000-4000-8000-000000000001": [
    { id: "62000000-0000-4000-8000-000000000001", sender: "visitor", content: "Olá, gostaria de saber o valor da diária.", time: "10:38" },
    { id: "62000000-0000-4000-8000-000000000002", sender: "admin", content: "Olá, Marina. O Compass está disponível a partir de R$ 490 por dia. Para qual período você precisa?", time: "10:40" },
    { id: "62000000-0000-4000-8000-000000000003", sender: "visitor", content: "Seria de sexta até segunda. Há limite de quilometragem?", time: "10:42" },
  ],
};

export function AdminMessages({ initialConversations, initialMessages }: { initialConversations?: AdminConversation[]; initialMessages?: Record<string, AdminMessage[]> }) {
  const [conversations, setConversations] = useState(initialConversations ?? fallbackConversations);
  const [messageMap, setMessageMap] = useState(initialMessages ?? fallbackMessages);
  const [selectedId, setSelectedId] = useState((initialConversations ?? fallbackConversations)[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const selected = conversations.find((item) => item.id === selectedId) ?? conversations[0];
  const messages = selected ? messageMap[selected.id] ?? [] : [];
  const filtered = useMemo(() => conversations.filter((item) => `${item.name} ${item.vehicle}`.toLowerCase().includes(query.toLowerCase())), [conversations, query]);

  useEffect(() => {
    if (!selected?.id || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createBrowserSupabaseClient();
    const channel = supabase.channel(`admin-conversation:${selected.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selected.id}` }, (payload) => {
      const row = payload.new as { id: string; sender_type: "visitor" | "admin"; content: string; created_at: string };
      setMessageMap((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []).filter((item) => item.id !== row.id), { id: row.id, sender: row.sender_type, content: row.content, time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(row.created_at)), createdAt: row.created_at }] }));
    }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [selected?.id]);

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !selected) return;
    const optimistic: AdminMessage = { id: crypto.randomUUID(), sender: "admin", content, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    setMessageMap((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []), optimistic] }));
    setDraft("");
    const response = await fetch("/api/chat/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId: selected.id, content, senderType: "admin" }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessageMap((current) => ({ ...current, [selected.id]: (current[selected.id] ?? []).filter((item) => item.id !== optimistic.id) }));
      setDraft(content);
      toast.error(payload.error ?? "A resposta não foi gravada. Tente novamente.");
      return;
    }
    const createdAt = payload.createdAt ?? new Date().toISOString();
    const saved = { ...optimistic, id: payload.id ?? optimistic.id, time: new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(createdAt)), createdAt };
    setMessageMap((current) => ({ ...current, [selected.id]: [...(current[selected.id] ?? []).filter((item) => item.id !== optimistic.id && item.id !== saved.id), saved] }));
  }

  async function updateConversation(values: { status?: AdminConversation["status"]; take?: boolean }) {
    if (!selected) return;
    const response = await fetch(`/api/admin/conversations/${selected.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    if (!response.ok) return toast.error("Não foi possível atualizar a conversa.");
    setConversations((current) => current.map((item) => item.id === selected.id ? { ...item, status: values.status ?? item.status, assignedTo: values.take ? "Você" : item.assignedTo } : item));
    toast.success(values.take ? "Conversa atribuída a você." : "Status da conversa atualizado.");
  }

  if (!selected) return <div className="grid min-h-[560px] place-items-center border border-line bg-surface text-center"><div><p className="eyebrow text-acid">Caixa de entrada</p><h1 className="mt-3 text-xl font-semibold">Nenhuma conversa iniciada.</h1><p className="mt-2 text-xs text-muted">Novos chats aparecerão aqui em tempo real.</p></div></div>;

  return <div className="grid min-h-[calc(100svh-120px)] border border-line bg-surface xl:grid-cols-[290px_1fr_280px]"><aside className="border-b border-line xl:border-b-0 xl:border-r"><div className="border-b border-line p-4"><h1 className="text-base font-semibold">Mensagens</h1><label className="relative mt-4 block"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar conversa" className="h-10 w-full bg-canvas pl-9 pr-3 text-xs" /></label></div><div className="max-h-72 overflow-y-auto xl:max-h-[calc(100svh-220px)]">{filtered.map((conversation) => <button key={conversation.id} onClick={() => setSelectedId(conversation.id)} className={`w-full border-b border-line p-4 text-left ${selected.id === conversation.id ? "bg-surface-strong" : "hover:bg-canvas/45"}`}><div className="flex items-center justify-between gap-2"><strong className="text-xs">{conversation.name}</strong><span className="font-mono text-[9px] text-muted">{conversation.time}</span></div><p className="mt-1 truncate text-[10px] text-acid">{conversation.vehicle}</p><div className="mt-2 flex items-center justify-between"><p className="truncate pr-3 text-[10px] text-muted">{conversation.last}</p>{conversation.unread > 0 && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-acid font-mono text-[9px] text-canvas">{conversation.unread}</span>}</div></button>)}</div></aside><section className="flex min-h-[560px] flex-col border-b border-line xl:border-b-0 xl:border-r"><div className="flex h-16 items-center justify-between border-b border-line px-5"><div><p className="text-sm font-semibold">{selected.name}</p><p className="mt-1 text-[10px] text-muted">{selected.vehicle}</p></div><button className="grid size-9 place-items-center border border-line" aria-label="Mais opções"><MoreHorizontal size={17} /></button></div><div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message) => <div key={message.id} className={`max-w-[78%] px-4 py-3 text-xs leading-5 ${message.sender === "admin" ? "ml-auto bg-acid text-canvas" : "bg-canvas"}`}><p>{message.content}</p><span className="mt-1 flex items-center justify-end gap-1 text-[8px] opacity-60">{message.time}{message.sender === "admin" && <CheckCheck size={10} />}</span></div>)}</div><form onSubmit={send} className="flex gap-2 border-t border-line p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Digite sua resposta" className="h-12 min-w-0 flex-1 bg-canvas px-3 text-xs" /><button className="grid size-12 place-items-center bg-acid text-canvas" aria-label="Enviar resposta"><Send size={17} /></button></form></section><aside className="p-5"><p className="eyebrow mb-5">Cliente</p><div className="grid size-12 place-items-center rounded-full bg-acid text-sm font-bold text-canvas">{selected.name.split(" ").map((value) => value[0]).join("").slice(0, 2)}</div><h2 className="mt-4 text-sm font-semibold">{selected.name}</h2><p className="mt-1 text-xs text-muted">{selected.phone}</p>{selected.email && <p className="mt-1 text-xs text-muted">{selected.email}</p>}<div className="mt-6 border-y border-line py-4"><p className="eyebrow">Interesse</p><p className="mt-2 text-xs">{selected.vehicle}</p></div><label className="mt-5 block"><span className="eyebrow mb-2 block">Status</span><select value={selected.status} onChange={(event) => updateConversation({ status: event.target.value as AdminConversation["status"] })} className="h-10 w-full border border-line bg-canvas px-3 text-xs"><option value="open">Aberta</option><option value="pending">Pendente</option><option value="closed">Fechada</option></select></label><button onClick={() => updateConversation({ take: true })} className="mt-4 flex h-10 w-full items-center justify-center gap-2 border border-line text-xs hover:border-acid"><UserCheck size={14} />{selected.assignedTo ? `Responsável: ${selected.assignedTo}` : "Assumir conversa"}</button></aside></div>;
}
