import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { redirectEnquiryToWhatsApp } from "@/lib/whatsapp-redirect";
import { submitEnquiryServerFn } from "@/lib/server-functions";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(6, "Please enter a valid phone").max(25),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export function EnquiryForm({
  serviceId,
  serviceTitle,
  source = "website",
  compact = false,
}: {
  serviceId?: string;
  serviceTitle?: string;
  source?: string;
  compact?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await submitEnquiryServerFn({
        data: {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || null,
          message: data.message?.trim() || null,
          service_id: serviceId ?? null,
          service_title: serviceTitle ?? null,
          source,
        }
      });
    } catch (err) {
      console.warn("Backend database insert failed:", err);
    } finally {
      setSubmitting(false);
    }

    toast.success("Thanks! We'll get in touch shortly.");
    redirectEnquiryToWhatsApp({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      service: serviceTitle ?? null,
      message: data.message?.trim() || null,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/80">Full name</label>
          <input
            {...register("name")}
            placeholder="Your name"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/80">Phone</label>
          <input
            {...register("phone")}
            placeholder="+91 98765 43210"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/80">Email (optional)</label>
        <input
          {...register("email")}
          placeholder="you@example.com"
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/80">Tell us about your project</label>
        <textarea
          {...register("message")}
          rows={compact ? 3 : 4}
          placeholder={
            serviceTitle
              ? `Interested in: ${serviceTitle}. Tell us about your space, timeline, budget…`
              : "Tell us about your space, timeline, and what you have in mind."
          }
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Request a callback"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        We respect your privacy. No spam — ever.
      </p>
    </form>
  );
}
