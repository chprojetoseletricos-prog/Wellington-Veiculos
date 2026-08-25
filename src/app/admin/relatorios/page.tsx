import { DashboardChart } from "@/components/admin/dashboard-chart";
import { getAdminAnalyticsData } from "@/lib/data";

export default async function ReportsPage() {
  const analytics = await getAdminAnalyticsData();
  const metrics = [["Visualizações", analytics.totals.views], ["Cliques WhatsApp", analytics.totals.whatsapp], ["Chats iniciados", analytics.totals.chats], ["Formulários", analytics.totals.leads]] as const;
  return <>
    <div className="mb-6"><p className="eyebrow mb-2">Analytics interno</p><h1 className="text-2xl font-semibold">Relatórios</h1><p className="mt-1 text-xs text-muted">Sinais comerciais sem rastreamento invasivo.</p></div>
    <div className="grid gap-px border border-line bg-line sm:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="bg-surface p-5"><strong className="text-3xl">{new Intl.NumberFormat("pt-BR").format(value)}</strong><p className="mt-1 text-xs text-muted">{label}</p></div>)}</div>
    <section className="mt-6 border border-line bg-surface p-5"><div className="mb-4"><h2 className="text-sm font-semibold">Interesse nos últimos 7 dias</h2><p className="mt-1 text-[10px] text-muted">Visualizações e conversões registradas pelo site.</p></div><DashboardChart data={analytics.series} /></section>
    <section className="mt-6 border border-line bg-surface"><div className="border-b border-line px-5 py-4"><h2 className="text-sm font-semibold">Veículos mais vistos</h2></div>{analytics.topVehicles.map((vehicle, index) => <div key={`${vehicle.name}-${index}`} className="grid grid-cols-[30px_1fr_80px_80px] gap-3 border-b border-line px-5 py-4 text-xs last:border-0"><span className="text-muted">{String(index + 1).padStart(2, "0")}</span><strong>{vehicle.name}</strong><span>{vehicle.views} views</span><span className="text-acid">{vehicle.contacts} contatos</span></div>)}{analytics.topVehicles.length === 0 && <p className="p-8 text-center text-xs text-muted">Os dados aparecerão após as primeiras visitas.</p>}</section>
  </>;
}
