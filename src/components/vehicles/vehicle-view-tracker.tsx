"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VehicleViewTracker() {
  const pathname = usePathname();
  const match = pathname.match(/^\/veiculos\/([^/]+)$/);
  const slug = match ? decodeURIComponent(match[1]) : "";
  useEffect(() => {
    if (!slug) return;
    const key = `wv-view:${slug}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    let sessionId = window.localStorage.getItem("wv-session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      window.localStorage.setItem("wv-session", sessionId);
    }
    void fetch("/api/events/view", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, sessionId }), keepalive: true });
  }, [slug]);
  return null;
}
