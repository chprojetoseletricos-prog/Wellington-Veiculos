import { LaunchManager } from "@/components/admin/launch-manager";
import { getAdminLaunchesData } from "@/lib/data";

export default async function AdminLaunchesPage() {
  const launches = await getAdminLaunchesData();
  return <>
    <div className="mb-2"><p className="eyebrow mb-2">Editorial</p><h1 className="text-2xl font-semibold">Lançamentos</h1><p className="mt-1 text-xs text-muted">Publique novidades, galerias e veículos relacionados.</p></div>
    <LaunchManager initial={launches} />
  </>;
}
