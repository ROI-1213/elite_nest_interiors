import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Home, Building2, Eye, Compass, ShieldCheck, Sparkles, Palette, Layers,
  MessagesSquare, Box, Lightbulb, Camera, Video, CheckCircle, Check,
  Play, Phone, ArrowRight,
} from "lucide-react";
import { CATEGORY_ORDER, CATEGORY_ICONS } from "@/lib/categories.config";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery } from "@/lib/queries";
import walkthroughHero from "@/assets/walkthrough-hero.jpg";
import walkthroughRender1 from "@/assets/walkthrough-render1.jpg";
import walkthroughRender2 from "@/assets/walkthrough-render2.jpg";
import walkthroughCinematic from "@/assets/walkthrough-cinematic.jpg";

export const Route = createFileRoute("/services/3d-walkthrough-gallery")({
  loader: async ({ context }) => {
    try {
      await context?.queryClient?.prefetchQuery(settingsQuery);
    } catch (_) {}
  },
  head: () => ({
    meta: [
      { title: "3D Walkthroughs & Visualization — Elite Nest Interiors" },
      { name: "description", content: "Cinematic 3D walkthroughs and realistic visualization in Bengaluru — see your interiors, materials, lighting and layout before execution." },
      { property: "og:title", content: "3D Walkthroughs & Visualization — Elite Nest Interiors" },
      { property: "og:description", content: "Experience your space before execution begins with cinematic 3D walkthroughs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalkthroughsPage,
});

const services = [
  { Icon: Home, title: "Residential Interior Walkthroughs", body: "Full-home visual tours across living, kitchen, bedrooms and bath." },
  { Icon: Building2, title: "Commercial Walkthroughs", body: "Offices, retail and hospitality visualized before build." },
  { Icon: Compass, title: "Architectural Walkthroughs", body: "Building exteriors, elevations and site context in 3D." },
  { Icon: Box, title: "3D Room Visualizations", body: "Photoreal single-room renders for focused reviews." },
  { Icon: Palette, title: "Material Preview", body: "Compare laminates, stones and finishes on-screen." },
  { Icon: Lightbulb, title: "Lighting Preview", body: "See how ambience shifts by day, evening and night." },
  { Icon: Layers, title: "Furniture Layout Preview", body: "Test placements and circulation before you commit." },
  { Icon: Video, title: "Presentation Videos", body: "Cinematic video renders for sign-offs and sharing." },
];

const benefits = [
  { Icon: Eye, title: "Better Decision-Making", body: "See choices in context before you commit." },
  { Icon: Compass, title: "Clear Design Understanding", body: "Layouts, scale and flow become instantly obvious." },
  { Icon: ShieldCheck, title: "Fewer Changes During Execution", body: "Approvals happen in 3D — not on-site." },
  { Icon: Sparkles, title: "Improved Client Confidence", body: "You feel the space long before it's built." },
  { Icon: Palette, title: "Realistic Material Preview", body: "Textures, colours and finishes in true light." },
  { Icon: Layers, title: "Better Layout Clarity", body: "No more guessing from a 2D floor plan." },
];

const process = [
  { Icon: MessagesSquare, title: "Requirement Study" },
  { Icon: Compass, title: "Layout Review" },
  { Icon: Box, title: "3D Model Creation" },
  { Icon: Lightbulb, title: "Material & Lighting Setup" },
  { Icon: Camera, title: "Camera Path Planning" },
  { Icon: Eye, title: "Preview Review" },
  { Icon: Video, title: "Final Walkthrough Output" },
];

const suitableFor = CATEGORY_ORDER.map(name => ({
  Icon: CATEGORY_ICONS[name],
  title: name,
}));

function WalkthroughsPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const tel = settings.phone?.replace(/\s/g, "");

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={walkthroughHero}
          alt="Cinematic 3D interior walkthrough visualization"
          className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/85 via-charcoal/70 to-charcoal/95" />
        <div className="container-prose flex min-h-[82vh] flex-col justify-end pt-32 pb-20 text-ivory">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.22em] text-ivory/70">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="px-2 text-accent">/</span>
              <Link to="/services" className="hover:text-accent">Services</Link>
              <span className="px-2 text-accent">/</span>
              <span className="text-ivory">Walkthroughs</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">See Before We Build</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Walkthroughs
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl font-serif text-xl italic text-accent md:text-2xl">
              Experience your space before execution begins.
            </p>
            <p className="mt-4 max-w-2xl text-ivory/80 md:text-lg">
              Our walkthroughs let you visualize interiors and architecture through realistic 3D
              views — lighting, materials, furniture placement and movement across the space —
              before a single wall goes up.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
                Request A Walkthrough
              </a>
              <a href="#process" className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                View Visualization Process
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
            Visualize Every Detail Before Execution
          </h2>
          <div className="mt-5 h-px w-32 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
          <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
            Walkthroughs remove the guesswork. Instead of imagining how a layout will feel from a
            2D drawing, you step into a photoreal version of your space, look around, test choices
            and approve with confidence.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/85 md:text-lg">
            The result: fewer changes on-site, faster approvals, cleaner execution and a final
            outcome that matches exactly what you signed off on.
          </p>
        </Reveal>
        <Reveal delay={1}>
          <div className="relative grid grid-cols-2 gap-4">
            <img src={walkthroughRender1} loading="lazy" width={900} height={1200} alt="3D interior living room preview" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
            <img src={walkthroughRender2} loading="lazy" width={900} height={1200} alt="Rendered bedroom visualization" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
          </div>
        </Reveal>
      </section>

      {/* WALKTHROUGH SERVICES */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">What we create</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Walkthrough Services</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="luxe-card h-full p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "var(--gradient-bronze)" }}>
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-5 font-serif text-base text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WALKTHROUGHS HELP */}
      <section className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow text-accent">Why they help</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Why Walkthroughs Help</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
                <div className="h-full rounded-2xl border border-ivory/10 bg-ivory/5 p-6 backdrop-blur transition-transform duration-300 hover:-translate-y-1">
                  <Icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-4 font-serif text-lg text-ivory">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/75">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="container-prose py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">Process</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Walkthrough Creation Process</h2>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          {process.map(({ Icon, title }, i) => (
            <Reveal key={title} delay={(i % 3) as 0 | 1 | 2}>
              <li className="relative h-full rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full font-serif text-xs text-white" style={{ background: "var(--gradient-bronze)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <p className="mt-4 font-serif text-sm text-foreground">{title}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>



      {/* SUITABLE FOR — animated showcase */}
      <section className="relative overflow-hidden bg-charcoal py-24 md:py-32">
        {/* ambient glow blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #B8894D 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #9D7140 0%, transparent 70%)" }} />

        <style>{`
          @keyframes card-rise {
            from { opacity: 0; transform: translateY(32px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes icon-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(184,137,77,0.5); }
            50%       { box-shadow: 0 0 0 10px rgba(184,137,77,0); }
          }
          .fit-card {
            animation: card-rise 0.55s cubic-bezier(0.22,1,0.36,1) both;
          }
          .fit-card:hover .fit-icon {
            animation: icon-pulse 1.2s ease-in-out infinite;
          }
          .fit-card:hover {
            background: linear-gradient(135deg, rgba(184,137,77,0.18) 0%, rgba(184,137,77,0.06) 100%);
            border-color: rgba(184,137,77,0.55);
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(184,137,77,0.3);
          }
        `}</style>

        <div className="container-prose relative">
          {/* heading */}
          <Reveal>
            <p className="eyebrow text-accent">Suitable for</p>
            <h2 className="mt-4 font-serif text-4xl text-balance text-ivory md:text-5xl">
              Where{" "}
              <span className="italic" style={{ background: "linear-gradient(90deg,#D4A96A,#B8894D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Walkthroughs
              </span>{" "}
              Fit
            </h2>
            <p className="mt-4 max-w-xl text-ivory/65">
              From compact apartments to large commercial projects — our 3D walkthroughs work
              across every space type in Bengaluru.
            </p>
          </Reveal>

          {/* animated grid */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suitableFor.map(({ Icon, title }, i) => (
              <div
                key={title}
                className="fit-card group relative cursor-default overflow-hidden rounded-2xl border border-ivory/10 bg-ivory/5 p-6 backdrop-blur transition-all duration-500"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* subtle shimmer line on top */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-center gap-4">
                  {/* icon with pulse ring */}
                  <span
                    className="fit-icon relative grid h-12 w-12 flex-shrink-0 place-items-center rounded-full transition-all duration-500"
                    style={{ background: "linear-gradient(135deg,#B8894D,#9D7140)" }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </span>

                  <span className="font-serif text-base text-ivory transition-colors duration-300 group-hover:text-accent md:text-lg">
                    {title}
                  </span>

                  {/* animated check */}
                  <span className="ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 transition-all duration-300 group-hover:border-accent group-hover:bg-accent/25">
                    <Check className="h-3 w-3 text-accent" />
                  </span>
                </div>

                {/* index number watermark */}
                <span className="absolute right-4 bottom-3 font-serif text-5xl font-bold leading-none text-ivory/[0.04] select-none transition-all duration-500 group-hover:text-ivory/[0.08]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA + ENQUIRY */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="walkthroughs" />
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Want to see your dream space before it is built?
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Cinematic 3D walkthroughs that let you experience layouts, lighting and finishes
              before we execute — for confident decisions and cleaner outcomes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition-transform duration-300 hover:-translate-y-0.5">
                Request Walkthrough <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/contact-us" className="btn-ghost-dark transition-transform duration-300 hover:-translate-y-0.5">
                Book Design Consultation
              </Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div id="enquire-form" className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <p className="eyebrow">Enquire</p>
              <h3 className="mt-3 font-serif text-2xl text-foreground">Tell us about your project</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm source="service:walkthroughs" serviceTitle="Walkthroughs" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
