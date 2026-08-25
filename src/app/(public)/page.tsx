import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EditorialVehicles } from "@/components/home/editorial-vehicles";
import { Hero } from "@/components/home/hero";
import { QuickSearch } from "@/components/home/quick-search";
import { getActiveBanners, getLaunches, getSiteSettings, getVehicles, getWhatsAppNumbers } from "@/lib/data";
import { whatsappUrl } from "@/lib/utils";

export default async function HomePage() {
  const [vehicles, launches, settings, whatsapps, banners] = await Promise.all([getVehicles(), getLaunches(), getSiteSettings(), getWhatsAppNumbers(), getActiveBanners()]);
  const publicVehicles = vehicles.filter((item) => item.status === "available" || item.status === "reserved");
  const featured = publicVehicles.filter((item) => item.featured);
  const brands = Array.from(new Set(vehicles.map((item) => item.brand))).sort();
  const models = Array.from(new Set(vehicles.map((item) => item.model))).sort();
  const primary = whatsapps.find((item) => item.primary) ?? whatsapps[0];
  return (
    <>
      <Hero vehicles={featured} banners={banners} defaultHero={settings.heroUrl} />
      <QuickSearch brands={brands} models={models} />
      <EditorialVehicles vehicles={featured} />

      <section className="border-y border-line">
        <div className="grid md:grid-cols-2">
          <Link href="/veiculos?finalidade=sale" className="group relative min-h-[470px] overflow-hidden border-b border-line md:border-b-0 md:border-r">
            <Image src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=88" alt="Carro premium em showroom" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-black/46" /><div className="absolute inset-x-0 bottom-0 h-40 bg-black/45" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-12"><p className="eyebrow text-white/65">01 · Para comprar</p><div className="mt-3 flex items-end justify-between"><div><h2 className="text-4xl font-semibold md:text-6xl">Seu próximo.</h2><p className="mt-2 text-sm text-white/68">Procedência, configuração e escolha sem pressa.</p></div><span className="grid size-12 place-items-center border border-white/40 transition-colors group-hover:bg-acid group-hover:text-canvas"><ArrowUpRight /></span></div></div>
          </Link>
          <Link href="/veiculos?finalidade=rental" className="group relative min-h-[470px] overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1800&q=88" alt="Automóvel em viagem de estrada" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            <div className="absolute inset-0 bg-black/44" /><div className="absolute inset-x-0 bottom-0 h-40 bg-black/45" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-12"><p className="eyebrow text-white/65">02 · Para alugar</p><div className="mt-3 flex items-end justify-between"><div><h2 className="text-4xl font-semibold md:text-6xl">Seu caminho.</h2><p className="mt-2 text-sm text-white/68">Mobilidade premium pelo tempo que fizer sentido.</p></div><span className="grid size-12 place-items-center border border-white/40 transition-colors group-hover:bg-acid group-hover:text-canvas"><ArrowUpRight /></span></div></div>
          </Link>
        </div>
      </section>

      <section className="bg-[#e8e8e2] py-20 text-[#101214] md:py-32">
        <div className="page-shell grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div><p className="font-mono text-[10px] uppercase text-[#62666a]">Nossa forma de trabalhar</p><h2 className="editorial-title mt-5 max-w-[12ch] text-5xl md:text-7xl xl:text-8xl">Não exibimos apenas carros. Selecionamos o que merece ser visto.</h2></div>
          <div className="lg:pb-2"><p className="max-w-md text-base leading-7 text-[#4d5154]">{settings.about}</p><div className="mt-10 grid grid-cols-3 border-y border-black/18 py-5"><div><strong className="block text-2xl">12+</strong><span className="text-[10px] uppercase text-[#62666a]">anos de seleção</span></div><div><strong className="block text-2xl">360°</strong><span className="text-[10px] uppercase text-[#62666a]">inspeção</span></div><div><strong className="block text-2xl">1:1</strong><span className="text-[10px] uppercase text-[#62666a]">atendimento</span></div></div><Link href="/sobre" className="mt-8 inline-flex items-center gap-2 border-b border-black pb-2 text-sm font-semibold">Conheça a Wellington <ArrowUpRight size={16} /></Link></div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="page-shell">
          <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow mb-3">Em movimento</p><h2 className="text-4xl font-semibold md:text-6xl">Lançamentos</h2></div><Link href="/lancamentos" className="hidden items-center gap-2 text-sm md:flex">Todos os editoriais <ArrowRight size={16} /></Link></div>
          <div className="grid border-t border-line lg:grid-cols-3">
            {launches.map((launch, index) => <Link key={launch.id} href={`/lancamentos/${launch.slug}`} className="group border-b border-line py-5 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"><div className="relative aspect-[16/10] overflow-hidden bg-surface"><Image src={launch.image} alt={launch.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /><span className="absolute left-3 top-3 bg-canvas px-2 py-1 font-mono text-[9px]">0{index + 1}</span></div><p className="eyebrow mt-5">{new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(launch.date))}</p><h3 className="mt-2 text-2xl font-semibold">{launch.title}</h3><p className="mt-2 text-sm leading-6 text-muted">{launch.excerpt}</p></Link>)}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-acid py-16 text-canvas md:py-24">
        <div className="page-shell flex flex-col gap-9 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-[10px] uppercase">Atendimento direto</p><h2 className="editorial-title mt-5 max-w-4xl text-5xl md:text-7xl">Encontrou algo interessante?</h2><p className="mt-5 text-sm text-black/65">Nossa equipe está disponível para conversar, sem formulários intermináveis.</p></div>{primary && <a href={whatsappUrl(primary.number, primary.defaultMessage)} target="_blank" rel="noreferrer" className="inline-flex h-14 shrink-0 items-center justify-center gap-3 bg-canvas px-7 text-sm font-semibold text-white">Falar no WhatsApp <ArrowUpRight size={18} /></a>}</div>
      </section>
    </>
  );
}
