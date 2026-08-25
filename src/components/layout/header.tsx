"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  ["Início", "/"],
  ["Veículos", "/veiculos"],
  ["Aluguel", "/veiculos?finalidade=rental"],
  ["Lançamentos", "/lancamentos"],
  ["Sobre", "/sobre"],
  ["Contato", "/contato"],
] as const;

export function Header({ companyName, tradeName, logoUrl }: { companyName: string; tradeName: string; logoUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300",
        scrolled && "border-line/70 bg-canvas/92 backdrop-blur-md",
      )}
    >
      <div className={cn("page-shell flex h-20 items-center justify-between transition-all", scrolled && "h-16")}>
        <Link href="/" className="flex items-center gap-3" aria-label={`${companyName} - início`}>
          {logoUrl ? <span className="relative size-9"><Image src={logoUrl} alt="" fill sizes="36px" className="object-contain" /></span> : <span className="grid size-8 place-items-center bg-acid font-mono text-xs font-bold text-canvas">WV</span>}
          <span className="text-sm font-bold uppercase leading-none">
            {companyName}
            <span className="block max-w-44 truncate text-[10px] font-normal text-muted">{tradeName}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="group relative py-3 text-xs font-medium text-white/78 hover:text-white">
              {label}
              <span className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-acid transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contato" className="hidden h-11 items-center gap-2 rounded-[3px] bg-acid px-4 text-xs font-semibold text-canvas hover:bg-white md:flex">
            Falar com especialista <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="grid size-11 place-items-center border border-white/20 xl:hidden" aria-label="Abrir menu">
                <Menu size={20} />
              </button>
            </Dialog.Trigger>
            <AnimatePresence>
              {open && (
                <Dialog.Portal forceMount>
                  <Dialog.Overlay asChild>
                    <motion.div className="fixed inset-0 z-[70] bg-canvas/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                  </Dialog.Overlay>
                  <Dialog.Content asChild onOpenAutoFocus={(event) => event.preventDefault()}>
                    <motion.div
                      className="fixed inset-0 z-[80] flex flex-col bg-surface px-6 py-5"
                      initial={reduced ? false : { y: "-100%" }}
                      animate={{ y: 0 }}
                      exit={reduced ? { opacity: 0 } : { y: "-100%" }}
                      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex items-center justify-between border-b border-line pb-5">
                        <Dialog.Title className="font-mono text-xs uppercase text-muted">Navegação</Dialog.Title>
                        <Dialog.Close className="grid size-11 place-items-center border border-line" aria-label="Fechar menu"><X size={21} /></Dialog.Close>
                      </div>
                      <nav className="flex flex-1 flex-col justify-center gap-2">
                        {links.map(([label, href], index) => (
                          <motion.div key={href} initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + index * 0.04 }}>
                            <Dialog.Close asChild>
                              <Link href={href} className="flex items-center justify-between border-b border-line py-4 text-[clamp(1.6rem,8vw,3rem)] font-semibold">
                                {label} <ArrowUpRight size={22} className="text-acid" />
                              </Link>
                            </Dialog.Close>
                          </motion.div>
                        ))}
                      </nav>
                      <Dialog.Close asChild>
                        <Link href="/contato" className="flex h-14 items-center justify-center gap-2 bg-acid font-semibold text-canvas">
                          <MessageCircle size={18} /> Falar pelo WhatsApp
                        </Link>
                      </Dialog.Close>
                    </motion.div>
                  </Dialog.Content>
                </Dialog.Portal>
              )}
            </AnimatePresence>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
