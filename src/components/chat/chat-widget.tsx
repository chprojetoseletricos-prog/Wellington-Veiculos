"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type Visitor = { id?: string; conversationId?: string; name: string; phone: string; email?: string };
type Message = { id: string; sender: "visitor" | "admin"; content: string; time: string };

export function ChatWidget({ vehicleId }: { vehicleId?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("wv-visitor");
    if (stored) window.queueMicrotask(() => setVisitor(JSON.parse(stored) as Visitor));
  }, []);

  useEffect(() => {
    if (!visitor?.conversationId || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createBrowserSupabaseClient();
    const channel = supabase.channel(`conversation:${visitor.conversationId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${visitor.conversationId}` }, (payload) => {
      const row = payload.new as { id: string; sender_type: "visitor" | "admin"; content: string; created_at: string };
      if (row.sender_type === "admin") setMessages((items) => items.some((item) => item.id === row.id) ? items : [...items, { id: row.id, sender: "admin", content: row.content, time: new Date(row.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]);
    }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [visitor?.conversationId]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("wv:open-chat", handleOpen);
    return () => window.removeEventListener("wv:open-chat", handleOpen);
  }, []);

  async function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const nextVisitor = { name: String(form.get("name")), phone: String(form.get("phone")), email: String(form.get("email") ?? "") };
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
        }
      }
      const response = await fetch("/api/chat/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...nextVisitor, vehicleId }) });
      const data = (await response.json()) as { visitorId?: string; conversationId?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível iniciar.");
      const value = { ...nextVisitor, id: data.visitorId, conversationId: data.conversationId };
      window.localStorage.setItem("wv-visitor", JSON.stringify(value));
      setVisitor(value);
      setMessages([{ id: "welcome", sender: "admin", content: `Olá, ${nextVisitor.name.split(" ")[0]}. Como podemos ajudar?`, time: "agora" }]);
    } catch { toast.error("Não foi possível iniciar a conversa."); } finally { setLoading(false); }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || !visitor) return;
    setDraft("");
    const optimistic = { id: crypto.randomUUID(), sender: "visitor" as const, content, time: "agora" };
    setMessages((items) => [...items, optimistic]);
    try {
      const response = await fetch("/api/chat/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId: visitor.conversationId, visitorId: visitor.id, vehicleId, content }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error);
      setMessages((items) => items.map((item) => item.id === optimistic.id ? { ...item, id: payload.id ?? item.id } : item));
    } catch { setMessages((items) => items.filter((item) => item.id !== optimistic.id)); setDraft(content); toast.error("Mensagem não enviada. Tente novamente."); }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild><button className={`fixed bottom-5 right-5 z-40 size-13 place-items-center rounded-full bg-ink text-canvas shadow-xl transition-transform hover:scale-105 ${/^\/veiculos\/[^/]+$/.test(pathname) ? "hidden md:grid" : "grid"}`} aria-label="Abrir chat"><MessageCircle size={21} /></button></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/55" />
        <Dialog.Content className="fixed bottom-0 right-0 z-[70] flex h-[min(680px,92svh)] w-full max-w-[420px] flex-col border border-line bg-surface sm:bottom-5 sm:right-5">
          <div className="flex h-16 items-center justify-between border-b border-line px-5"><div><Dialog.Title className="text-sm font-semibold">Atendimento Wellington</Dialog.Title><Dialog.Description className="mt-0.5 text-[10px] text-muted">Resposta em horário comercial</Dialog.Description></div><Dialog.Close className="grid size-10 place-items-center border border-line" aria-label="Fechar chat"><X size={18} /></Dialog.Close></div>
          {!visitor ? <form onSubmit={start} className="flex flex-1 flex-col justify-center p-6"><p className="eyebrow mb-3">Conversa direta</p><h2 className="text-3xl font-semibold">Olá.<br />Como podemos ajudar?</h2><div className="mt-8 space-y-3"><label className="block text-xs text-muted">Nome<input name="name" required minLength={2} className="mt-1 h-12 w-full border border-line bg-canvas px-3 text-sm text-ink" /></label><label className="block text-xs text-muted">Telefone<input name="phone" required minLength={8} className="mt-1 h-12 w-full border border-line bg-canvas px-3 text-sm text-ink" /></label><label className="block text-xs text-muted">E-mail <span className="opacity-60">(opcional)</span><input name="email" type="email" className="mt-1 h-12 w-full border border-line bg-canvas px-3 text-sm text-ink" /></label></div><button disabled={loading} className="mt-5 h-12 bg-acid text-sm font-semibold text-canvas disabled:opacity-50">{loading ? "Iniciando..." : "Iniciar conversa"}</button><p className="mt-4 text-[10px] leading-4 text-muted">Ao continuar, você concorda com o uso dos dados apenas para este atendimento.</p></form> : <><div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">{messages.map((message) => <div key={message.id} className={`max-w-[82%] px-3 py-2.5 text-sm leading-5 ${message.sender === "visitor" ? "ml-auto bg-acid text-canvas" : "bg-canvas text-ink"}`}><p>{message.content}</p><span className="mt-1 block text-right text-[9px] opacity-60">{message.time}</span></div>)}</div><form onSubmit={send} className="flex gap-2 border-t border-line p-3"><label className="sr-only" htmlFor="chat-message">Mensagem</label><input id="chat-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escreva sua mensagem" className="h-12 min-w-0 flex-1 bg-canvas px-3 text-sm" /><button className="grid size-12 place-items-center bg-acid text-canvas" aria-label="Enviar mensagem"><Send size={18} /></button></form></>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
