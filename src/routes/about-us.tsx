import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Hammer,
  Home,
  Layers,
  Ruler,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Store,
  Coffee,
  Stethoscope,
  Hospital,
  GraduationCap,
  Compass,
  PenTool,
  ClipboardList,
  PackageCheck,
  Star,
  Users,
  MapPin,
  CheckCircle,
  Timer,
  Wrench,
  XCircle,
  Handshake,
} from "lucide-react";
import { CATEGORY_ORDER, CATEGORY_ICONS } from "@/lib/categories.config";
import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/scroll-reveal";
import { FeaturedServiceListings } from "@/components/featured-service-listings";
import { settingsQuery } from "@/lib/queries";
import heroImg from "@/assets/hero-luxury.jpg";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — Elite Nest Interiors" },
      {
        name: "description",
        content:
          "Elite Nest Interiors — a function-first turnkey interior company creating durable, intelligently planned, world-class spaces at Indian prices.",
      },
      { property: "og:title", content: "About Elite Nest Interiors" },
      {
        property: "og:description",
        content: "World-Class Interiors. Thoughtfully Built.",
      },
    ],
  }),
  loader: ({ context }) => { context.queryClient.prefetchQuery(settingsQuery); },
  component: AboutPage,
});

const philosophy = [
  { Icon: Compass, title: "Function Before Decoration", body: "Every element earns its place through daily usefulness — not just visual appeal." },
  { Icon: Timer, title: "Timeless Over Trendy", body: "We design for a decade of relevance, not a season of applause." },
  { Icon: Sparkles, title: "Smart Cost Optimization", body: "Premium where it matters, disciplined everywhere else." },
  { Icon: Ruler, title: "Precision in Execution", body: "Millimetre-level detailing, dimensionally accurate joinery, consistent finishes." },
  { Icon: ShieldCheck, title: "Durability Matters", body: "Materials and construction chosen to withstand real, everyday use." },
  { Icon: Wrench, title: "Maintenance-Friendly", body: "Surfaces, hardware, and layouts that are easy to clean, service, and live with." },
];

const traditional = [
  "Beautiful designs that lack practicality",
  "Hidden costs and budget overruns",
  "Multiple vendors, multiple headaches",
  "Delays and inconsistent execution",
  "No clear ownership or accountability",
  "Spaces designed for looks, not everyday living",
];

const antigravity = [
  "Function-led designs with timeless aesthetics",
  "Transparent budgets with no hidden surprises",
  "Single-point accountability from start to finish",
  "Structured execution with on-time delivery",
  "Smart sourcing for quality and value",
  "Spaces crafted for real-life comfort and performance",
];

const process = [
  { Icon: Compass, title: "Understand", body: "Deep discovery of lifestyle, workflow and business needs." },
  { Icon: PenTool, title: "Design", body: "Usability-led design with refined aesthetics and clear intent." },
  { Icon: ClipboardList, title: "Plan", body: "Detailed drawings, material strategy and execution planning." },
  { Icon: Hammer, title: "Execute", body: "Precision on-site delivery with disciplined quality checks." },
  { Icon: PackageCheck, title: "Deliver", body: "On-time handover, snag-free, ready to live and work in." },
];

const spaces = CATEGORY_ORDER.map(name => ({
  Icon: CATEGORY_ICONS[name],
  label: name,
}));

const materialPillars = [
  { title: "Contemporary Materials", body: "Modern engineered surfaces engineered for performance and longevity." },
  { title: "Standardized Components", body: "Repeatable, tested systems that keep quality and cost predictable." },
  { title: "Efficient Sourcing", body: "Direct vendor relationships, transparent margins, no hidden markups." },
  { title: "Low-Maintenance Finishes", body: "Wear-resistant, easy-clean surfaces built for daily use." },
  { title: "Structural Durability", body: "Joinery and carcasses built to last well beyond the warranty." },
  { title: "Balanced Premium", body: "Investment placed where it changes daily experience the most." },
];

const trustStats = [
  { k: "100%", v: "Single-point accountability" },
  { k: "On-time", v: "Disciplined delivery" },
  { k: "Pan-India", v: "Turnkey execution" },
  { k: "Concept → Keys", v: "Fully in-house workflow" },
];

const trustPoints = [
  "Accountability at every stage",
  "Disciplined, on-site execution",
  "Realistic timelines, honestly communicated",
  "Transparent pricing and material choices",
  "Balanced aesthetics and cost",
  "Quality control systems, not promises",
  "Precision detailing and finishing",
  "Long-term durability, built-in",
];

function AboutPage() {
  const { data: s = {} as any } = useQuery(settingsQuery);
  const heroBg = s.about_image_url ?? heroImg;

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#0f0e0c] text-ivory">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0e0c]/85 via-[#0f0e0c]/60 to-[#0f0e0c]" />
        </div>
        <div className="container-prose grid gap-12 py-28 md:grid-cols-12 md:py-40">
          <div className="md:col-span-8">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.32em] text-ivory/60">
                ABOUT — ELITE NEST INTERIORS
              </p>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[1.05] text-balance md:text-7xl">
                Design That Performs<br />Beyond Appearance.
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-8 max-w-xl text-ivory/75 md:text-lg">
                We create spaces that are functional, durable, aesthetically refined, and
                intelligently planned — thoughtfully built from concept to completion, at
                Indian prices.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact-us" className="btn-bronze">
                  Start Your Project <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/services" className="btn-ghost-dark">Our Services</Link>
              </div>
            </Reveal>
          </div>
          <div className="hidden md:col-span-4 md:block">
            <Reveal delay={2}>
              <div className="border-l border-ivory/20 pl-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/50">Positioning</p>
                <p className="mt-4 font-serif text-2xl leading-snug text-ivory/90">
                  World-Class Interiors.<br />Thoughtfully Built.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="container-prose py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <Reveal as="div" className="md:col-span-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Why we exist
            </p>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground md:text-5xl">
              A function-first interior company.
            </h2>
          </Reveal>
          <Reveal delay={1} as="div" className="md:col-span-8 md:pt-3">
            <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
              Elite Nest Architects & Interiors is a premier design and execution firm
              dedicated to creating elegant, functional, and inspiring spaces. We specialize
              in residential, commercial, and turnkey interior solutions that reflect our
              clients’ lifestyle, vision, and aspirations.
              <br />
              <br />
              With a passion for innovation and attention to detail, we transform ordinary
              spaces into extraordinary environments through thoughtful planning, modern
              design concepts, and high-quality craftsmanship.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FEATURED SERVICES SCROLLING IMAGES SECTION */}
      <FeaturedServiceListings />

      {/* PHILOSOPHY */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose py-24 md:py-32">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Philosophy</p>
            <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground md:text-5xl">
              Good design should work hard.
            </h2>
            <p className="mt-6 max-w-2xl text-foreground/75 md:text-lg">
              Smart design works better than simply attractive design. Every decision is
              guided by usability, storage efficiency, hygiene, workflow, ease of cleaning
              and structural integrity.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {philosophy.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(((i % 3) + 1) as 1 | 2 | 3)}>
                <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#B88745]/20 bg-[#FFFDF9] p-7 sm:p-8 shadow-[0_4px_20px_rgba(45,32,20,0.03)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#B88745]/60 hover:shadow-[0_20px_40px_-15px_rgba(184,135,69,0.22)]">
                  {/* Top Animated Gold Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B88745] via-[#E9C98A] to-[#B88745] transition-transform duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left" />

                  {/* Corner Accent Glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#B88745]/15 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Radial Background Spotlight */}
                  <div className="absolute -inset-full bg-[radial-gradient(circle_at_top_right,rgba(184,135,69,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Card Header & Content */}
                  <div>
                    <div className="flex items-center justify-between">
                      {/* Icon Badge */}
                      <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-[#F6F0E7] text-[#B88745] border border-[#B88745]/25 transition-all duration-500 group-hover:scale-110 group-hover:bg-[#B88745] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(184,135,69,0.3)] group-hover:rotate-3">
                        <Icon className="h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                      </div>

                      {/* Number Watermark */}
                      <span className="font-serif text-2xl font-light text-[#B88745]/25 transition-all duration-500 group-hover:text-[#B88745]/60 group-hover:scale-115">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 font-serif text-xl font-medium text-[#2D241F] transition-colors duration-300 group-hover:text-[#B88745]">
                      {title}
                    </h3>

                    {/* Expanding Gold Underline */}
                    <div className="mt-3 h-[2px] w-8 rounded-full bg-[#B88745]/30 transition-all duration-500 group-hover:w-16 group-hover:bg-[#B88745]" />

                    {/* Body */}
                    <p className="mt-4 text-sm leading-relaxed text-[#6F6257] transition-colors duration-300 group-hover:text-[#3D332C]">
                      {body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="container-prose py-24 md:py-32">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">The difference</p>
          <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground md:text-5xl">
            Traditional interior firms vs. the Elite Nest approach.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal delay={1}>
            <article className="h-full rounded-2xl border border-border bg-card p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Traditional firms
              </p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Where projects usually fail</h3>
              <ul className="mt-8 space-y-4">
                {traditional.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-foreground/80">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delay={2}>
            <article
              className="h-full rounded-2xl border p-8 text-ivory"
              style={{ background: "#1a1815", borderColor: "color-mix(in oklab, var(--bronze) 40%, transparent)" }}
            >
              <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--gold)" }}>
                Elite Nest
              </p>
              <h3 className="mt-3 font-serif text-2xl">How we deliver differently</h3>
              <ul className="mt-8 space-y-4">
                {antigravity.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-ivory/85">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--gold)" }} />
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose py-24 md:py-32">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Process</p>
            <h2 className="mt-6 max-w-2xl font-serif text-3xl leading-tight text-foreground md:text-5xl">
              Understand. Design. Plan. Execute. Deliver.
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-6 md:grid-cols-5">
            {process.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(((i % 3) + 1) as 1 | 2 | 3)} as="li">
                <div className="relative h-full rounded-xl border border-border bg-card p-6">
                  <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    0{i + 1}
                  </span>
                  <Icon className="mt-4 h-5 w-5" style={{ color: "var(--bronze)" }} />
                  <h3 className="mt-4 font-serif text-lg text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* SPACES */}
      <section className="container-prose py-24 md:py-32">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          {/* Static Left Section */}
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Spaces we build</p>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground md:text-5xl">
              Transforming Residential &amp; Commercial Spaces
            </h2>
            <p className="mt-6 text-foreground/75 md:text-lg">
              From residences to commercial spaces, Elite Nest delivers end-to-end interior solutions—from concept and design to execution and handover, ensuring a seamless experience at every stage.
            </p>
          </div>

          {/* Continuously Sliding Cards Right Section */}
          <div className="md:col-span-7 relative overflow-hidden py-4">
            {/* Edge gradient fades */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-16"
              style={{ background: "linear-gradient(90deg, #FAF7F2 0%, rgba(250,247,242,0) 100%)" }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-16"
              style={{ background: "linear-gradient(270deg, #FAF7F2 0%, rgba(250,247,242,0) 100%)" }}
            />

            <div className="spaces-marquee-track flex gap-4 w-max">
              {[...spaces, ...spaces, ...spaces].map(({ Icon, label }, i) => (
                <div
                  key={`${label}-${i}`}
                  className="group relative flex flex-col justify-between shrink-0 w-[180px] h-[160px] rounded-2xl border border-[#B88745]/20 bg-[#FFFDF9] p-6 shadow-[0_4px_20px_rgba(45,32,20,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B88745]/50 hover:shadow-[0_12px_28px_rgba(184,135,69,0.2)]"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#F6F0E7] text-[#B88745] transition-colors group-hover:bg-[#B88745] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-serif text-base font-medium text-[#2D241F] group-hover:text-[#B88745] transition-colors">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spacesContinuousMarquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-33.333%, 0, 0); }
          }
          .spaces-marquee-track {
            animation: spacesContinuousMarquee 22s linear infinite;
            will-change: transform;
          }
          .spaces-marquee-track:hover {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .spaces-marquee-track {
              animation: none;
            }
          }
        `}</style>
      </section>

      {/* MATERIAL & BUILD */}
      <section className="border-y border-border bg-[#f4f0ea]">
        <div className="container-prose grid gap-14 py-24 md:grid-cols-12 md:py-32">
          <Reveal as="div" className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Material & build</p>
            <h2 className="mt-6 font-serif text-3xl leading-tight text-foreground md:text-5xl">
              Intelligent materials. Honest craftsmanship.
            </h2>
            <p className="mt-6 text-foreground/75 md:text-lg">
              We invest in premium materials where they change daily experience, and optimize
              elsewhere to protect your budget without compromising longevity.
            </p>
          </Reveal>
          <div className="md:col-span-7">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {materialPillars.map(({ title, body }, i) => (
                <Reveal key={title} delay={(((i % 3) + 1) as 1 | 2 | 3)}>
                  <div className="h-full bg-card p-6">
                    <Layers className="h-5 w-5" style={{ color: "var(--bronze)" }} />
                    <h3 className="mt-5 font-serif text-lg text-foreground">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-[#0f0e0c] text-ivory">
        <div className="container-prose py-24 md:py-32">
          <div className="grid gap-14 md:grid-cols-12">
            <Reveal as="div" className="md:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-ivory/60">Trust</p>
              <h2 className="mt-6 font-serif text-3xl leading-tight text-balance md:text-5xl">
                Why clients choose Elite Nest.
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {trustStats.map(({ k, v }) => (
                  <div key={v} className="border-t border-ivory/15 pt-4">
                    <p className="font-serif text-2xl" style={{ color: "var(--gold)" }}>{k}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ivory/60">{v}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={1} className="md:col-span-7">
              <ul className="grid gap-3 sm:grid-cols-2">
                {trustPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 rounded-xl border border-ivory/10 bg-ivory/[0.03] p-5 text-sm text-ivory/85">
                    <Handshake className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--gold)" }} />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="container-prose py-20 md:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[#B98232]/30 bg-gradient-to-br from-[#FFFDF9] via-[#FAF4EA] to-[#F2E5D3] p-10 md:p-16 lg:p-20 shadow-[0_24px_60px_rgba(185,130,50,0.12)] text-center">
            {/* Elegant top accent bar */}
            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#B98232]/20 via-[#B98232] to-[#B98232]/20 mb-8" />

            <div className="mx-auto max-w-3xl">
              <span className="inline-block rounded-full border border-[#B98232]/30 bg-[#B98232]/10 px-4 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.32em] text-[#B98232]">
                Built for real life
              </span>
              <h2 className="mt-6 font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-[#2B211B]">
                Interiors that work better, <span className="text-[#B98232] italic">last longer</span>, and improve every day.
              </h2>
              <p className="mt-6 text-sm md:text-base lg:text-lg leading-relaxed text-[#6F6258] max-w-2xl mx-auto">
                Beautiful in photographs is easy. Beautiful to live and work in — for years — is the standard we build to.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/contact-us"
                  className="inline-flex items-center gap-2 rounded-full bg-[#B98232] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_25px_rgba(185,130,50,0.3)] transition-all duration-300 hover:bg-[#8A6338] hover:shadow-[0_12px_30px_rgba(185,130,50,0.4)] hover:scale-105"
                >
                  Book a Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
