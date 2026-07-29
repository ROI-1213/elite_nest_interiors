import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Check, Phone, MessageCircle, Eye, Users, Package, FileText,
  Hammer, Zap, Droplets, Sparkles, Clock, ClipboardCheck,
  Camera, AlertCircle, CheckCircle2, ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import heroImg from "@/assets/supervision-hero.jpg";

export const Route = createFileRoute("/services/building-supervision")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(settingsQuery);
  },
  head: () => ({
    meta: [
      { title: "Building Supervision — Elite Nest Architects & Interiors" },
      { name: "description", content: "Professional Bengaluru site supervision for quality control, drawing accuracy, contractor coordination, and transparent client reporting." },
      { property: "og:title", content: "Building Supervision — Elite Nest Architects & Interiors" },
      { property: "og:description", content: "Expert site monitoring to ensure your project is executed correctly, safely, and on schedule." },
    ],
  }),
  component: BuildingSupervisionPage,
});

const supervised = [
  { Icon: Eye, title: "Site progress" },
  { Icon: Hammer, title: "Workmanship quality" },
  { Icon: Users, title: "Contractor coordination" },
  { Icon: Package, title: "Material verification" },
  { Icon: FileText, title: "Drawing implementation" },
  { Icon: Zap, title: "Electrical coordination" },
  { Icon: Droplets, title: "Plumbing coordination" },
  { Icon: Sparkles, title: "Finishing quality" },
  { Icon: Clock, title: "Timeline tracking" },
  { Icon: ClipboardCheck, title: "Final inspection" },
];

const steps = [
  "Site Assessment",
  "Drawing Review",
  "Execution Planning",
  "Regular Site Visits",
  "Quality Checks",
  "Issue Reporting",
  "Correction Guidance",
  "Final Review",
];

const reportItems = [
  { Icon: FileText, label: "Site visit notes", value: "Detailed observations after every visit" },
  { Icon: Camera, label: "Photo updates", value: "Timestamped progress imagery" },
  { Icon: AlertCircle, label: "Pending issues", value: "Open items with priority tags" },
  { Icon: CheckCircle2, label: "Completed work", value: "Milestones marked as verified" },
  { Icon: ArrowRight, label: "Next steps", value: "Upcoming actions for site team" },
  { Icon: Package, label: "Material concerns", value: "Quality or quantity flags" },
];

const benefits = [
  "Prevents costly mistakes",
  "Keeps contractors accountable",
  "Improves quality",
  "Reduces delays",
  "Protects design intent",
  "Gives peace of mind",
];

function BuildingSupervisionPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Site engineer supervising Bengaluru construction"
          className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal/90" />
        <div className="container-prose flex min-h-[78vh] flex-col justify-end pt-32 pb-20 text-ivory">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.22em] text-ivory/70">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="px-2 text-accent">/</span>
              <Link to="/services" className="hover:text-accent">Services</Link>
              <span className="px-2 text-accent">/</span>
              <span className="text-ivory">Building Supervision</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Expert Site Monitoring</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">Building Supervision</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl text-ivory/85 md:text-lg">
              Professional site supervision to ensure your project is executed correctly, safely, and on schedule.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Book Site Visit</a>
              <a href="#enquire" className="btn-ghost-dark transition hover:-translate-y-0.5">Talk To Our Expert</a>
              {tel && <a href={`tel:${tel}`} className="btn-ghost-dark transition hover:-translate-y-0.5"><Phone className="h-4 w-4" /> Call Now</a>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="bg-bone">
        <div className="container-prose grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-28">
          <Reveal>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Your Project Needs Expert Eyes On Site
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
              Even the best design requires proper supervision during execution. Our team monitors
              workmanship, material usage, timeline, site coordination, and drawing accuracy to
              reduce errors and protect your investment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Schedule Supervision Visit</a>
              <Link to="/services" className="btn-ghost-dark transition hover:-translate-y-0.5">All Services</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative">
              <img
                src={heroImg}
                alt="Building supervision on site"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-luxe"
              />
              <span
                className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px]"
                style={{ background: "var(--gradient-bronze)", opacity: 0.18, filter: "blur(24px)" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT WE SUPERVISE */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Checklist</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">What We Supervise</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {supervised.map(({ Icon, title }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="luxe-card flex h-full items-start gap-3 p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <p className="mt-1 font-serif text-base text-foreground">{title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Workflow</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Supervision Workflow</h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s} delay={(i % 3) as 0 | 1 | 2}>
                <li className="relative h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-luxe">
                  <span className="font-serif text-3xl" style={{ color: "var(--bronze)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-serif text-lg text-foreground">{s}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* REPORTING DASHBOARD */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Reporting</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Clear Updates. Better Control.
            </h2>
            <p className="mt-5 max-w-2xl text-foreground/75 md:text-lg">
              Every site visit becomes a structured report you can act on — no guesswork, no missed details.
            </p>
          </Reveal>
          <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-luxe md:p-10">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportItems.map(({ Icon, label, value }, i) => (
                <Reveal key={label} delay={(i % 3) as 0 | 1 | 2}>
                  <div className="h-full rounded-2xl border border-border/80 bg-bone/50 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-bronze)" }}>
                        <Icon className="h-4 w-4 text-white" />
                      </span>
                      <p className="text-xs uppercase tracking-[0.2em] text-accent">{label}</p>
                    </div>
                    <p className="mt-4 font-serif text-base text-foreground">{value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Why it matters</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Supervision that protects your project
            </h2>
            <p className="mt-6 text-foreground/75">
              Independent supervision keeps every stakeholder aligned and every rupee accountable.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {benefits.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-sm text-foreground/85">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="building-supervision" />

      {/* ENQUIRY */}
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Need expert supervision for your project?
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Book a site visit and let our team keep your build on quality, on time, and on budget.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze">Schedule Supervision Visit</a>
              {tel && (
                <a href={`tel:${tel}`} className="btn-ghost-dark">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="btn-ghost-dark">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div id="enquire-form" className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Enquire</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Request Building Supervision</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm
                  source="service:building-supervision"
                  serviceTitle="Building Supervision"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
