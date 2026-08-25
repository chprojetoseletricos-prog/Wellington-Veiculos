"use client";

import { Save } from "lucide-react";
import Link from "next/link";
import { FormEvent } from "react";
import { toast } from "sonner";
import type { SiteSettings } from "@/types";

const inputClass = "h-11 w-full border border-line bg-canvas px-3 text-sm";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok) toast.success("Configurações salvas.");
    else toast.error(payload.error ?? "Não foi possível salvar as configurações.");
  }

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Section title="Empresa">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da empresa"><input name="companyName" defaultValue={settings.companyName} className={inputClass} /></Field>
            <Field label="Nome comercial"><input name="tradeName" defaultValue={settings.tradeName} className={inputClass} /></Field>
            <Field label="Slogan" wide><input name="slogan" defaultValue={settings.slogan} className={inputClass} /></Field>
            <Field label="Endereço" wide><input name="address" defaultValue={settings.address} className={inputClass} /></Field>
            <Field label="Cidade"><input name="city" defaultValue={settings.city} className={inputClass} /></Field>
            <Field label="Estado"><input name="state" defaultValue={settings.state} className={inputClass} /></Field>
            <Field label="Telefone"><input name="phone" defaultValue={settings.phone} className={inputClass} /></Field>
            <Field label="E-mail"><input name="email" type="email" defaultValue={settings.email} className={inputClass} /></Field>
            <Field label="Horário" wide><input name="hours" defaultValue={settings.hours} className={inputClass} /></Field>
            <Field label="URL do Google Maps" wide><input name="mapsUrl" type="url" defaultValue={settings.mapsUrl} placeholder="https://" className={inputClass} /></Field>
            <Field label="Texto institucional" wide><textarea name="about" defaultValue={settings.about} rows={5} className="w-full resize-none border border-line bg-canvas p-3 text-sm" /></Field>
          </div>
        </Section>
        <Section title="Redes sociais">
          <div className="grid gap-4 sm:grid-cols-2">
            {["instagram", "facebook", "tiktok", "youtube", "linkedin"].map((name) => <Field key={name} label={name}><input name={name} defaultValue={settings.social[name] ?? ""} placeholder="https://" className={inputClass} /></Field>)}
          </div>
        </Section>
      </div>
      <aside className="space-y-6">
        <Section title="Aparência">
          <div className="space-y-4">
            <Field label="Logo principal"><input name="logoUrl" type="url" defaultValue={settings.logoUrl} placeholder="https://" className={inputClass} /></Field>
            <Field label="Logo alternativa"><input name="alternateLogoUrl" type="url" defaultValue={settings.alternateLogoUrl} placeholder="https://" className={inputClass} /></Field>
            <Field label="Favicon"><input name="faviconUrl" type="url" defaultValue={settings.faviconUrl} placeholder="https://" className={inputClass} /></Field>
            <Field label="Hero padrão"><input name="heroUrl" defaultValue={settings.heroUrl} placeholder="/images/hero.jpg" className={inputClass} /></Field>
            <ColorField name="primaryColor" label="Cor principal" color={settings.primaryColor} />
            <ColorField name="accentColor" label="Cor de destaque" color={settings.accentColor} />
            <label className="flex items-center justify-between border-t border-line pt-4 text-xs"><span>Exibir vendidos no site</span><span><input type="hidden" name="showSoldVehicles" value="false" /><input name="showSoldVehicles" type="checkbox" defaultChecked={settings.showSoldVehicles} className="accent-[#dfff3f]" /></span></label>
          </div>
        </Section>
        <Link href="/admin/configuracoes/whatsapp" className="flex items-center justify-between border border-line bg-surface p-4 text-sm"><span><strong className="block">WhatsApp</strong><span className="mt-1 block text-[10px] text-muted">Números, setores e prioridades</span></span><span className="text-acid">Gerenciar</span></Link>
        <button className="flex h-11 w-full items-center justify-center gap-2 bg-acid text-xs font-semibold text-canvas"><Save size={15} />Salvar configurações</button>
      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="border border-line bg-surface"><div className="border-b border-line px-5 py-4"><h2 className="text-sm font-semibold">{title}</h2></div><div className="p-5">{children}</div></section>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={`block ${wide ? "sm:col-span-2" : ""}`}><span className="eyebrow mb-2 block capitalize">{label}</span>{children}</label>; }
function ColorField({ name, label, color }: { name: string; label: string; color: string }) { return <Field label={label}><div className="flex gap-2"><input name={name} type="color" defaultValue={color} className="h-11 w-14 border border-line bg-canvas p-1" /><input aria-label={`${label} hexadecimal`} defaultValue={color.toUpperCase()} className={`${inputClass} min-w-0`} /></div></Field>; }
