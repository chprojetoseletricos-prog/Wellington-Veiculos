"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminBanner, Vehicle } from "@/types";

type HeroSlide = { id: string; title: string; subtitle?: string; image: string; mobileImage: string; url: string; cta: string; label: string; meta: string[] };

export function Hero({ vehicles, banners, defaultHero }: { vehicles: Vehicle[]; banners: AdminBanner[]; defaultHero: string }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const vehicleSlides: HeroSlide[] = vehicles.filter((vehicle) => vehicle.images[0]).map((vehicle) => ({ id: `vehicle-${vehicle.id}`, title: vehicle.title, subtitle: vehicle.version, image: vehicle.images[0].url, mobileImage: vehicle.images[0].url, url: `/veiculos/${vehicle.slug}`, cta: "Conhecer veículo", label: "Seleção em destaque", meta: [String(vehicle.modelYear), vehicle.fuel, vehicle.transmission, vehicle.power].filter(Boolean) as string[] }));
  const vehicleUrls = new Set(vehicleSlides.map((slide) => slide.url));
  const bannerSlides: HeroSlide[] = banners.filter((banner) => !vehicleUrls.has(banner.url)).map((banner) => ({ id: `banner-${banner.id}`, title: banner.title, subtitle: banner.subtitle, image: banner.desktop, mobileImage: banner.mobile, url: banner.url, cta: banner.cta, label: "Campanha Wellington", meta: [] }));
  const items = [...vehicleSlides, ...bannerSlides].slice(0, 6);
  const slide = items[active] ?? items[0];

  useEffect(() => {
    if (reduced || items.length < 2) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % items.length), 7000);
    return () => window.clearInterval(timer);
  }, [items.length, reduced]);

  const move = (direction: number) => setActive((value) => (value + direction + items.length) % items.length);

  if (!slide) return <section className="relative flex h-[88svh] min-h-[660px] max-h-[940px] items-end overflow-hidden bg-canvas pb-20 pt-28 image-noise"><Image src={defaultHero} alt="Automóvel premium em arquitetura contemporânea" fill priority sizes="100vw" className="object-cover object-[62%_center]" /><div className="absolute inset-0 bg-black/45" /><div className="page-shell relative z-10"><p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase text-acid"><span className="h-px w-10 bg-acid" /> Wellington Veículos</p><h1 className="editorial-title max-w-[11ch] text-[clamp(3.2rem,10vw,9rem)]">Escolhas que movem.</h1><Link href="/veiculos" className="mt-8 inline-flex h-12 items-center gap-3 border-b border-acid text-sm font-semibold">Explorar veículos <ArrowUpRight size={17} /></Link></div></section>;

  return <section className="relative h-[88svh] min-h-[660px] max-h-[940px] overflow-hidden bg-canvas image-noise">
    <AnimatePresence mode="wait">
      <motion.div key={slide.id} className="absolute inset-0" initial={reduced ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
        <Image src={slide.mobileImage} alt={slide.title} fill priority sizes="100vw" className="object-cover object-[62%_center] md:hidden" />
        <Image src={slide.image} alt={slide.title} fill priority sizes="100vw" className="hidden object-cover object-[62%_center] md:block" />
        <div className="absolute inset-0 bg-black/36" /><div className="absolute inset-y-0 left-0 w-[58%] bg-black/30" /><div className="absolute inset-x-0 bottom-0 h-36 bg-canvas/55" />
      </motion.div>
    </AnimatePresence>
    <div className="page-shell relative z-10 flex h-full flex-col justify-end pb-20 pt-28 md:pb-16">
      <AnimatePresence mode="wait">
        <motion.div key={slide.id} initial={reduced ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5 }} className="max-w-5xl">
          <p className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase text-acid"><span className="h-px w-10 bg-acid" /> {slide.label}</p>
          <h1 className="editorial-title max-w-[11ch] text-[clamp(3.2rem,10vw,9.6rem)]">{slide.title}</h1>
          {slide.subtitle && <p className="mt-4 max-w-xl text-sm text-white/72 md:text-lg">{slide.subtitle}</p>}
          {slide.meta.length > 0 && <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[10px] uppercase text-white/72 md:text-xs">{slide.meta.map((value) => <span key={value}>{value}</span>)}</div>}
          <Link href={slide.url} className="mt-8 inline-flex h-12 items-center gap-3 border-b border-acid text-sm font-semibold text-white transition-colors hover:text-acid">{slide.cta} <ArrowUpRight size={17} /></Link>
        </motion.div>
      </AnimatePresence>
      <div className="mt-12 flex items-end justify-between border-t border-white/25 pt-4">
        <div className="flex items-center gap-4 font-mono text-[10px]"><span className="text-white">{String(active + 1).padStart(2, "0")}</span><div className="flex gap-1">{items.map((item, index) => <button key={item.id} onClick={() => setActive(index)} className={`h-px transition-all ${index === active ? "w-12 bg-acid" : "w-6 bg-white/35"}`} aria-label={`Mostrar ${item.title}`} />)}</div><span className="text-muted">{String(items.length).padStart(2, "0")}</span></div>
        <div className="flex gap-2"><button onClick={() => move(-1)} className="grid size-10 place-items-center border border-white/25 hover:border-acid" aria-label="Destaque anterior"><ChevronLeft size={17} /></button><button onClick={() => move(1)} className="grid size-10 place-items-center border border-white/25 hover:border-acid" aria-label="Próximo destaque"><ChevronRight size={17} /></button></div>
      </div>
    </div>
    <a href="#explorar" className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 font-mono text-[9px] uppercase text-white/60 lg:flex">Explorar <ArrowDown size={13} /></a>
  </section>;
}
