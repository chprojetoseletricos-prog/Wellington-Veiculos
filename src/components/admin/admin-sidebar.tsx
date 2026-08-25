"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { BarChart3, CarFront, ChevronDown, ImageIcon, LayoutDashboard, LogOut, Menu, MessageSquare, Newspaper, Settings, Users, UserRoundSearch, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const nav = [
  ["Dashboard", "/admin", LayoutDashboard], ["Veículos", "/admin/veiculos", CarFront], ["Lançamentos", "/admin/lancamentos", Newspaper], ["Mensagens", "/admin/mensagens", MessageSquare], ["Leads", "/admin/leads", UserRoundSearch], ["Banners", "/admin/banners", ImageIcon], ["Usuários", "/admin/usuarios", Users], ["Relatórios", "/admin/relatorios", BarChart3], ["Configurações", "/admin/configuracoes", Settings],
] as const;

function Navigation({ close }: { close?: () => void }) {
  const pathname = usePathname();
  return <nav className="space-y-1 px-3">{nav.map(([label,href,Icon]) => { const active = href === "/admin" ? pathname === href : pathname.startsWith(href); return <Link onClick={close} key={href} href={href} className={cn("flex h-11 items-center gap-3 rounded-[3px] px-3 text-sm text-muted transition-colors hover:bg-surface-strong hover:text-white", active && "bg-surface-strong text-white")}><Icon size={17} className={active ? "text-acid" : ""} />{label}</Link>; })}</nav>;
}

export function AdminSidebar() {
  const [open,setOpen] = useState(false); const router = useRouter();
  async function logout() { try { await createBrowserSupabaseClient().auth.signOut(); } catch {} router.push("/auth/login"); router.refresh(); }
  return <><aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-line bg-[#0b0d0e] lg:flex"><div className="flex h-18 items-center gap-3 border-b border-line px-5"><span className="grid size-8 place-items-center bg-acid font-mono text-[10px] font-bold text-canvas">WV</span><div><p className="text-sm font-semibold">Wellington</p><p className="text-[10px] text-muted">Painel administrativo</p></div></div><div className="flex-1 overflow-y-auto py-4"><Navigation /></div><div className="border-t border-line p-3"><button onClick={logout} className="flex h-11 w-full items-center gap-3 px-3 text-sm text-muted hover:text-white"><LogOut size={17} /> Sair</button></div></aside><header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-line bg-canvas px-4 lg:hidden"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center bg-acid font-mono text-[10px] font-bold text-canvas">WV</span><span className="text-sm font-semibold">Painel</span></div><Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger asChild><button className="grid size-10 place-items-center border border-line" aria-label="Abrir navegação"><Menu size={19} /></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70" /><Dialog.Content className="fixed inset-y-0 left-0 z-[80] w-[min(88vw,330px)] bg-[#0b0d0e]"><div className="flex h-16 items-center justify-between border-b border-line px-4"><Dialog.Title className="text-sm font-semibold">Navegação</Dialog.Title><Dialog.Close className="grid size-10 place-items-center border border-line"><X size={18} /></Dialog.Close></div><div className="py-4"><Navigation close={() => setOpen(false)} /></div></Dialog.Content></Dialog.Portal></Dialog.Root></header></>;
}

export function AdminTopbar() { return <div className="mb-7 flex min-h-12 items-center justify-between gap-4 border-b border-line pb-5"><div><p className="text-xs text-muted">Operação em tempo real</p><p className="mt-1 text-sm font-semibold">Visão geral da empresa</p></div><button className="flex h-10 items-center gap-2 border border-line px-3 text-xs"><span className="size-2 rounded-full bg-acid" /> Wellington Owner <ChevronDown size={14} /></button></div>; }
