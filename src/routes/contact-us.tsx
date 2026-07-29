import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  ChevronRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/scroll-reveal";
import { settingsQuery } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { redirectEnquiryToWhatsApp } from "@/lib/whatsapp-redirect";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — Elite Nest Interiors" },
      {
        name: "description",
        content:
          "Get in touch for construction, interior design, renovation, and turnkey project solutions.",
      },
      { property: "og:title", content: "Contact Elite Nest Interiors" },
      {
        property: "og:description",
        content: "Call, WhatsApp, or send us an enquiry — we respond within one business day.",
      },
    ],
  }),
  loader: ({ context }) => { context.queryClient.prefetchQuery(settingsQuery); },
  component: ContactPage,
});

const SERVICES = [
  "Constructions",
  "Building Supervision",
  "Building Architectural Details Services",
  "Renovation",
  "Structural Design",
  "Residential Interior Design",
  "Commercial Interior Design",
  "Turnkey Interior Solution",
  "Walkthroughs Gallery",
];

const BUDGETS = [
  "Below ₹5 Lakhs",
  "₹5 Lakhs – ₹10 Lakhs",
  "₹10 Lakhs – ₹25 Lakhs",
  "₹25 Lakhs – ₹50 Lakhs",
  "Above ₹50 Lakhs",
  "Not Sure Yet",
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z.string().trim().min(6, "Please enter a valid phone").max(25),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  service: z.string().min(1, "Please choose a service"),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

function ContactPage() {
  const { data: s = {} as any } = useQuery(settingsQuery);
  const wa = s.whatsapp?.replace(/\D/g, "") || "919364048269";
  const waHref = `https://wa.me/${wa}?text=${encodeURIComponent("Hi Elite Nest Interiors, I'd like to discuss a project.")}`;

  return (
    <SiteLayout>
      {/* HERO — cinematic gallery */}
      <ContactHero waHref={waHref} />


      {/* CONTACT INFO CARDS */}
      <section className="bg-ivory py-20">
        <div className="container-prose">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <ContactCard
              icon={<Phone className="h-6 w-6" />}
              title="Call Us"
              detail={s.phone || "+91 00000 00000"}
              href={s.phone ? `tel:${s.phone}` : undefined}
            />
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              title="Email"
              detail={s.email || "hello@elitenest.in"}
              href={s.email ? `mailto:${s.email}` : undefined}
            />
            <ContactCard
              icon={<MapPin className="h-6 w-6" />}
              title="Office"
              detail={s.address || "Our studio address"}
            />
            <ContactCard
              icon={<Clock className="h-6 w-6" />}
              title="Hours"
              detail={s.business_hours || "Mon–Sat · 10am – 7pm"}
            />
            <ContactCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="WhatsApp"
              detail="Chat with us"
              href={waHref}
              accent
            />
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section className="bg-gradient-to-b from-ivory to-ivory/60 py-20">
        <div className="container-prose">
          <div className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.3em] text-bronze">Enquiry</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-charcoal">
                Tell Us About Your Project
              </h2>
              <p className="mt-4 text-charcoal/70">
                Share a few details and our project consultant will reach out within one business day with a
                tailored response.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-charcoal/80">
                <li className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-4 w-4 text-bronze" /> Free design consultation</li>
                <li className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-4 w-4 text-bronze" /> Transparent quote within 48 hrs</li>
                <li className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-4 w-4 text-bronze" /> Dedicated project manager</li>
              </ul>
            </Reveal>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-bronze/20 bg-white p-6 md:p-10 shadow-xl shadow-charcoal/5">
                <FullEnquiryForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="bg-charcoal py-20 text-ivory">
        <div className="container-prose">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-bronze">Location</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Visit Our Office</h2>
          </Reveal>
          <div className="mt-8 overflow-hidden rounded-2xl border border-bronze/30">
            <iframe
              title="Office location"
              src={
                s.google_map_url ||
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v0"
              }
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </div>
      </section>

    
    </SiteLayout>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  href,
  accent,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <div
      className={`group h-full rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        accent
          ? "border-bronze bg-gradient-to-br from-bronze/15 to-bronze/5 hover:shadow-bronze/20"
          : "border-charcoal/10 bg-white hover:border-bronze/40 hover:shadow-charcoal/10"
      }`}
    >
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full transition ${
          accent ? "bg-bronze text-charcoal" : "bg-charcoal/5 text-bronze group-hover:bg-bronze group-hover:text-charcoal"
        }`}
      >
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-charcoal/60">{title}</p>
      <p className="mt-2 text-base font-medium text-charcoal break-words whitespace-pre-line">{detail}</p>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}

function SocialBtn({
  href,
  icon,
  label,
}: {
  href?: string | null;
  icon: ReactNode;
  label: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-white px-5 py-3 text-sm text-charcoal transition hover:-translate-y-0.5 hover:border-bronze hover:bg-bronze hover:text-charcoal hover:shadow-lg"
    >
      <span className="text-bronze group-hover:text-charcoal">{icon}</span>
      {label}
    </a>
  );
}

function FullEnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    const details = [
      data.location ? `Location: ${data.location}` : null,
      data.budget ? `Budget: ${data.budget}` : null,
      data.message ? `\n${data.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await supabase.from("enquiries").insert({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        message: details || null,
        service_title: data.service,
        source: "contact-us",
      });
    } catch (err) {
      console.warn("Database insert skipped/failed:", err);
    } finally {
      setSubmitting(false);
    }

    setSuccess(true);
    redirectEnquiryToWhatsApp({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      service: data.service,
      message: details || null,
    });
    reset();
  };

  if (success) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-bronze/15 text-bronze">
          <MessageCircle className="h-7 w-7" />
        </div>
        <h3 className="font-display text-2xl text-charcoal">Thank you!</h3>
        <p className="mt-3 text-charcoal/70">
          Thank you for contacting Elite Nest Interiors. Our team will get back to you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-bronze/40 px-5 py-2 text-sm text-charcoal hover:bg-bronze hover:text-charcoal"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register("name")} className={inputCls} placeholder="Your full name" />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input {...register("phone")} className={inputCls} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <input {...register("email")} className={inputCls} placeholder="you@example.com" />
        </Field>
        <Field label="Service Required" error={errors.service?.message}>
          <select {...register("service")} className={inputCls} defaultValue="">
            <option value="" disabled>Select a service</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Project Location">
          <input {...register("location")} className={inputCls} placeholder="City / Area" />
        </Field>
        <Field label="Budget Range">
          <select {...register("budget")} className={inputCls} defaultValue="">
            <option value="">Select budget</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message / Requirement Details" error={errors.message?.message}>
        <textarea
          {...register("message")}
          rows={4}
          className={inputCls}
          placeholder="Tell us about your space, timeline, and what you have in mind."
        />
      </Field>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-charcoal px-6 py-3.5 text-sm font-medium tracking-wide text-ivory transition hover:bg-bronze hover:text-charcoal disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-charcoal/15 bg-white px-3.5 py-2.5 text-sm text-charcoal outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/20";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-charcoal/70">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}


const CONTACT_HERO_BG =
  "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1920&q=90";

function ContactHero({ waHref }: { waHref: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image — Bengaluru luxury interior */}
      <img
        src={CONTACT_HERO_BG}
        alt="Luxury Bengaluru interior by Elite Nest Interiors"
        className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom"
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/65 to-charcoal/95" />

      <div className="container-prose flex min-h-[82vh] flex-col justify-end pt-32 pb-20 text-ivory">
        {/* Breadcrumb */}
        <Reveal>
          <nav className="text-xs uppercase tracking-[0.22em] text-ivory/70">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span className="px-2 text-accent">/</span>
            <span className="text-ivory">Contact Us</span>
          </nav>
        </Reveal>

        {/* Eyebrow + Heading */}
        <Reveal delay={1}>
          <p className="eyebrow mt-8 text-accent">Get In Touch</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
            Let's Build Something{" "}
            <span className="italic text-accent">That Lasts.</span>
          </h1>
        </Reveal>

        {/* Subtext */}
        <Reveal delay={2}>
          <p className="mt-5 max-w-2xl text-ivory/80 md:text-lg">
            Elite Nest Interiors crafts thoughtfully engineered spaces — from intimate
            residences to signature commercial interiors — delivered with precision across Bengaluru.
          </p>
        </Reveal>

        {/* CTA Buttons */}
        <Reveal delay={3}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquiry" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
              Book a Free Consultation
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          </div>
        </Reveal>

        {/* Stat strip */}
        <Reveal delay={4}>
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ivory/15 pt-6 max-w-md">
            {[
              { k: "120+", v: "Projects Delivered" },
              { k: "15+", v: "Years of Craft" },
              { k: "24hr", v: "Response Time" },
            ].map((stat) => (
              <div key={stat.v}>
                <div className="font-serif text-2xl text-accent">{stat.k}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ivory/60">{stat.v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
