"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Edit3, ExternalLink, Plus, ToggleLeft, ToggleRight, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { AdminLaunch } from "@/types";

export function LaunchManager({ initial }: { initial: AdminLaunch[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<AdminLaunch | null>(null);
  const [open, setOpen] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item: AdminLaunch = {
      id: editing?.id ?? crypto.randomUUID(),
      title: String(data.get("title")),
      slug: String(data.get("slug")),
      subtitle: String(data.get("subtitle")),
      excerpt: String(data.get("excerpt")),
      image: String(data.get("image")),
      date: String(data.get("date")),
      featured: data.get("featured") === "on",
      published: data.get("published") === "on",
      video: String(data.get("video") ?? ""),
      vehicleSlug: String(data.get("vehicleSlug") ?? ""),
      gallery: String(data.get("gallery") ?? "").split("\n").map((value) => value.trim()).filter(Boolean),
    };
    const response = await fetch(editing ? `/api/admin/launches/${editing.id}` : "/api/admin/launches", { method: editing ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(item) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return toast.error(payload.error ?? "Não foi possível salvar o lançamento.");
    const saved = { ...item, id: editing?.id ?? payload.id ?? item.id };
    setItems((current) => editing ? current.map((value) => value.id === editing.id ? saved : value) : [saved, ...current]);
    setOpen(false);
    setEditing(null);
    toast.success(editing ? "Lançamento atualizado." : "Lançamento criado.");
  }

  async function toggle(item: AdminLaunch) {
    const published = !item.published;
    const response = await fetch(`/api/admin/launches/${item.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ published }) });
    if (!response.ok) return toast.error("Não foi possível alterar a publicação.");
    setItems((values) => values.map((value) => value.id === item.id ? { ...value, published } : value));
    toast.success(published ? "Lançamento publicado." : "Lançamento movido para rascunho.");
  }

  async function remove(item: AdminLaunch) {
    if (!window.confirm("Esta ação excluirá permanentemente o lançamento e sua galeria. Continuar?")) return;
    const response = await fetch(`/api/admin/launches/${item.id}`, { method: "DELETE" });
    if (!response.ok) return toast.error("Não foi possível excluir.");
    setItems((values) => values.filter((value) => value.id !== item.id));
    toast.success("Lançamento removido.");
  }

  return <><div className="mb-5 flex justify-end"><button onClick={() => { setEditing(null); setOpen(true); }} className="flex h-10 items-center gap-2 bg-acid px-4 text-xs font-semibold text-canvas"><Plus size={14} />Novo lançamento</button></div><div className="divide-y divide-line border border-line bg-surface">{items.map((item) => <article key={item.id} className="grid gap-4 p-4 md:grid-cols-[140px_1fr_100px_140px] md:items-center"><div className="relative aspect-[16/9] overflow-hidden"><Image src={item.image} alt="" fill sizes="140px" className="object-cover" /></div><div><strong className="text-sm">{item.title}</strong><p className="mt-1 text-[10px] text-muted">{item.subtitle}</p><p className="mt-2 font-mono text-[9px] text-muted">{item.date}</p></div><button onClick={() => toggle(item)} className={`flex items-center gap-2 text-[10px] ${item.published ? "text-acid" : "text-muted"}`}>{item.published ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}{item.published ? "Publicado" : "Rascunho"}</button><div className="flex gap-1 md:justify-end"><Link href={`/lancamentos/${item.slug}`} target="_blank" className="grid size-9 place-items-center border border-line" title="Abrir"><ExternalLink size={13} /></Link><button onClick={() => { setEditing(item); setOpen(true); }} className="grid size-9 place-items-center border border-line" title="Editar"><Edit3 size={13} /></button><button onClick={() => remove(item)} className="grid size-9 place-items-center border border-line text-signal" title="Excluir"><Trash2 size={13} /></button></div></article>)}</div><Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[80] max-h-[92svh] w-[min(94vw,680px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-line bg-surface p-5"><div className="flex items-center justify-between"><Dialog.Title className="text-base font-semibold">{editing ? "Editar lançamento" : "Novo lançamento"}</Dialog.Title><Dialog.Close className="grid size-9 place-items-center border border-line"><X size={16} /></Dialog.Close></div><Dialog.Description className="mt-1 text-[10px] text-muted">Crie um editorial e relacione-o opcionalmente a um veículo.</Dialog.Description><LaunchForm key={editing?.id ?? "new"} item={editing} onSubmit={save} /></Dialog.Content></Dialog.Portal></Dialog.Root></>;
}

function LaunchForm({ item, onSubmit }: { item: AdminLaunch | null; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const input = "h-11 w-full border border-line bg-canvas px-3 text-sm";
  return <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Título"><input name="title" defaultValue={item?.title} required className={input} /></Field><Field label="Slug"><input name="slug" defaultValue={item?.slug} pattern="[a-z0-9-]+" required className={input} /></Field><Field label="Subtítulo" wide><input name="subtitle" defaultValue={item?.subtitle} className={input} /></Field><Field label="Resumo" wide><textarea name="excerpt" defaultValue={item?.excerpt} required rows={4} className="w-full resize-none border border-line bg-canvas p-3 text-sm" /></Field><Field label="Imagem principal" wide><input name="image" defaultValue={item?.image} required className={input} /></Field><Field label="Data"><input name="date" type="date" defaultValue={item?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10)} required className={input} /></Field><Field label="Vídeo opcional"><input name="video" defaultValue={item?.video} placeholder="https://" className={input} /></Field><Field label="Slug do veículo"><input name="vehicleSlug" defaultValue={item?.vehicleSlug} className={input} /></Field><Field label="URLs da galeria (uma por linha)" wide><textarea name="gallery" defaultValue={item?.gallery?.join("\n")} rows={4} className="w-full resize-none border border-line bg-canvas p-3 text-sm" /></Field><label className="flex items-center gap-2 text-xs"><input name="published" type="checkbox" defaultChecked={item?.published ?? true} />Publicado</label><label className="flex items-center gap-2 text-xs"><input name="featured" type="checkbox" defaultChecked={item?.featured ?? false} />Destaque</label><button className="h-11 bg-acid px-5 text-xs font-semibold text-canvas sm:col-span-2 sm:justify-self-end">Salvar lançamento</button></form>;
}
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "sm:col-span-2" : ""}><span className="eyebrow mb-2 block">{label}</span>{children}</label>; }
