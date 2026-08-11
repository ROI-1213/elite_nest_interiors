import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  BriefcaseBusiness, Store, Building2, Hospital, Coffee, DoorOpen, Monitor,
  Presentation, LayoutGrid, Maximize, Award, Users, Package, Lightbulb,
  Sparkles, CheckCircle, Check, ArrowRight, Phone,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import commercialHero from "@/assets/commercial-hero.jpg";
import blrReception from "@/assets/blr-reception.jpg";
import blrShowroom from "@/assets/blr-showroom.jpg";
import blrCafe from "@/assets/blr-cafe.jpg";
import commercialClinic from "@/assets/commercial-clinic.jpg";

export const Route = createFileRoute("/services/commercial-interior-design")({
  loader: async ({ context }) => {
    try {
      await context?.queryClient?.prefetchQuery(settingsQuery);
    } catch (_) {}
  },
  head: () => ({
    meta: [
      { title: "Commercial Interior Design in Bengaluru — Elite Nest Interiors" },
      { name: "description", content: "Premium commercial interior design in Bengaluru — offices, retail, clinics, cafés, showrooms and workspaces built for productivity, branding, and customer experience." },
      { property: "og:title", content: "Commercial Interior Design in Bengaluru — Elite Nest Interiors" },
      { property: "og:description", content: "Business-focused commercial interiors designed for productivity, branding and long-term durability." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommercialInteriorPage,
});

const spaces = [
  { Icon: BriefcaseBusiness, title: "Offices", body: "Focused, professional workplaces that support your team every day." },
  { Icon: Store, title: "Retail Stores", body: "Conversion-driven retail interiors that guide customers to your product." },
  { Icon: Building2, title: "Showrooms", body: "Curated zoning, lighting and finishes that present products beautifully." },
  { Icon: Hospital, title: "Clinics & Hospitals", body: "Calm, hygienic clinical spaces designed around patient comfort." },
  { Icon: Coffee, title: "Cafés & Restaurants", body: "Warm, characterful F&B interiors that turn visitors into regulars." },
  { Icon: DoorOpen, title: "Reception Areas", body: "First-impression zones that reinforce brand and welcome guests." },
  { Icon: Monitor, title: "Workspaces", body: "Ergonomic, well-zoned workstations built for real workflows." },
  { Icon: Presentation, title: "Conference Rooms", body: "Acoustically-tuned, meeting-ready rooms with premium finishes." },
  { Icon: LayoutGrid, title: "Display Areas", body: "Product display zones with focused lighting and clear sightlines." },
];

const focus = [
  { Icon: Maximize, title: "Space Efficiency", body: "Every square foot planned for real business use." },
  { Icon: Award, title: "Brand Alignment", body: "Interiors that reflect your brand tone, colours, and values." },
  { Icon: Users, title: "Customer Flow", body: "Clear circulation designed around customer journey." },
  { Icon: BriefcaseBusiness, title: "Employee Productivity", body: "Ergonomic layouts that support focus and collaboration." },
  { Icon: Package, title: "Durable Materials", body: "Commercial-grade finishes built to handle daily use." },
  { Icon: Lightbulb, title: "Lighting", body: "Layered lighting for ambience, task, and product focus." },
  { Icon: LayoutGrid, title: "Storage", body: "Smart, integrated storage that keeps spaces clean." },
  { Icon: Sparkles, title: "Maintenance-Friendly", body: "Materials and detailing chosen for easy upkeep." },
];

const steps = [
  "Business Requirement Study",
  "Site Visit",
  "Brand & Space Planning",
  "Concept Design",
  "3D Visualization",
  "Material Selection",
  "Execution Planning",
  "Installation & Handover",
];

const bengaluruPoints = [
  "Offices across Bengaluru tech corridors",
  "Startups and growing teams",
  "Retail outlets and high-street stores",
  "Clinics and healthcare spaces",
  "Commercial buildings and mixed-use",
  "Compact spaces made to feel spacious",
  "Premium customer-facing interiors",
];

const showcase = [
  { title: "Office", img: blrReception },
  { title: "Showroom", img: blrShowroom },
  { title: "Café", img: blrCafe },
  { title: "Clinic", img: commercialClinic },
];

function CommercialInteriorPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={commercialHero}
          alt="Premium Bengaluru commercial reception interior"
          className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/65 to-charcoal/95" />
        <div className="container-prose flex min-h-[82vh] flex-col justify-end pt-32 pb-20 text-ivory">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.22em] text-ivory/70">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="px-2 text-accent">/</span>
              <Link to="/services" className="hover:text-accent">Services</Link>
              <span className="px-2 text-accent">/</span>
              <span className="text-ivory">Commercial Interior Design</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Spaces That Support Business</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Commercial Interior Design
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl font-serif text-xl italic text-accent md:text-2xl">
              Professional interiors designed for productivity, branding, and customer experience.
            </p>
            <p className="mt-4 max-w-2xl text-ivory/80 md:text-lg">
              We design commercial spaces that balance function, brand identity, workflow,
              durability, and visual impact for modern businesses in Bengaluru.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
                Discuss Your Commercial Project
              </a>
              <a href="#enquire-form" className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                Book Consultation
              </a>
              {tel && (
                <a href={`tel:${tel}`} className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="container-prose grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-28">
        <Reveal>
          <p className="eyebrow">Overview</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Commercial Spaces That Work Beautifully
          </h2>
          <div className="mt-5 h-px w-32 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
          <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
            A commercial interior has to do more than look good — it must support real business
            goals. Every layout we plan considers employee experience, customer movement, brand
            image, operational flow, and long-term maintenance.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/85 md:text-lg">
            From compact clinics to flagship showrooms, we craft spaces that feel premium on day
            one and stay functional for years. Materials, lighting, storage, and finishes are all
            selected for durability and daily commercial use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-bronze">Plan Your Commercial Interior</a>
            <Link to="/services" className="btn-ghost-dark">All Services</Link>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="relative grid grid-cols-2 gap-4">
            <img src={blrShowroom} loading="lazy" alt="Showroom" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
            <img src={blrReception} loading="lazy" alt="Workstations" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
          </div>
        </Reveal>
      </section>

      {/* SPACES WE DESIGN */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Categories</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Commercial Spaces We Design</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="luxe-card h-full p-7 transition-transform duration-300 hover:-translate-y-1">
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

      {/* WHAT WE FOCUS ON */}
      <section className="container-prose py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Design priorities</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">What We Focus On</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {focus.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
              <div className="luxe-card h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-serif text-base text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow text-accent">Process</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Our Commercial Design Process</h2>
            <p className="mt-4 max-w-2xl text-ivory/75">
              A clear, business-focused path from first requirement to final handover.
            </p>
          </Reveal>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={s} delay={(i % 3) as 0 | 1 | 2}>
                <li className="relative h-full rounded-2xl border border-ivory/10 bg-ivory/5 p-5 backdrop-blur">
                  <span className="font-serif text-2xl text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-serif text-base text-ivory">{s}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* BENGALURU */}
      <section className="container-prose grid gap-12 py-20 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28">
        <Reveal>
          <p className="eyebrow">Local expertise</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Bengaluru Business Interiors
          </h2>
          <p className="mt-6 text-foreground/80 md:text-lg">
            We work with businesses across Bengaluru — from startups in Koramangala and Indiranagar
            to retail brands, clinics, and commercial towers on the ORR. Every project is planned
            around local space realities, footfall patterns and premium customer expectations.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bengaluruPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                  <Check className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* VISUAL SHOWCASE */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Visual showcase</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Commercial Interiors We've Shaped
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {showcase.map(({ title, img }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="group relative overflow-hidden rounded-2xl shadow-luxe">
                  <img src={img} alt={title} className="h-72 w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-serif text-lg text-ivory">{title}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + ENQUIRY */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="commercial-interior-design" />
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Create a commercial space that reflects your brand and supports your business.
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Offices, retail, clinics, cafés and showrooms — brand-aligned interiors designed for
              productivity, customer experience and long-term durability.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
                Book Commercial Interior Consultation <ArrowRight className="h-4 w-4" />
              </a>
              {tel && (
                <a href={`tel:${tel}`} className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div id="enquire-form" className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Enquire</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Tell us about your business space</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm
                  source="service:commercial-interior-design"
                  serviceTitle="Commercial Interior Design"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
