"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Edit3, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { AdminBanner } from "@/types";

export function BannerManager({ initial }: { initial?: AdminBanner[] }) {
  const [items, setItems] = useState(initial ?? []);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const data = new FormData(event.currentTarget);
    const item: AdminBanner = {
      id: editing?.id ?? crypto.randomUUID(),
      title: String(data.get("title")),
      subtitle: String(data.get("subtitle")),
      desktop: String(data.get("desktop")),
      mobile: String(data.get("mobile")),
      cta: String(data.get("cta")),
      url: String(data.get("url")),
      active: data.get("active") === "on",
      order: Number(data.get("order")),
    };
    const response = await fetch(editing ? `/api/admin/banners/${editing.id}` : "/api/admin/banners", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item),
    });
    const payload = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      toast.error(payload.error ?? "Não foi possível salvar o banner.");
      return;
    }
    const saved = { ...item, id: editing?.id ?? payload.id ?? item.id };
    setItems((current) => editing ? current.map((value) => value.id === editing.id ? saved : value) : [...current, saved]);
    setOpen(false);
    setEditing(null);
    toast.success(editing ? "Banner atualizado." : "Banner criado.");
  }

  async function remove(id: string) {
    if (!confirm("Esta ação excluirá o banner permanentemente. Continuar?")) return;
    const response = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Não foi possível remover o banner.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Banner removido.");
  }

  return <>
    <div className="mb-5 flex justify-end">
      <button onClick={() => { setEditing(null); setOpen(true); }} className="flex h-10 items-center gap-2 bg-acid px-4 text-xs font-semibold text-canvas"><Plus size={14} />Novo banner</button>
    </div>
    <div className="grid gap-4 xl:grid-cols-2">
      {[...items].sort((a, b) => a.order - b.order).map((item) => <article key={item.id} className="border border-line bg-surface">
        <div className="relative aspect-[16/7] overflow-hidden">
          <Image src={item.desktop} alt={item.title} fill sizes="50vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-x-0 bottom-0 p-4"><p className="text-lg font-semibold">{item.title}</p><p className="text-xs text-white/65">{item.subtitle}</p></div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <span className="font-mono text-[9px] text-muted">ORDEM {item.order}</span>
          <span className={`flex items-center gap-1 text-[9px] ${item.active ? "text-acid" : "text-muted"}`}>{item.active ? <Eye size={12} /> : <EyeOff size={12} />}{item.active ? "ATIVO" : "INATIVO"}</span>
          <div className="ml-auto flex gap-1">
            <button onClick={() => { setEditing(item); setOpen(true); }} className="grid size-9 place-items-center border border-line" title="Editar"><Edit3 size={13} /></button>
            <button onClick={() => remove(item.id)} className="grid size-9 place-items-center border border-line text-signal" title="Excluir"><Trash2 size={13} /></button>
          </div>
        </div>
      </article>)}
    </div>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] max-h-[90svh] w-[min(92vw,620px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-line bg-surface p-5">
          <div className="flex justify-between"><Dialog.Title className="text-base font-semibold">{editing ? "Editar banner" : "Novo banner"}</Dialog.Title><Dialog.Close className="grid size-9 place-items-center border border-line"><X size={16} /></Dialog.Close></div>
          <Dialog.Description className="mt-1 text-[10px] text-muted">Conteúdo utilizado no destaque principal e campanhas.</Dialog.Description>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            {[["title", "Título", editing?.title], ["subtitle", "Subtítulo", editing?.subtitle], ["desktop", "Imagem desktop", editing?.desktop], ["mobile", "Imagem mobile", editing?.mobile], ["cta", "Texto do CTA", editing?.cta], ["url", "URL do CTA", editing?.url], ["order", "Ordem", String(editing?.order ?? items.length + 1)]].map(([name, label, value]) => <label key={name} className={name === "desktop" || name === "mobile" ? "sm:col-span-2" : ""}><span className="eyebrow mb-2 block">{label}</span><input name={name} type={name === "order" ? "number" : "text"} defaultValue={value} required className="h-11 w-full border border-line bg-canvas px-3 text-sm" /></label>)}
            <label className="flex items-center gap-2 text-xs"><input name="active" type="checkbox" defaultChecked={editing?.active ?? true} />Ativo</label>
            <button disabled={saving} className="h-11 bg-acid px-5 text-xs font-semibold text-canvas disabled:opacity-50">{saving ? "Salvando..." : "Salvar banner"}</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
