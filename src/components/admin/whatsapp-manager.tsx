"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Edit3, GripVertical, Plus, Star, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { WhatsAppNumber } from "@/types";

export function WhatsAppManager({ initial }: { initial: WhatsAppNumber[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<WhatsAppNumber | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const data = new FormData(event.currentTarget);
    const value: WhatsAppNumber = {
      id: editing?.id ?? crypto.randomUUID(),
      name: String(data.get("name")),
      responsible: String(data.get("responsible")),
      number: String(data.get("number")),
      sector: String(data.get("sector")) as WhatsAppNumber["sector"],
      defaultMessage: String(data.get("message")),
      active: data.get("active") === "on",
      primary: editing?.primary ?? false,
      priority: editing?.priority ?? items.length + 1,
    };
    const response = await fetch(editing ? `/api/admin/whatsapp/${editing.id}` : "/api/admin/whatsapp", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    const payload = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      toast.error(payload.error ?? "Não foi possível salvar o contato.");
      return;
    }
    const saved = { ...value, id: editing?.id ?? payload.id ?? value.id };
    setItems((current) => editing ? current.map((item) => item.id === editing.id ? saved : item) : [...current, saved]);
    toast.success(editing ? "WhatsApp atualizado." : "WhatsApp adicionado.");
    setOpen(false);
    setEditing(null);
  }

  async function primary(id: string) {
    const response = await fetch(`/api/admin/whatsapp/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ primary: true }) });
    if (!response.ok) {
      toast.error("Não foi possível alterar o contato principal.");
      return;
    }
    setItems((current) => current.map((item) => ({ ...item, primary: item.id === id })));
    toast.success("Contato principal atualizado.");
  }

  async function remove(id: string) {
    if (!window.confirm("Deseja desativar este WhatsApp? O histórico será preservado.")) return;
    const response = await fetch(`/api/admin/whatsapp/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Não foi possível desativar o contato.");
      return;
    }
    setItems((current) => current.map((item) => item.id === id ? { ...item, active: false, primary: false } : item));
    toast.success("WhatsApp desativado.");
  }

  return <>
    <div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-semibold">Números de atendimento</p><p className="mt-1 text-[10px] text-muted">Defina setor, prioridade e mensagem inicial.</p></div><button onClick={() => { setEditing(null); setOpen(true); }} className="flex h-10 items-center gap-2 bg-acid px-4 text-xs font-semibold text-canvas"><Plus size={14} />Adicionar</button></div>
    <div className="divide-y divide-line border border-line bg-surface">
      {[...items].sort((a, b) => a.priority - b.priority).map((item) => <article key={item.id} className="grid gap-3 p-4 md:grid-cols-[30px_1fr_1fr_90px_105px] md:items-center">
        <GripVertical size={16} className="hidden text-muted md:block" />
        <div><div className="flex items-center gap-2"><strong className="text-xs">{item.name}</strong>{item.primary && <span className="bg-acid px-2 py-0.5 font-mono text-[8px] text-canvas">Principal</span>}</div><p className="mt-1 text-[10px] text-muted">{item.responsible}</p></div>
        <div><p className="text-xs">{item.number}</p><p className="mt-1 text-[10px] uppercase text-muted">{item.sector}</p></div>
        <span className={`w-fit px-2 py-1 font-mono text-[8px] ${item.active ? "bg-acid/10 text-acid" : "bg-signal/10 text-signal"}`}>{item.active ? "Ativo" : "Inativo"}</span>
        <div className="flex gap-1 md:justify-end"><button onClick={() => primary(item.id)} className="grid size-9 place-items-center border border-line" title="Definir principal"><Star size={13} className={item.primary ? "fill-acid text-acid" : ""} /></button><button onClick={() => { setEditing(item); setOpen(true); }} className="grid size-9 place-items-center border border-line" title="Editar"><Edit3 size={13} /></button><button onClick={() => remove(item.id)} className="grid size-9 place-items-center border border-line text-signal" title="Desativar"><Trash2 size={13} /></button></div>
      </article>)}
    </div>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 border border-line bg-surface p-5">
          <div className="flex items-center justify-between"><Dialog.Title className="text-base font-semibold">{editing ? "Editar WhatsApp" : "Novo WhatsApp"}</Dialog.Title><Dialog.Close className="grid size-9 place-items-center border border-line"><X size={16} /></Dialog.Close></div>
          <Dialog.Description className="mt-1 text-[10px] text-muted">Este número poderá receber contatos contextuais do site.</Dialog.Description>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            {[["name", "Nome do canal", editing?.name], ["responsible", "Responsável", editing?.responsible], ["number", "Número com DDD", editing?.number]].map(([name, label, value]) => <label key={name} className="block"><span className="eyebrow mb-2 block">{label}</span><input name={name} defaultValue={value} required className="h-11 w-full border border-line bg-canvas px-3 text-sm" /></label>)}
            <label><span className="eyebrow mb-2 block">Setor</span><select name="sector" defaultValue={editing?.sector ?? "sales"} className="h-11 w-full border border-line bg-canvas px-3 text-sm"><option value="sales">Vendas</option><option value="rental">Locação</option><option value="support">Atendimento</option></select></label>
            <label className="sm:col-span-2"><span className="eyebrow mb-2 block">Mensagem padrão</span><textarea name="message" defaultValue={editing?.defaultMessage} required rows={4} className="w-full resize-none border border-line bg-canvas p-3 text-sm" /></label>
            <label className="flex items-center gap-2 text-xs"><input name="active" type="checkbox" defaultChecked={editing?.active ?? true} className="accent-[#dfff3f]" />Canal ativo</label>
            <button disabled={saving} className="h-11 bg-acid text-xs font-semibold text-canvas disabled:opacity-50 sm:justify-self-end sm:px-6">{saving ? "Salvando..." : "Salvar contato"}</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
