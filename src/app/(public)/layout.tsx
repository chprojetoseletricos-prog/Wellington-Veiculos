import { ChatWidget } from "@/components/chat/chat-widget";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { VehicleViewTracker } from "@/components/vehicles/vehicle-view-tracker";
import { getSiteSettings } from "@/lib/data";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header companyName={settings.companyName} tradeName={settings.tradeName} logoUrl={settings.logoUrl} />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
      <VehicleViewTracker />
    </div>
  );
}
