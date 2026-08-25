import { AdminLeads } from "@/components/admin/admin-leads";
import { getAdminLeadsData } from "@/lib/data";
export default async function LeadsPage(){const leads=await getAdminLeadsData();return <AdminLeads initial={leads ?? undefined}/>;}
