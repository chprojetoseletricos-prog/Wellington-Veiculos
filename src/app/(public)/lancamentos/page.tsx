import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getLaunches } from "@/lib/data";

export default async function LaunchesPage() {
  const launches = await getLaunches();
  const [lead, ...rest] = launches;
  if (!lead) return <div className="pb-24 pt-32"><div className="page-shell"><p className="eyebrow mb-4">Editorial Wellington</p><h1 className="editorial-title text-5xl md:text-8xl">Lançamentos</h1><p className="mt-8 border-t border-line py-12 text-sm text-muted">Nenhum editorial está publicado.</p></div></div>;
  return <div className="pb-24 pt-32"><div className="page-shell">
    <p className="eyebrow mb-4">Editorial Wellington</p>
    <h1 className="editorial-title text-5xl md:text-8xl">Lançamentos</h1>
    <p className="mt-5 max-w-xl text-sm leading-6 text-muted">O que chega, o que muda e o que vale dirigir. Leitura curada para quem acompanha o automóvel além da ficha técnica.</p>
    <Link href={`/lancamentos/${lead.slug}`} className="group mt-12 grid overflow-hidden border-y border-line py-5 lg:grid-cols-[1.45fr_0.8fr] lg:items-end lg:gap-10">
      <div className="relative aspect-[16/9] overflow-hidden"><Image src={lead.image} alt={lead.title} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></div>
      <div className="py-7 lg:py-3"><p className="eyebrow text-acid">Em destaque · {lead.date.slice(0, 4)}</p><h2 className="mt-4 text-4xl font-semibold md:text-5xl">{lead.title}</h2><p className="mt-3 text-lg text-white/65">{lead.subtitle}</p><p className="mt-7 text-sm leading-6 text-muted">{lead.excerpt}</p><span className="mt-8 inline-flex items-center gap-2 border-b border-acid pb-2 text-sm">Ler editorial <ArrowUpRight size={16} /></span></div>
    </Link>
    <div className="grid gap-8 pt-12 md:grid-cols-2">{rest.map((item) => <Link key={item.id} href={`/lancamentos/${item.slug}`} className="group border-t border-line pt-4"><div className="relative aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></div><p className="eyebrow mt-5">{item.date}</p><h2 className="mt-2 text-3xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-muted">{item.excerpt}</p></Link>)}</div>
  </div></div>;
}
