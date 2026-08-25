import { AdminUsers } from "@/components/admin/admin-users";
import { getAdminUsersData } from "@/lib/data";

export default async function UsersPage() {
  const users = await getAdminUsersData();
  return <>
    <div className="mb-2"><p className="eyebrow mb-2">Segurança</p><h1 className="text-2xl font-semibold">Usuários administrativos</h1><p className="mt-1 text-xs text-muted">Controle acessos e responsabilidades da equipe.</p></div>
    <AdminUsers initial={users ?? undefined} />
  </>;
}
