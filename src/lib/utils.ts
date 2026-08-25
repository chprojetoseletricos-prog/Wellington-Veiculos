import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null) {
  if (value === null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMileage(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`;
}

export function whatsappUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function purposeLabel(purpose: "sale" | "rental" | "both") {
  return purpose === "sale" ? "Venda" : purpose === "rental" ? "Aluguel" : "Venda + aluguel";
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    available: "Disponível",
    reserved: "Reservado",
    sold: "Vendido",
    rented: "Alugado",
    unavailable: "Indisponível",
    archived: "Arquivado",
  };
  return labels[status] ?? status;
}
