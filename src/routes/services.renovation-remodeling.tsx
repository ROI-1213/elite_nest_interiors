import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Check, Phone, MessageCircle, Home, Building2, Layers, ChefHat, Bath,
  Briefcase, Grid3x3, Paintbrush, Lightbulb, Sofa,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import heroImg from "@/assets/reno-hero.jpg";
import beforeImg from "@/assets/reno-before.jpg";
import afterImg from "@/assets/reno-after.jpg";

export const Route = createFileRoute("/services/renovation-remodeling")({
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(settingsQuery);
  },
  head: () => ({
    meta: [
      { title: "Renovation — Elite Nest Architects & Interiors" },
      { name: "description", content: "Premium Bengaluru renovation for homes, villas, apartments, kitchens, bathrooms, and offices — refined design, upgraded materials, and modern comfort." },
      { property: "og:title", content: "Renovation — Elite Nest Architects & Interiors" },
      { property: "og:description", content: "Refresh old spaces with refined design, better function, and premium finishes." },
    ],
  }),
  component: RenovationPage,
});

const services = [
  { Icon: Home, title: "Full Home Renovation" },
  { Icon: Building2, title: "Apartment Renovation" },
  { Icon: Layers, title: "Villa Renovation" },
  { Icon: ChefHat, title: "Kitchen Renovation" },
  { Icon: Bath, title: "Bathroom Renovation" },
  { Icon: Briefcase, title: "Office Renovation" },
  { Icon: Grid3x3, title: "Flooring Upgrade" },
  { Icon: Paintbrush, title: "Wall & Paint Upgrade" },
  { Icon: Lightbulb, title: "Lighting Upgrade" },
  { Icon: Sofa, title: "Furniture & Storage Upgrade" },
];

const steps = [
  "Existing Space Study",
  "Requirement Discussion",
  "Design Improvement Plan",
  "Material Selection",
  "Budget Planning",
  "Site Preparation",
  "Execution",
  "Styling & Handover",
];

const improvements = [
  "Space usage",
  "Lighting",
  "Storage",
  "Flooring",
  "Wall finishes",
  "Furniture placement",
  "Comfort",
  "Style consistency",
];

function RenovationPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";
  const tel = settings.phone?.replace(/\s/g, "");
  const [slider, setSlider] = useState(50);

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Renovated Bengaluru villa living room"
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
              <span className="text-ivory">Renovation</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Transform Your Space</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">Renovation</h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl text-ivory/85 md:text-lg">
              Refresh old spaces with refined design, better function, and premium finishes.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Start Renovation Planning</a>
              <a href="#enquire" className="btn-ghost-dark transition hover:-translate-y-0.5">Book Site Visit</a>
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
              Old Space. New Life. Better Function.
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
              Renovation is not just repainting. It is about understanding existing limitations,
              improving layout, upgrading materials, enhancing comfort, and creating a space
              that feels new and meaningful.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Book Renovation Consultation</a>
              <Link to="/services" className="btn-ghost-dark transition hover:-translate-y-0.5">All Services</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative">
              <img
                src={heroImg}
                alt="Renovated Bengaluru interior"
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

      {/* SERVICES */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Renovation services</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">What We Renovate</h2>
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

      {/* BEFORE / AFTER SLIDER */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Before / After</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              See the transformation
            </h2>
            <p className="mt-5 max-w-2xl text-foreground/75 md:text-lg">
              Drag the slider to compare the before and after of a Bengaluru living room renovation.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-luxe">
              <div className="relative aspect-[16/9] w-full select-none">
                <img
                  src={afterImg}
                  alt="After renovation"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${slider}%` }}
                >
                  <img
                    src={beforeImg}
                    alt="Before renovation"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ width: `${100 / (slider / 100)}%`, maxWidth: "none" }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-y-0 z-10 w-0.5"
                  style={{ left: `${slider}%`, background: "var(--gold)" }}
                >
                  <span
                    className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-semibold text-white shadow-luxe"
                    style={{ background: "var(--gradient-bronze)" }}
                  >
                    ⇔
                  </span>
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-ivory">
                  Before
                </span>
                <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white" style={{ background: "var(--gradient-bronze)" }}>
                  After
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={slider}
                  onChange={(e) => setSlider(Number(e.target.value))}
                  aria-label="Compare before and after"
                  className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Our process</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Renovation Process</h2>
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

      {/* WHAT WE IMPROVE */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">What we improve</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Every renovation upgrades the essentials
            </h2>
            <p className="mt-6 text-foreground/75">
              We don't just cover surfaces — we improve how the space works, feels, and looks.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {improvements.map((p) => (
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
      <ExploreMoreServices currentSlug="renovation" />

      {/* ENQUIRY */}
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Give your old space a fresh premium identity.
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Book a consultation and our team will map the fastest path to a beautifully renovated space.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze">Book Renovation Consultation</a>
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
              <h3 className="mt-3 font-serif text-2xl text-foreground">Request Renovation Consultation</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm
                  source="service:renovation"
                  serviceTitle="Renovation"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
