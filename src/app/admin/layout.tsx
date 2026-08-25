import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Painel", template: "%s | Painel Wellington" }, robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="min-h-screen bg-canvas text-ink"><AdminSidebar /><main className="px-4 pb-10 pt-22 lg:ml-64 lg:px-7 lg:pt-7 xl:px-10">{children}</main></div>; }
