import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Check, Phone, MessageCircle, Shield, Calculator, Layers,
  Anchor, Columns, Wrench, Network, FileCheck, Building, Home,
  Hammer, HardHat, Factory,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import structuralHero from "@/assets/structural-hero.jpg";
import structuralCoordination from "@/assets/structural-coordination.jpg";
import structuralRcc from "@/assets/structural-rcc.jpg";
import structuralDesk from "@/assets/structural-desk.jpg";

export const Route = createFileRoute("/services/structural-design")({
  loader: async ({ context }) => {
    try {
      await context?.queryClient?.prefetchQuery(settingsQuery);
    } catch (_) {}
  },
  head: () => ({
    meta: [
      { title: "Structural Design Services — Elite Nest Interiors" },
      { name: "description", content: "Safe, accurate and construction-ready structural design — RCC planning, load calculation, foundation, beam, column and slab design." },
      { property: "og:title", content: "Structural Design Services — Elite Nest Interiors" },
      { property: "og:description", content: "Reliable structural design support for safe, stable and construction-ready buildings." },
    ],
  }),
  component: StructuralDesignPage,
});

const included = [
  { Icon: Layers, title: "Structural Planning", body: "Coordinated structural layouts aligned with architecture and site." },
  { Icon: Calculator, title: "Load Calculation Support", body: "Accurate load analysis for safe, efficient structural sizing." },
  { Icon: Network, title: "RCC Structure Design", body: "Reinforced concrete design tailored to your building typology." },
  { Icon: Anchor, title: "Foundation Planning", body: "Foundation strategy based on soil, load and site conditions." },
  { Icon: Columns, title: "Beam, Column & Slab Design", body: "Detailed sizing and reinforcement for primary structural members." },
  { Icon: Shield, title: "Safety-Based Design Approach", body: "Code-compliant designs prioritising long-term safety." },
  { Icon: Wrench, title: "Technical Coordination", body: "Smooth coordination between architect, engineer and site team." },
  { Icon: FileCheck, title: "Construction-Ready Details", body: "Clear, executable drawings for on-site implementation." },
];

const highlights = [
  "Safety-first approach",
  "Practical construction details",
  "Technical coordination",
  "Strong foundation planning",
  "Clear RCC detailing",
  "Execution-ready support",
];

const steps = [
  "Project Understanding",
  "Site/Plan Review",
  "Structural Requirement Study",
  "Foundation Planning",
  "RCC Design Coordination",
  "Beam, Column & Slab Details",
  "Final Construction-Ready Details",
];

const useCases = [
  { Icon: Building, title: "Residential Buildings", body: "Apartments and multi-storey residential structures." },
  { Icon: Factory, title: "Commercial Buildings", body: "Offices, retail and mixed-use commercial projects." },
  { Icon: Home, title: "Villas", body: "Premium villa structures with bespoke planning." },
  { Icon: Home, title: "Independent Houses", body: "Single-family homes designed for safety and longevity." },
  { Icon: Hammer, title: "Renovation Structural Support", body: "Structural review and reinforcement for renovations." },
  { Icon: HardHat, title: "Construction Coordination", body: "On-going structural support during execution." },
];

function StructuralDesignPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={structuralHero}
          alt="Structural design — RCC frame and engineer reviewing blueprints"
          className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom"
        />
        <div
          className="absolute inset-0 -z-10 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/85 via-charcoal/70 to-charcoal/95" />
        <div className="container-prose flex min-h-[78vh] flex-col justify-end pt-32 pb-20 text-ivory">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.22em] text-ivory/70">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="px-2 text-accent">/</span>
              <Link to="/services" className="hover:text-accent">Services</Link>
              <span className="px-2 text-accent">/</span>
              <span className="text-ivory">Structural Design</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Strength Behind Every Space</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Structural Design
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl font-serif text-xl italic text-accent md:text-2xl">
              Safe, stable, and efficient structures planned with engineering precision.
            </p>
            <p className="mt-4 max-w-2xl text-ivory/80 md:text-lg">
              Our structural design support ensures your building is strong, practical, and
              coordinated with architectural and interior requirements.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Consult Our Structural Team</a>
              <a href="#enquire" className="btn-ghost-dark transition hover:-translate-y-0.5">Discuss Your Project</a>
              {tel && <a href={`tel:${tel}`} className="btn-ghost-dark transition hover:-translate-y-0.5"><Phone className="h-4 w-4" /> Call Now</a>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="container-prose grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-28">
        <Reveal>
          <p className="eyebrow">Overview</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            A Beautiful Building Needs A Strong Foundation
          </h2>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
          <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
            Elite Nest Interiors provides structural design support that helps ensure safety, stability,
            accuracy, and construction readiness. Our approach focuses on technical coordination, RCC
            structure planning, foundation details, beam-column-slab design, and practical support for
            execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-bronze">Get Structural Design Support</a>
            <Link to="/services" className="btn-ghost-dark">All Services</Link>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="relative grid grid-cols-2 gap-4">
            <img src={structuralRcc} loading="lazy" alt="RCC column and beam junction" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
            <img src={structuralDesk} loading="lazy" alt="Structural engineer desk with drawings" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
          </div>
        </Reveal>
      </section>

      {/* INCLUDED */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">What's included</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Structural Design Services Included</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {included.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="luxe-card h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNICAL CONFIDENCE — dark */}
      <section className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow text-accent">Technical confidence</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Engineering You Can Build On</h2>
            <p className="mt-6 text-ivory/75">
              Every structural recommendation is grounded in safety codes, practical execution and
              tight coordination between design and site teams.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {highlights.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-xl border border-ivory/10 bg-ivory/5 p-4 backdrop-blur">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-sm text-ivory/90">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="container-prose py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Process</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Structural Design Process</h2>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s} delay={(i % 3) as 0 | 1 | 2}>
              <li className="relative h-full rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full font-serif text-sm text-white" style={{ background: "var(--gradient-bronze)" }}>
                    {i + 1}
                  </span>
                  <Wrench className="h-4 w-4 text-accent" />
                </div>
                <p className="mt-4 font-serif text-base text-foreground">{s}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* USE CASES */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Use cases</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Where We Provide Structural Support</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="luxe-card h-full p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ARCHITECTURE + STRUCTURE COORDINATION */}
      <section className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl shadow-luxe">
              <img
                src={structuralCoordination}
                loading="lazy"
                alt="Architectural floor plan alongside structural RCC drawing"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow">Architecture + Structure</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Design And Engineering, Working Together
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
              A successful project happens when architectural intent and structural engineering
              speak the same language. We coordinate floor plans, elevations and load-bearing
              members so that spaces feel open and beautiful — while the frame beneath them stays
              safe, efficient and buildable on site.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Aligned architectural + structural grids", "Column placements that respect layout", "Load paths matched to space planning", "Fewer clashes during execution"].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-1 grid h-5 w-5 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA + ENQUIRY */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="structural-design" />
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Plan your building with strength and confidence.
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Get safety-first structural planning with technical clarity and construction-ready details.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze">Consult Our Structural Team</a>
              <Link to="/contact-us" className="btn-ghost-dark">Contact Us</Link>
              {wa && (
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="btn-ghost-dark">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Now
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div id="enquire-form" className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Enquire</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Tell us about your project</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm source="service:structural-design" serviceTitle="Structural Design" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
