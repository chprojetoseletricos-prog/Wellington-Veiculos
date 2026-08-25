"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatOpenButton({ className, label = "Conversar pelo chat" }: { className?: string; label?: string }) {
  return <button onClick={() => window.dispatchEvent(new Event("wv:open-chat"))} aria-label={label} className={cn("inline-flex h-12 items-center justify-center gap-2 border border-line px-5 text-sm font-semibold hover:border-acid", className)}><MessageCircle size={17} /><span className="sm:hidden">Chat</span><span className="hidden sm:inline">{label}</span></button>;
}
