"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function DashboardChart({ data }: { data: Array<{ day: string; views: number; leads: number }> }) {
  return <div className="h-[290px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}><CartesianGrid stroke="#252a2e" vertical={false} /><XAxis dataKey="day" stroke="#73777c" fontSize={10} tickLine={false} axisLine={false} /><YAxis stroke="#73777c" fontSize={10} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ background: "#121518", border: "1px solid #282c30", borderRadius: 2, fontSize: 11 }} /><Area type="monotone" dataKey="views" stroke="#dfff3f" fill="#dfff3f" fillOpacity={0.12} strokeWidth={2} /><Area type="monotone" dataKey="leads" stroke="#f06b4f" fill="transparent" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>;
}
