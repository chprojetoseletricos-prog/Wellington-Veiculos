import { AdminMessages } from "@/components/admin/admin-messages";
import { getAdminChatData } from "@/lib/data";
export default async function MessagesPage(){const data=await getAdminChatData();return <AdminMessages initialConversations={data?.conversations} initialMessages={data?.messages}/>;}
