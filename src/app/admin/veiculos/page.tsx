import { AdminVehicles } from "@/components/admin/admin-vehicles";
import { getVehicles } from "@/lib/data";
export default async function AdminVehiclesPage() { const vehicles=await getVehicles(); return <><div className="mb-6"><p className="eyebrow mb-2">Estoque</p><h1 className="text-2xl font-semibold">Veículos</h1><p className="mt-1 text-xs text-muted">Cadastre, publique e acompanhe todo o inventário.</p></div><AdminVehicles vehicles={vehicles} /></>; }
