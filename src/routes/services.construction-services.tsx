import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  ArrowRight, Check, Phone, MessageCircle, Building2, Home, Hammer,
  HardHat, ClipboardCheck, Layers, ShieldCheck, Package, Users2,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import heroImg from "@/assets/constructions-hero.jpg";
import blrRccFrame from "@/assets/blr-rcc-frame.jpg";
import blrColumnBeam from "@/assets/blr-column-beam.jpg";
import finishedImg from "@/assets/gallery-blr-facade.png";

export const Route = createFileRoute("/services/construction-services")({
  loader: ({ context }) => {
    try {
      context?.queryClient?.prefetchQuery(settingsQuery);
    } catch (_) {}
  },
  head: () => ({
    meta: [
      { title: "Constructions — Elite Nest Architects & Interiors" },
      { name: "description", content: "End-to-end construction solutions in Bengaluru for homes, villas, and commercial spaces — planning, execution, supervision, and handover with quality and precision." },
      { property: "og:title", content: "Constructions — Elite Nest Architects & Interiors" },
      { property: "og:description", content: "Premium Bengaluru construction services: residential, villa, independent house, and commercial builds." },
    ],
  }),
  component: ConstructionsPage,
});

const offerings = [
  { Icon: Home, title: "Residential Construction", body: "Apartments and family homes built with precision and durability." },
  { Icon: Layers, title: "Villa Construction", body: "Bespoke villas with refined architecture and premium specifications." },
  { Icon: Hammer, title: "Independent House Construction", body: "Custom homes designed around your lifestyle, plot and brief." },
  { Icon: Building2, title: "Commercial Construction", body: "Retail, office and mixed-use buildings engineered for performance." },
  { Icon: HardHat, title: "Civil Work Execution", body: "Structured civil delivery across foundation, structure and finishing." },
  { Icon: Package, title: "Material Planning", body: "Curated sourcing balancing quality, budget and long-term value." },
  { Icon: Users2, title: "Vendor Coordination", body: "Single-point coordination across contractors, vendors and consultants." },
  { Icon: ShieldCheck, title: "Quality Inspection", body: "Stage-wise checks to ensure every milestone meets our standard." },
];

const whyUs = [
  "Bengaluru project experience",
  "Transparent planning",
  "Quality material selection",
  "Skilled execution team",
  "Design-led construction",
  "Regular site updates",
  "Single point coordination",
];

const steps = [
  "Requirement Discussion",
  "Site Visit",
  "Architectural Coordination",
  "Structural Coordination",
  "Budget & Material Planning",
  "Civil Execution",
  "Quality Checks",
  "Final Handover",
];

const showcase = [
  { img: blrRccFrame, tag: "Progress", title: "Bengaluru Construction Site Progress" },
  { img: blrColumnBeam, tag: "Supervision", title: "Bengaluru Structural Site Supervision" },
  { img: finishedImg, tag: "Handover", title: "Bengaluru Finished Home Exterior" },
];

function ConstructionsPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Bengaluru villa under construction"
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
              <span className="text-ivory">Constructions</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Build With Confidence</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">Constructions</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl text-ivory/85 md:text-lg">
              End-to-end construction solutions for homes, villas, and commercial spaces built with quality and precision.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Book a Free Consultation</a>
              <a href="#enquire" className="btn-ghost-dark transition hover:-translate-y-0.5">Discuss Your Project</a>
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
              Construction That Balances Design, Strength &amp; Execution
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
              At Elite Nest, construction is handled with careful planning, technical coordination,
              material quality, and execution discipline. We support projects from initial concept
              to final handover with a strong focus on durability, function, and design clarity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Get a Free Estimate</a>
              <Link to="/services" className="btn-ghost-dark transition hover:-translate-y-0.5">All Services</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative">
              <img
                src={blrRccFrame}
                alt="Premium Bengaluru construction site"
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

      {/* WHAT WE OFFER */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">What we offer</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Construction Services</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="luxe-card h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Our process</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Our Construction Process</h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s} delay={(i % 3) as 0 | 1 | 2}>
                <li className="relative h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-luxe">
                  <span
                    className="font-serif text-3xl"
                    style={{ color: "var(--bronze)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-serif text-lg text-foreground">{s}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Why Elite Nest</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Why Choose Elite Nest
            </h2>
            <p className="mt-6 text-foreground/75">
              Every project is supervised end-to-end with a transparent process so you stay
              informed and confident at every milestone.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {whyUs.map((p) => (
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

      {/* VISUAL SHOWCASE */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Visual showcase</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Moments from our sites</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {showcase.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) as 0 | 1 | 2}>
                <figure className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-luxe">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110"
                    />
                  </div>
                  <figcaption className="p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-accent">{s.tag}</p>
                    <p className="mt-2 font-serif text-lg text-foreground">{s.title}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="constructions" />

      {/* ENQUIRY */}
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Ready to build your dream space?
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Let our team guide your construction project with clarity, quality, and confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze">Book a Free Consultation</a>
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
            <ul className="mt-8 grid gap-3">
              {["Bengaluru-focused expertise", "Transparent quotes", "One-business-day response"].map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                  <ArrowRight className="h-4 w-4" style={{ color: "var(--bronze)" }} /> {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1}>
            <div id="enquire-form" className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Enquire</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Request Construction Consultation</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm
                  source="service:constructions"
                  serviceTitle="Constructions"
                />

              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
