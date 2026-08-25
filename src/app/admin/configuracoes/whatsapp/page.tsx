import { WhatsAppManager } from "@/components/admin/whatsapp-manager";
import { getWhatsAppNumbers } from "@/lib/data";
export default async function WhatsAppSettingsPage(){const items=await getWhatsAppNumbers();return <><div className="mb-6"><p className="eyebrow mb-2">Configurações</p><h1 className="text-2xl font-semibold">WhatsApp</h1><p className="mt-1 text-xs text-muted">Organize os canais que aparecem em cada jornada.</p></div><WhatsAppManager initial={items}/></>}
