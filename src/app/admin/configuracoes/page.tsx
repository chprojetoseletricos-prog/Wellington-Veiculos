import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/data";
export default async function SettingsPage(){const settings=await getSiteSettings();return <><div className="mb-6"><p className="eyebrow mb-2">Administração</p><h1 className="text-2xl font-semibold">Configurações</h1><p className="mt-1 text-xs text-muted">Atualize empresa, aparência e canais sem editar código.</p></div><SettingsForm settings={settings}/></>}
