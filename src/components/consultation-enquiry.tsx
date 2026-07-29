import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { redirectEnquiryToWhatsApp } from "@/lib/whatsapp-redirect";
import { Reveal } from "@/components/scroll-reveal";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(6, "Please enter a valid mobile number").max(25),
  location: z.string().trim().min(2, "Please enter your location or pincode").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  serviceType: z.string().min(1, "Please select a service type"),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  whatsapp: z.boolean(),
});
type FormData = z.infer<typeof schema>;

const SERVICE_TYPES = [
  "Residential Interiors",
  "Commercial Interiors",
  "Turnkey Interiors",
  "Renovation",
  "Design + Execution",
];

export function ConsultationEnquiry() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { whatsapp: true },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const composedMessage = [
      `Location / Pincode: ${data.location}`,
      `Service Type: ${data.serviceType}`,
      `WhatsApp updates: ${data.whatsapp ? "Yes" : "No"}`,
      data.message ? `\nRequirement: ${data.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await supabase.from("enquiries").insert({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        message: composedMessage,
        service_title: data.serviceType,
        source: "homepage-consultation",
      });
    } catch (err) {
      console.warn("Database insert skipped/failed:", err);
    } finally {
      setSubmitting(false);
    }

    toast.success("Thank you! Our interior design expert will contact you shortly.");
    redirectEnquiryToWhatsApp({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      service: data.serviceType,
      message: composedMessage,
    });
    reset({ whatsapp: true });
  };

  const inputCls =
    "w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 outline-none transition focus:border-[#F3D9A6] focus:bg-white/15 focus:ring-2 focus:ring-[#F3D9A6]/30";

  return (
    <section className="container-prose py-16 md:py-24">
      <Reveal>
        <div
          className="relative overflow-hidden rounded-[28px] p-6 shadow-[0_30px_80px_-40px_rgba(120,80,30,0.55)] md:p-10 lg:p-14"
          style={{
            background:
              "linear-gradient(135deg, #6E4A24 0%, #8A6338 35%, #B88745 70%, #D8B37A 100%)",
          }}
        >
          {/* soft texture / glow */}
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(closest-side, #F3D9A6, transparent)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(closest-side, #FFFCF7, transparent)" }}
          />

          <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/85 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> Free Consultation
              </span>
              <h2 className="mt-5 font-serif text-3xl leading-tight text-white md:text-4xl lg:text-[42px]">
                Looking For Expert Guidance To Design Your{" "}
                <span style={{ color: "#F3D9A6" }}>Dream Space?</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 md:text-[15px]">
                Share your requirements and our interior design team will help you plan a
                beautiful, functional, and personalized space.
              </p>
            </div>

            {/* Right — form */}
            <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <input {...register("name")} placeholder="Enter your name" className={inputCls} />
                  {errors.name && <p className="mt-1 text-xs text-[#FFE1B4]">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    {...register("phone")}
                    placeholder="+91 Enter mobile number"
                    className={inputCls}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-[#FFE1B4]">{errors.phone.message}</p>}
                </div>
                <div>
                  <input
                    {...register("location")}
                    placeholder="Enter your location / pincode"
                    className={inputCls}
                  />
                  {errors.location && (
                    <p className="mt-1 text-xs text-[#FFE1B4]">{errors.location.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("email")}
                    placeholder="Enter your email"
                    className={inputCls}
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#FFE1B4]">{errors.email.message}</p>}
                </div>
                <div>
                  <select
                    {...register("serviceType")}
                    defaultValue=""
                    className={`${inputCls} appearance-none pr-10`}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1L6 6L11 1' stroke='%23FFFFFF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                    }}
                  >
                    <option value="" disabled className="text-charcoal">
                      Select service type
                    </option>
                    {SERVICE_TYPES.map((s) => (
                      <option key={s} value={s} className="text-charcoal">
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.serviceType && (
                    <p className="mt-1 text-xs text-[#FFE1B4]">{errors.serviceType.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register("message")}
                    placeholder="Tell us about your space"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* WhatsApp toggle */}
              <label className="mt-5 inline-flex cursor-pointer items-center gap-3 text-sm text-white/90">
                <span className="relative inline-block">
                  <input
                    type="checkbox"
                    {...register("whatsapp")}
                    className="peer sr-only"
                  />
                  <span className="block h-5 w-9 rounded-full bg-white/25 transition peer-checked:bg-[#25D366]" />
                  <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                </span>
                Update me on WhatsApp
              </label>

              <p className="mt-4 text-[11px] leading-relaxed text-white/70">
                By submitting this form, you agree to be contacted by Elite Nest Architects &
                Interiors regarding your interior design requirement through call, WhatsApp, SMS,
                or email.
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-2 rounded-full bg-[#F3D9A6] px-6 py-3 text-sm font-semibold text-[#3A2814] shadow-[0_10px_30px_-10px_rgba(243,217,166,0.9)] transition hover:brightness-105 hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Book a Free Consultation"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
