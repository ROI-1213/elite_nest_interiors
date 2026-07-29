import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Check, Phone, MessageCircle, Layout, Building2, Scissors, PencilRuler,
  DoorOpen, Sofa, Layers, Zap, Package, ClipboardList,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import heroImg from "@/assets/arch-hero.jpg";
import previewFloor from "@/assets/arch-floorplan.jpg";
import previewElevation from "@/assets/arch-elevation.jpg";
import previewSection from "@/assets/arch-section.jpg";
import previewMaterial from "@/assets/arch-material.jpg";

export const Route = createFileRoute("/services/architectural-design-planning")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(settingsQuery);
  },
  head: () => ({
    meta: [
      { title: "Building Architectural Details — Elite Nest Architects & Interiors" },
      { name: "description", content: "Build-ready architectural drawings, working details, and material specifications by Elite Nest — precise documentation that turns concepts into clear execution." },
      { property: "og:title", content: "Building Architectural Details — Elite Nest Architects & Interiors" },
      { property: "og:description", content: "Floor plans, elevations, sections, working drawings, and material specs prepared for site-ready execution." },
    ],
  }),
  component: ArchitecturalDetailsPage,
});

const services = [
  { Icon: Layout, title: "Floor Plans" },
  { Icon: Building2, title: "Elevation Drawings" },
  { Icon: Scissors, title: "Section Drawings" },
  { Icon: PencilRuler, title: "Working Drawings" },
  { Icon: DoorOpen, title: "Door & Window Schedules" },
  { Icon: Sofa, title: "Furniture Layouts" },
  { Icon: Layers, title: "Ceiling Details" },
  { Icon: Zap, title: "Electrical Layout Coordination" },
  { Icon: Package, title: "Material Specifications" },
  { Icon: ClipboardList, title: "Site Execution Notes" },
];

const benefits = [
  "Better contractor clarity",
  "Fewer site mistakes",
  "Accurate measurements",
  "Easier approvals",
  "Better budgeting",
  "Smooth execution",
  "Refined final finish",
];

const steps = [
  "Requirement Study",
  "Site Measurement",
  "Concept Review",
  "Draft Drawings",
  "Design Coordination",
  "Material Notes",
  "Final Working Drawings",
  "Site Handover Support",
];

const previews = [
  { img: previewFloor, tag: "Layout", title: "Floor Plan Preview" },
  { img: previewElevation, tag: "Facade", title: "Elevation Preview" },
  { img: previewSection, tag: "Structure", title: "Section Preview" },
  { img: previewMaterial, tag: "Finishes", title: "Material Board Preview" },
];

function ArchitecturalDetailsPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Architecture studio with floor plans and material samples"
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
              <span className="text-ivory">Building Architectural Details</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Build-Ready Design Details</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Building Architectural Details
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl text-ivory/85 md:text-lg">
              Precise architectural details that turn concepts into clear execution.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Get Architectural Details</a>
              <a href="#enquire" className="btn-ghost-dark transition hover:-translate-y-0.5">Speak To Our Architect</a>
              {tel && <a href={`tel:${tel}`} className="btn-ghost-dark transition hover:-translate-y-0.5"><Phone className="h-4 w-4" /> Call Now</a>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW */}
      <section
        className="relative bg-bone"
        style={{
          backgroundImage:
            "linear-gradient(var(--bronze)/6 1px, transparent 1px), linear-gradient(90deg, var(--bronze)/6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="container-prose grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-28">
          <Reveal>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Details That Make Execution Clear
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
              Architectural details bridge the gap between design vision and site execution. We
              prepare accurate drawings and specifications that help contractors, engineers, and
              site teams execute with clarity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Book Architectural Consultation</a>
              <Link to="/services" className="btn-ghost-dark transition hover:-translate-y-0.5">All Services</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative">
              <img
                src={heroImg}
                alt="Architectural studio detail"
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

      {/* SERVICES INCLUDED */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Services included</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">What We Detail</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map(({ Icon, title }, i) => (
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

      {/* WHY IT MATTERS */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Why it matters</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Why Architectural Details Matter
            </h2>
            <p className="mt-6 text-foreground/75">
              Great detailing removes ambiguity on site — protecting quality, cost, and timeline.
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

      {/* PROCESS */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Process</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Detailing Process</h2>
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

      {/* TECHNICAL PREVIEW */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Technical preview</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Drawings & Boards</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {previews.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) as 0 | 1 | 2}>
                <figure className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-luxe">
                  <div className="aspect-[4/3] overflow-hidden bg-bone">
                    <img
                      src={p.img}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-accent">{p.tag}</p>
                    <p className="mt-2 font-serif text-lg text-foreground">{p.title}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="building-architectural-details" />

      {/* ENQUIRY */}
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Need execution-ready architectural details?
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Share your requirement and our architect will get in touch with a tailored scope.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze">Book Architectural Consultation</a>
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
              <h3 className="mt-3 font-serif text-2xl text-foreground">Request Architectural Details</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm
                  source="service:building-architectural-details"
                  serviceTitle="Building Architectural Details"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
