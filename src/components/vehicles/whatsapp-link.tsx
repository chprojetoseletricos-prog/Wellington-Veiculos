"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppLink({ href, vehicleId, className, label = "Falar pelo WhatsApp" }: { href: string; vehicleId: string; className?: string; label?: string }) {
  function track() {
    const payload = JSON.stringify({ vehicleId });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/events/whatsapp", new Blob([payload], { type: "application/json" }));
    else void fetch("/api/events/whatsapp", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true });
  }
  return <a href={href} target="_blank" rel="noreferrer" onClick={track} aria-label={label} className={cn("inline-flex h-12 items-center justify-center gap-2 bg-acid px-5 text-sm font-semibold text-canvas hover:bg-white", className)}><MessageCircle size={17} /><span className="sm:hidden">WhatsApp</span><span className="hidden sm:inline">{label}</span></a>;
}
