import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Check, Phone, MessagesSquare, PencilRuler, Box, Layers, Factory,
  HardHat, Zap, Sofa, Sparkles, KeyRound, ShieldCheck, ArrowRight,
  UserCheck, Clock, Award, Users, Building2,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import turnkeyHero from "@/assets/turnkey-hero.jpg";
import turnkeyDesign from "@/assets/turnkey-design.jpg";
import turnkeyProduction from "@/assets/turnkey-production.jpg";
import turnkeyExecution from "@/assets/turnkey-execution.jpg";
import turnkeyLiving from "@/assets/turnkey-living.jpg";
import turnkeyKitchen from "@/assets/turnkey-kitchen.jpg";

export const Route = createFileRoute("/services/turnkey-interior-solutions")({
  loader: ({ context }) => {
    try {
      context?.queryClient?.prefetchQuery(settingsQuery);
    } catch (_) {}
  },
  head: () => ({
    meta: [
      { title: "Turnkey Interior Solution in Bengaluru — Elite Nest Interiors" },
      { name: "description", content: "End-to-end turnkey interiors in Bengaluru — design, production, execution, installation and handover under one roof." },
      { property: "og:title", content: "Turnkey Interior Solution — Elite Nest Interiors" },
      { property: "og:description", content: "One team. One vision. Complete interior execution from design to handover." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TurnkeyPage,
});

const included = [
  { Icon: MessagesSquare, title: "Design Consultation", body: "Understanding your lifestyle, brief and budget." },
  { Icon: PencilRuler, title: "Space Planning", body: "Functional layouts that maximise every square foot." },
  { Icon: Box, title: "3D Visualization", body: "Photoreal previews before a single cut is made." },
  { Icon: Layers, title: "Material Selection", body: "Curated finishes, laminates, stones and hardware." },
  { Icon: Factory, title: "Modular Production", body: "In-house production for consistency and quality." },
  { Icon: HardHat, title: "Civil Coordination", body: "Civil work managed by our project team." },
  { Icon: Zap, title: "Electrical Coordination", body: "Points, lighting circuits and load planning." },
  { Icon: Sofa, title: "Furniture Installation", body: "Skilled installation of joinery and furniture." },
  { Icon: Sparkles, title: "Final Styling", body: "Decor, lighting and soft styling to finish." },
  { Icon: KeyRound, title: "Handover", body: "Move-in ready home with clean, complete finishing." },
];

const timeline = [
  "Consultation",
  "Design Presentation",
  "Design Sign-Off",
  "Material Finalization",
  "Production",
  "Site Execution",
  "Installation",
  "Quality Check",
  "Handover",
];

const advantages = [
  { Icon: UserCheck, title: "Single Point Contact", body: "One project manager handling every detail." },
  { Icon: Sparkles, title: "Less Stress", body: "No juggling vendors, contractors or timelines." },
  { Icon: Clock, title: "Better Timeline Control", body: "One team means synced schedules end to end." },
  { Icon: Award, title: "Consistent Design Quality", body: "The same vision from concept to installation." },
  { Icon: Users, title: "Reduced Coordination Issues", body: "No gaps between design, factory and site." },
  { Icon: ShieldCheck, title: "Clear Responsibility", body: "One accountable partner for the whole project." },
  { Icon: Check, title: "Better Finish Quality", body: "Multi-stage QC before your handover day." },
];

const pillars = [
  {
    title: "Design",
    img: turnkeyDesign,
    body: "Concepts, layouts, mood boards and 3D visualization crafted by our in-house design studio.",
  },
  {
    title: "Production",
    img: turnkeyProduction,
    body: "Modular furniture and joinery manufactured in a controlled environment for premium finish and consistency.",
  },
  {
    title: "Execution",
    img: turnkeyExecution,
    body: "On-site civil, electrical, installation and styling handled by one accountable project team.",
  },
];

const bengaluruPoints = [
  "Apartments across Bengaluru's key micro-markets",
  "Villas and gated communities",
  "Independent houses and duplexes",
  "Commercial interiors for offices and retail",
  "Designs tuned to Bengaluru lifestyle and space realities",
];

function TurnkeyPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={turnkeyHero}
          alt="Completed premium Bengaluru turnkey home interior"
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
              <span className="text-ivory">Turnkey Interior Solution</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Design To Handover</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Turnkey Interior Solution
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl font-serif text-xl italic text-accent md:text-2xl">
              One team. One vision. Complete interior execution.
            </p>
            <p className="mt-4 max-w-2xl text-ivory/80 md:text-lg">
              Our turnkey interior solution gives you a smooth end-to-end experience — design,
              planning, material selection, production, execution, installation and final handover,
              all managed under one roof.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
                Start Your Turnkey Project
              </a>
              <a href="#enquire-form" className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                Book Free Consultation
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
            Everything Handled Under One Roof
          </h2>
          <div className="mt-5 h-px w-32 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
          <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
            Turnkey interiors remove the vendor chaos. Instead of chasing carpenters, painters,
            electricians and designers separately, you work with one team that owns the entire
            journey — from the first sketch to the final handover.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/85 md:text-lg">
            One plan, one execution flow, one point of responsibility. That's how we protect your
            timeline, your budget and the design intent — right through to move-in day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-bronze">Plan Your Turnkey Interior</a>
            <Link to="/services" className="btn-ghost-dark">All Services</Link>
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="relative grid grid-cols-2 gap-4">
            <img src={turnkeyLiving} loading="lazy" alt="Living room" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
            <img src={turnkeyKitchen} loading="lazy" alt="Kitchen" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
          </div>
        </Reveal>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">What's included</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Every Step, Covered</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {included.map(({ Icon, title, body }, i) => (
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

      {/* TURNKEY PROCESS TIMELINE */}
      <section className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow text-accent">Turnkey process</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">A Clear 9-Step Journey</h2>
            <p className="mt-4 max-w-2xl text-ivory/75">
              A structured, transparent path from first call to key handover.
            </p>
          </Reveal>
          <div className="relative mt-14">
            <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent md:block" />
            <ol className="grid gap-6 md:grid-cols-3 lg:grid-cols-9">
              {timeline.map((s, i) => (
                <Reveal key={s} delay={(i % 3) as 0 | 1 | 2}>
                  <li className="relative">
                    <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-charcoal font-serif text-sm text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-4 font-serif text-sm text-ivory">{s}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* WHY TURNKEY IS BETTER */}
      <section className="container-prose py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Why turnkey</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Why Turnkey Is Better</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map(({ Icon, title, body }, i) => (
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

      {/* DESIGN + PRODUCTION + EXECUTION */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Three pillars</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Design + Production + Execution
            </h2>
            <p className="mt-4 max-w-2xl text-foreground/80">
              Three connected disciplines, one accountable team — the reason our turnkey projects
              stay on time, on budget and on brief.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {pillars.map(({ title, img, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-luxe">
                  <div className="overflow-hidden">
                    <img src={img} alt={title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl text-foreground">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENGALURU EXPERTISE */}
      <section className="container-prose grid gap-12 py-20 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28">
        <Reveal>
          <p className="eyebrow">Local expertise</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
            Bengaluru Turnkey Expertise
          </h2>
          <p className="mt-6 text-foreground/80 md:text-lg">
            We deliver turnkey interiors across Bengaluru — apartments, villas, independent homes
            and commercial spaces. Every project is shaped by local space realities, ventilation,
            climate, and how Bengaluru families and businesses actually live and work.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bengaluruPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* CTA + ENQUIRY */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="turnkey-interior-solution" />
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Ready for a smooth interior journey from concept to completion?
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              One team. One vision. From the first sketch to the final key handover — Elite Nest
              handles every step of your turnkey interior.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
                Book Free Consultation <ArrowRight className="h-4 w-4" />
              </a>
              {tel && (
                <a href={`tel:${tel}`} className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                  <Phone className="h-4 w-4" /> Talk To Expert
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
                <EnquiryForm source="service:turnkey-interior-solution" serviceTitle="Turnkey Interior Solution" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
