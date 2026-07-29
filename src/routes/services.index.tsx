import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  HardHat,
  Hammer,
  Home,
  Layers,
  Lightbulb,
  PencilRuler,
  PlayCircle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Store,
  Timer,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/scroll-reveal";
import heroImg from "@/assets/hero-luxury.jpg";
import imgConstructions from "@/assets/service-constructions.jpg";
import imgSupervision from "@/assets/service-supervision.jpg";
import imgArchitectural from "@/assets/service-architectural.jpg";
import imgRenovation from "@/assets/service-renovation.jpg";
import imgStructural from "@/assets/service-structural.jpg";
import imgResidential from "@/assets/service-residential.jpg";
import imgCommercial from "@/assets/service-commercial.jpg";
import imgTurnkey from "@/assets/service-turnkey.png";
import imgWalkthroughs from "@/assets/service-walkthroughs.jpg";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Our Services — Elite Nest Interiors" },
      {
        name: "description",
        content:
          "Complete construction, supervision, architecture, renovation, structural design, interiors, and turnkey solutions under one roof.",
      },
      { property: "og:title", content: "Our Services — Elite Nest Interiors" },
      {
        property: "og:description",
        content:
          "Premium design-build services: construction, renovation, architecture, interiors and turnkey delivery.",
      },
    ],
  }),
  component: ServicesPage,
});

type ServiceCard = {
  to: ServicePath;
  slug: string;
  title: string;
  Icon: typeof Home;
  image: string;
  description: string;
  points: string[];
};

type ServicePath =
  | "/services/turnkey-interior-solutions"
  | "/services/residential-interior-design"
  | "/services/commercial-interior-design"
  | "/services/renovation-remodeling"
  | "/services/construction-services"
  | "/services/architectural-design-planning"
  | "/services/structural-design"
  | "/services/building-supervision"
  | "/services/3d-walkthrough-gallery";

const servicesList: ServiceCard[] = [
  {
    to: "/services/turnkey-interior-solutions",
    slug: "turnkey-interior-solutions",
    title: "Turnkey Interior Solutions",
    Icon: Layers,
    image: imgTurnkey,
    description:
      "A single point of accountability — from first sketch to the final handover of a styled, ready-to-use space.",
    points: [
      "Design planning",
      "Material selection",
      "Civil, carpentry, electrical, plumbing",
      "Final handover",
    ],
  },
  {
    to: "/services/residential-interior-design",
    slug: "residential-interior-design",
    title: "Residential Interior Design",
    Icon: Home,
    image: imgResidential,
    description:
      "Interiors crafted around how you live — warm, functional, and finished to a high standard.",
    points: ["Living rooms", "Bedrooms", "Modular kitchens", "Wardrobes and ceilings"],
  },
  {
    to: "/services/commercial-interior-design",
    slug: "commercial-interior-design",
    title: "Commercial Interior Design",
    Icon: Store,
    image: imgCommercial,
    description:
      "Workspaces and retail interiors that reflect your brand and elevate the customer experience.",
    points: ["Offices", "Showrooms", "Retail spaces", "Reception and workstation planning"],
  },
  {
    to: "/services/renovation-remodeling",
    slug: "renovation-remodeling",
    title: "Renovation & Remodeling",
    Icon: Wrench,
    image: imgRenovation,
    description:
      "Thoughtful refurbishments that refresh, reconfigure, and upgrade existing residential and commercial spaces.",
    points: [
      "Home renovation",
      "Office renovation",
      "Kitchen and bathroom upgrades",
      "Full property makeover",
    ],
  },
  {
    to: "/services/construction-services",
    slug: "construction-services",
    title: "Construction Services",
    Icon: Building2,
    image: imgConstructions,
    description:
      "Ground-up construction for homes and businesses, executed with quality materials and disciplined site management.",
    points: [
      "Residential buildings",
      "Commercial buildings",
      "Villas and independent houses",
      "Site execution and handover",
    ],
  },
  {
    to: "/services/architectural-design-planning",
    slug: "architectural-design-planning",
    title: "Architectural Design & Planning",
    Icon: PencilRuler,
    image: imgArchitectural,
    description:
      "Detailed planning and drawings that translate your brief into a buildable, beautiful design.",
    points: ["Floor plans", "Elevations", "Working drawings", "2D/3D planning support"],
  },
  {
    to: "/services/structural-design",
    slug: "structural-design",
    title: "Structural Design",
    Icon: Ruler,
    image: imgStructural,
    description:
      "Engineering-led structural design focused on safety, longevity, and cost-efficient construction.",
    points: [
      "RCC planning",
      "Foundation details",
      "Beam, column, slab design",
      "Safety-focused structural support",
    ],
  },
  {
    to: "/services/building-supervision",
    slug: "building-supervision",
    title: "Building Supervision",
    Icon: HardHat,
    image: imgSupervision,
    description:
      "Independent, on-site supervision to keep your project on quality, on schedule, and on budget.",
    points: ["Site inspection", "Contractor coordination", "Quality checks", "Timeline monitoring"],
  },
  {
    to: "/services/3d-walkthrough-gallery",
    slug: "3d-walkthrough-gallery",
    title: "3D Walkthrough Gallery",
    Icon: PlayCircle,
    image: imgWalkthroughs,
    description:
      "Experience our projects in motion — 3D walkthroughs, previews, and real before-after transformations.",
    points: [
      "3D walkthroughs",
      "Project previews",
      "Before-after transformations",
      "Video gallery",
    ],
  },
];

const processSteps = [
  { Icon: ClipboardCheck, title: "Understand Requirement", body: "Brief, scope and budget alignment." },
  { Icon: Compass, title: "Site Visit", body: "On-site survey and feasibility study." },
  { Icon: PencilRuler, title: "Design & Planning", body: "Layouts, 3Ds and specifications." },
  { Icon: Wallet, title: "Estimate & Approval", body: "Detailed costing and sign-off." },
  { Icon: Hammer, title: "Execution", body: "Skilled teams, supervised delivery." },
  { Icon: CheckCircle2, title: "Final Handover", body: "Quality checks and snag-free handover." },
];

const whyChoose = [
  { Icon: Layers, label: "Complete project handling" },
  { Icon: Users, label: "Experienced team" },
  { Icon: ShieldCheck, label: "Transparent communication" },
  { Icon: Sparkles, label: "Modern approach" },
  { Icon: Hammer, label: "Quality materials" },
  { Icon: Timer, label: "Timely execution" },
  { Icon: Lightbulb, label: "Custom solutions" },
  { Icon: Wallet, label: "Budget-conscious planning" },
];

function ServicesPage() {
  return (
    <SiteLayout>
      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="h-full w-full animate-hero-zoom object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/85 via-charcoal/70 to-charcoal/95" />
        </div>
        <div className="container-prose py-28 md:py-40">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.22em] text-ivory/60">
              <Link to="/" className="hover:text-ivory">Home</Link>
              <span className="mx-2">/</span>
              <span style={{ color: "var(--gold)" }}>Services</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-tight text-balance md:text-7xl">
              Our Services
            </h1>
            <span
              className="mt-6 block h-px w-24"
              style={{ background: "var(--gradient-bronze)" }}
            />
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-6 max-w-2xl text-ivory/75 md:text-lg">
              Complete construction, supervision, architecture, renovation, structural design,
              interiors, and turnkey solutions under one roof.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Intro */}
      <section className="container-prose py-20 text-center md:py-24">
        <Reveal>
          <p className="eyebrow">What we offer</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl text-foreground md:text-5xl">
            End-to-End Solutions for Every Space
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/75 md:text-lg">
            Elite Nest Interiors provides complete services for clients planning to build,
            renovate, design, or transform residential and commercial spaces. From construction
            and architectural detailing to interiors and turnkey project execution, our team
            focuses on quality, functionality, and professional delivery.
          </p>
        </Reveal>
      </section>

      {/* 3. Services Grid */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose py-20 md:py-28">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {servicesList.map((s, i) => (
              <Reveal key={s.slug} delay={(((i % 3) + 1) as 1 | 2 | 3)}>
                <Link
                  to={s.to}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-luxe focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                  aria-label={`View full details for ${s.title}`}
                >
                  <span
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      padding: "1px",
                      background: "var(--gradient-bronze)",
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />
                  <div className="relative aspect-[5/3] overflow-hidden bg-charcoal/90">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition duration-[1200ms] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                    <span
                      className="absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-xl"
                      style={{ background: "var(--gradient-bronze)" }}
                    >
                      <s.Icon className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-serif text-2xl text-foreground">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                    <ul className="mt-5 grid gap-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{ color: "var(--bronze)" }}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                      View Details
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Process */}
      <section className="container-prose py-20 md:py-28">
        <Reveal>
          <p className="eyebrow text-center">Our process</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-serif text-3xl text-foreground md:text-5xl">
            How We Deliver Every Service
          </h2>
        </Reveal>
        <div className="relative mt-14">
          <span
            className="absolute left-0 right-0 top-7 hidden h-px md:block"
            style={{ background: "var(--gradient-bronze)", opacity: 0.4 }}
          />
          <ol className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={(((i % 3) + 1) as 1 | 2 | 3)}>
                <li className="relative text-center">
                  <span
                    className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full bg-card text-sm font-semibold ring-1 ring-border"
                    style={{ color: "var(--bronze)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-5 flex justify-center">
                    <step.Icon className="h-5 w-5" style={{ color: "var(--bronze)" }} />
                  </div>
                  <h3 className="mt-3 font-serif text-lg text-foreground">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Why Choose */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose py-20 md:py-28">
          <Reveal>
            <p className="eyebrow text-center">The Elite Nest advantage</p>
            <h2 className="mt-4 text-center font-serif text-3xl text-foreground md:text-5xl">
              Why Choose Our Services
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyChoose.map(({ Icon, label }, i) => (
              <Reveal key={label} delay={(((i % 3) + 1) as 1 | 2 | 3)}>
                <article className="luxe-card flex h-full items-start gap-4 p-6">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ background: "var(--gradient-bronze)" }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <p className="font-serif text-lg leading-snug text-foreground">{label}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="container-prose py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-charcoal p-12 text-center text-ivory shadow-luxe md:p-16">
            <span
              className="absolute inset-x-16 top-0 h-px"
              style={{ background: "var(--gradient-bronze)" }}
            />
            <p className="eyebrow" style={{ color: "var(--gold)" }}>Need guidance?</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl">
              Not sure which service you need?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-ivory/75 md:text-lg">
              Speak with Elite Nest Interiors and get professional guidance for your
              construction, renovation, or interior project.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact-us" className="btn-bronze">
                Get a Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact-us"
                className="rounded-full border border-ivory/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:border-ivory hover:bg-ivory/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
