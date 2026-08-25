import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { getVehicles } from "@/lib/data";
export default async function EditVehiclePage({params}:{params:Promise<{id:string}>}) { const {id}=await params; const vehicle=(await getVehicles("authenticated")).find((item)=>item.id===id); if(!vehicle) notFound(); return <VehicleForm vehicle={vehicle} />; }
