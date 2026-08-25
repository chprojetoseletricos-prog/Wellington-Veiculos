import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Archivo, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), title: { default: `${settings.companyName} | Curadoria automotiva premium`, template: `%s | ${settings.companyName}` }, description: `${settings.slogan} Veículos selecionados para compra e locação.`, applicationName: settings.companyName, icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined, openGraph: { title: settings.companyName, description: settings.slogan, type: "website", locale: "pt_BR", images: [settings.heroUrl] } };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const theme = { "--canvas": settings.primaryColor, "--acid": settings.accentColor } as CSSProperties;
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${spaceMono.variable}`}>
      <body style={theme}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{ className: "wv-toast" }}
        />
      </body>
    </html>
  );
}
