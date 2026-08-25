"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { MailPlus, ShieldCheck, ShieldOff, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { AdminRole, AdminUser } from "@/types";

const seed: AdminUser[] = [
  { id: "u1", name: "Wellington Silva", email: "wellington@empresa.com", role: "owner", active: true, lastAccess: "Agora" },
  { id: "u2", name: "Rafael Costa", email: "rafael@empresa.com", role: "sales", active: true, lastAccess: "Hoje, 09:42" },
  { id: "u3", name: "Marina Alves", email: "marina@empresa.com", role: "support", active: true, lastAccess: "Hoje, 08:12" },
];
const labels: Record<AdminRole, string> = { owner: "Proprietário", admin: "Administrador", manager: "Gerente", sales: "Vendas", support: "Atendimento" };

export function AdminUsers({ initial }: { initial?: AdminUser[] }) {
  const [items, setItems] = useState(initial ?? seed);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users/invite", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
    const payload = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      toast.error(payload.error ?? "Não foi possível enviar o convite.");
      return;
    }
    setItems((current) => [...current, payload.user]);
    toast.success("Convite administrativo enviado.");
    setOpen(false);
  }

  async function update(id: string, changes: Partial<Pick<AdminUser, "role" | "active">>) {
    const previous = items;
    setItems((current) => current.map((user) => user.id === id ? { ...user, ...changes } : user));
    const response = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(changes) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setItems(previous);
      toast.error(payload.error ?? "Não foi possível alterar o acesso.");
      return;
    }
    toast.success(changes.role ? "Permissão atualizada." : changes.active ? "Usuário reativado." : "Usuário desativado.");
  }

  return <>
    <div className="mb-5 flex justify-end"><button onClick={() => setOpen(true)} className="flex h-10 items-center gap-2 bg-acid px-4 text-xs font-semibold text-canvas"><MailPlus size={14} />Convidar usuário</button></div>
    <div className="divide-y divide-line border border-line bg-surface">
      {items.map((user) => <article key={user.id} className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_150px_110px] md:items-center">
        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-canvas text-[10px] font-bold">{user.name.split(" ").map((value) => value[0]).join("").slice(0, 2)}</span><div><strong className="text-xs">{user.name}</strong><p className="mt-1 text-[10px] text-muted">{user.email}</p></div></div>
        <div className="hidden text-[10px] text-muted md:block">Último acesso: {user.lastAccess}</div>
        <select disabled={user.role === "owner"} value={user.role} onChange={(event) => update(user.id, { role: event.target.value as AdminRole })} className="h-9 border border-line bg-canvas px-2 text-[10px] disabled:opacity-60">{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <button disabled={user.role === "owner"} onClick={() => update(user.id, { active: !user.active })} className={`flex h-9 items-center justify-center gap-1 border border-line px-2 text-[9px] disabled:opacity-60 ${user.active ? "text-acid" : "text-muted"}`}>{user.active ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}{user.active ? "Ativo" : "Inativo"}</button>
      </article>)}
    </div>
    <div className="mt-5 border border-line bg-surface p-5 text-xs leading-6 text-muted"><strong className="text-white">Controle por função</strong><br />Owner possui acesso total. Admin gerencia quase tudo. Manager opera veículos, leads e mensagens. Sales acessa veículos, leads e chat. Support acessa chat e leads.</div>
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2 border border-line bg-surface p-5">
          <div className="flex justify-between"><Dialog.Title className="text-base font-semibold">Convidar usuário</Dialog.Title><Dialog.Close className="grid size-9 place-items-center border border-line"><X size={16} /></Dialog.Close></div>
          <Dialog.Description className="mt-1 text-[10px] text-muted">O usuário receberá acesso conforme a função escolhida.</Dialog.Description>
          <form onSubmit={invite} className="mt-6 space-y-4">
            <label className="block"><span className="eyebrow mb-2 block">Nome</span><input name="name" required className="h-11 w-full border border-line bg-canvas px-3 text-sm" /></label>
            <label className="block"><span className="eyebrow mb-2 block">E-mail</span><input name="email" type="email" required className="h-11 w-full border border-line bg-canvas px-3 text-sm" /></label>
            <label className="block"><span className="eyebrow mb-2 block">Função</span><select name="role" className="h-11 w-full border border-line bg-canvas px-3 text-sm">{Object.entries(labels).filter(([value]) => value !== "owner").map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <button disabled={saving} className="h-11 w-full bg-acid text-xs font-semibold text-canvas disabled:opacity-50">{saving ? "Enviando..." : "Enviar convite"}</button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
