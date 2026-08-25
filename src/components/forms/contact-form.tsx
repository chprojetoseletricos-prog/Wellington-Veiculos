"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({ name: z.string().min(2, "Informe seu nome."), phone: z.string().min(8, "Informe um telefone válido."), email: z.string().email("E-mail inválido."), subject: z.string().min(2, "Informe o assunto."), message: z.string().min(10, "Escreva pelo menos 10 caracteres.") });
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  async function submit(values: FormValues) { const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...values, source: "contact_form" }) }); if (!response.ok) { toast.error("Não foi possível enviar. Tente novamente."); return; } toast.success("Mensagem enviada. Nossa equipe entrará em contato."); reset(); }
  return <form onSubmit={handleSubmit(submit)} className="grid gap-5" noValidate><div className="grid gap-5 sm:grid-cols-2"><Field label="Nome" error={errors.name?.message}><input {...register("name")} autoComplete="name" /></Field><Field label="Telefone" error={errors.phone?.message}><input {...register("phone")} autoComplete="tel" /></Field></div><div className="grid gap-5 sm:grid-cols-2"><Field label="E-mail" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" /></Field><Field label="Assunto" error={errors.subject?.message}><input {...register("subject")} /></Field></div><Field label="Mensagem" error={errors.message?.message}><textarea {...register("message")} rows={6} /></Field><button disabled={isSubmitting} className="flex h-13 items-center justify-center gap-3 bg-acid px-6 text-sm font-semibold text-canvas disabled:opacity-50 sm:justify-self-start">{isSubmitting ? "Enviando..." : "Enviar mensagem"}<ArrowRight size={17} /></button></form>;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>> }) { return <label className="block text-xs text-muted"><span className="mb-2 block font-mono text-[10px] uppercase">{label}</span><span className="block [&>input]:h-12 [&>input]:w-full [&>input]:border [&>input]:border-line [&>input]:bg-canvas [&>input]:px-3 [&>textarea]:w-full [&>textarea]:resize-none [&>textarea]:border [&>textarea]:border-line [&>textarea]:bg-canvas [&>textarea]:p-3">{children}</span>{error && <span className="mt-1 block text-signal">{error}</span>}</label>; }
