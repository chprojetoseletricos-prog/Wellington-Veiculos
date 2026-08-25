import { BannerManager } from "@/components/admin/banner-manager";
import { getAdminBannersData } from "@/lib/data";

export default async function BannersPage() {
  const banners = await getAdminBannersData();
  return <>
    <div className="mb-2"><p className="eyebrow mb-2">Conteúdo</p><h1 className="text-2xl font-semibold">Banners</h1><p className="mt-1 text-xs text-muted">Organize campanhas desktop e mobile do site.</p></div>
    <BannerManager initial={banners ?? undefined} />
  </>;
}
