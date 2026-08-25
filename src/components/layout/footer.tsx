import { ArrowUpRight, Camera, Play, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings, getWhatsAppNumbers } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export async function Footer() {
  const [settings, whatsapps] = await Promise.all([getSiteSettings(), getWhatsAppNumbers()]);
  const primary = whatsapps.find((item) => item.primary) ?? whatsapps[0];
  return (
    <footer className="border-t border-line bg-[#0b0d0e] pt-16">
      <div className="page-shell">
        <div className="grid gap-12 border-b border-line pb-16 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            {settings.alternateLogoUrl || settings.logoUrl ? <span className="relative block h-12 w-44"><Image src={settings.alternateLogoUrl || settings.logoUrl} alt={settings.companyName} fill sizes="176px" className="object-contain object-left" /></span> : <span className="inline-grid size-11 place-items-center bg-acid font-mono text-sm font-bold text-canvas">WV</span>}
            <h2 className="mt-6 max-w-md text-3xl font-semibold">A escolha começa muito antes da chave.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{settings.about}</p>
          </div>
          <div>
            <p className="eyebrow mb-5">Visite</p>
            <p className="text-sm leading-6">{settings.address}<br />{settings.city}, {settings.state}</p>
            <p className="mt-4 text-xs leading-5 text-muted">{settings.hours}</p>
          </div>
          <div>
            <p className="eyebrow mb-5">Explore</p>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/veiculos">Veículos</Link><Link href="/veiculos?finalidade=rental">Aluguel</Link><Link href="/lancamentos">Lançamentos</Link><Link href="/sobre">Sobre</Link><Link href="/contato">Contato</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-5">Contato</p>
            <a href={`mailto:${settings.email}`} className="block text-sm">{settings.email}</a>
            {primary && <a href={whatsappUrl(primary.number, primary.defaultMessage)} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-sm text-acid">{primary.number} <ArrowUpRight size={15} /></a>}
            <div className="mt-7 flex gap-3">
              <a href={settings.social.instagram} aria-label="Instagram" className="grid size-10 place-items-center border border-line"><Camera size={17} /></a>
              <a href={settings.social.facebook} aria-label="Facebook" className="grid size-10 place-items-center border border-line"><Share2 size={17} /></a>
              <a href={settings.social.youtube} aria-label="YouTube" className="grid size-10 place-items-center border border-line"><Play size={17} /></a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 py-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {settings.companyName}. Todos os direitos reservados.</p>
          <div className="flex gap-5"><Link href="/privacidade">Privacidade</Link><Link href="/admin">Acesso administrativo</Link></div>
        </div>
      </div>
    </footer>
  );
}
