import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_SETTINGS = { whatsapp: "", phone: "" };
import {
  Check, Phone, MessageCircle, Sofa, BedDouble, ChefHat, Shirt,
  Lightbulb, Layers, Sparkles, Palette, Home, ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { ServiceBottomCTA } from "@/components/service-bottom-cta";
import { ExploreMoreServices } from "@/components/explore-more-services";
import { settingsQuery, galleryQuery } from "@/lib/queries";
import residentialHero from "@/assets/residential-hero.jpg";
import residentialBedroom from "@/assets/residential-bedroom.jpg";
import residentialKitchen from "@/assets/residential-kitchen.jpg";
import blrLivingDining from "@/assets/blr-living-dining.jpg";
import blrBedroom from "@/assets/blr-bedroom.jpg";
import blrKitchen from "@/assets/blr-kitchen.jpg";
import blrWardrobe from "@/assets/blr-wardrobe.jpg";
import blrCeiling from "@/assets/blr-ceiling.jpg";
import blrDining from "@/assets/blr-dining.jpg";

export const Route = createFileRoute("/services/residential-interior-design")({
  loader: async ({ context }) => {
    try {
      await Promise.all([
        context.queryClient.prefetchQuery(settingsQuery),
        context.queryClient.prefetchQuery(galleryQuery()),
      ]);
    } catch (_) {}
  },
  head: () => ({
    meta: [
      { title: "Residential Interior Design — Elite Nest Interiors" },
      { name: "description", content: "Luxury and functional home interiors — living rooms, bedrooms, modular kitchens, wardrobes, false ceilings, lighting and bespoke furniture." },
      { property: "og:title", content: "Residential Interior Design — Elite Nest Interiors" },
      { property: "og:description", content: "Beautiful, functional and personalised interiors for modern homes." },
    ],
  }),
  component: ResidentialInteriorPage,
});

const services = [
  { Icon: Sofa, title: "Living Room Interiors", body: "Elegant, welcoming living spaces designed around comfort and conversation." },
  { Icon: BedDouble, title: "Bedroom Interiors", body: "Restful, refined bedrooms with bespoke storage and warm lighting." },
  { Icon: ChefHat, title: "Modular Kitchen Design", body: "Smart, ergonomic modular kitchens with premium finishes." },
  { Icon: Shirt, title: "Wardrobe Design", body: "Custom wardrobes engineered for organization and aesthetic." },
  { Icon: Layers, title: "False Ceiling Design", body: "Architectural ceilings that elevate every room." },
  { Icon: Lightbulb, title: "Lighting Planning", body: "Layered lighting that sets mood and highlights design." },
  { Icon: Sparkles, title: "Space-Saving Furniture", body: "Tailored furniture that maximises every square foot." },
  { Icon: Palette, title: "Premium Material Selection", body: "Curated materials, finishes and palettes for lasting quality." },
  { Icon: Home, title: "Modern & Functional Concepts", body: "Contemporary design that works beautifully in everyday life." },
];

const rooms = [
  {
    key: "living",
    label: "Living Room",
    img: blrLivingDining,
    desc: "Inviting Bengaluru living rooms styled around your lifestyle, with refined materials and layered lighting.",
    points: ["Custom seating layouts", "Statement lighting", "Designer wall finishes"],
  },
  {
    key: "bedroom",
    label: "Bedroom",
    img: blrBedroom,
    desc: "Calm, luxurious bedrooms with smart storage, warm tones and soft ambient lighting.",
    points: ["Headboard & paneling design", "Bedside lighting", "Integrated storage"],
  },
  {
    key: "kitchen",
    label: "Modular Kitchen",
    img: blrKitchen,
    desc: "Ergonomic modular kitchens with quality hardware, premium finishes and practical layouts.",
    points: ["Smart workflow zoning", "Quality hardware & shutters", "Counter-top selection"],
  },
  {
    key: "wardrobe",
    label: "Wardrobes",
    img: blrWardrobe,
    desc: "Bespoke wardrobes tailored to your storage needs with elegant shutter and finish options.",
    points: ["Walk-in or sliding designs", "Internal organizers", "Mirror & finish options"],
  },
  {
    key: "ceiling",
    label: "False Ceiling",
    img: blrCeiling,
    desc: "Architectural false ceilings with cove lighting that transforms the feel of every room.",
    points: ["Cove & profile lighting", "Multi-level designs", "Acoustic considerations"],
  },
  {
    key: "lighting",
    label: "Lighting",
    img: blrDining,
    desc: "Layered lighting plans that combine ambient, task and accent lights for a luxurious feel.",
    points: ["Ambient + task lighting", "Designer fixtures", "Dimmable scenes"],
  },
];

const features = [
  "Personalized design concepts",
  "Smart storage solutions",
  "Premium material options",
  "Elegant lighting planning",
  "Functional layouts",
  "Modern color palettes",
  "Space-saving furniture",
  "End-to-end execution",
];

const steps = [
  "Consultation", "Site Measurement", "Concept Design", "Material Selection",
  "3D/Design Preview", "Execution", "Styling & Final Handover",
];

function ResidentialInteriorPage() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const { data: gallery = [] } = useQuery(galleryQuery());
  const wa = settings.whatsapp?.replace(/\D/g, "") || "919364048269";
  const tel = settings.phone?.replace(/\s/g, "");
  const [active, setActive] = useState(rooms[0].key);
  const current = rooms.find((r) => r.key === active) ?? rooms[0];

  const galleryItems = [
    { title: "Bengaluru Modern Living", img: blrLivingDining },
    { title: "Bengaluru Luxe Bedroom", img: blrBedroom },
    { title: "Bengaluru Modular Kitchen", img: blrKitchen },
    { title: "Bengaluru Custom Wardrobe", img: blrWardrobe },
    { title: "Cove & Profile Ceiling", img: blrCeiling },
    { title: "Layered Ambient Lighting", img: blrDining },
  ];

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={residentialHero}
          alt="Luxury Bengaluru apartment living room with beige sofa, teak panels and brass accents"
          className="absolute inset-0 -z-10 h-full w-full object-cover animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/70 via-charcoal/55 to-charcoal/90" />
        <div className="container-prose flex min-h-[78vh] flex-col justify-end pt-32 pb-20 text-ivory">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.22em] text-ivory/70">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="px-2 text-accent">/</span>
              <Link to="/services" className="hover:text-accent">Services</Link>
              <span className="px-2 text-accent">/</span>
              <span className="text-ivory">Residential Interior Design</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mt-8 text-accent">Homes Designed Around You</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Residential Interior Design
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl font-serif text-xl italic text-accent md:text-2xl">
              Beautiful homes crafted for comfort, function, and timeless living.
            </p>
            <p className="mt-4 max-w-2xl text-ivory/80 md:text-lg">
              We design personalized interiors for apartments, villas, and independent homes with
              thoughtful space planning, premium materials, elegant finishes, and practical everyday
              functionality.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze transition hover:-translate-y-0.5">Book A Free Consultation</a>
              <a href="#room-showcase" className="btn-ghost-dark transition hover:-translate-y-0.5">Explore Home Interiors</a>
              {tel && <a href={`tel:${tel}`} className="btn-ghost-dark transition hover:-translate-y-0.5"><Phone className="h-4 w-4" /> Call Now</a>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Designing Homes That Feel Personal
            </h2>
            <div className="mt-6 h-px w-24 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            <p className="mt-6 text-base leading-relaxed text-foreground/85 md:text-lg">
              Elite Nest Interiors creates residential interiors that combine beauty, comfort,
              functionality, and smart space planning. From living rooms and bedrooms to modular
              kitchens, wardrobes, ceilings, lighting, and furniture, we design spaces that reflect
              your lifestyle and improve everyday living.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire" className="btn-bronze">Design Your Dream Home</a>
              <Link to="/services" className="btn-ghost-dark">All Services</Link>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative grid grid-cols-2 gap-4">
              <img src={residentialBedroom} loading="lazy" alt="Luxury bedroom" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
              <img src={residentialKitchen} loading="lazy" alt="Modular kitchen" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover shadow-luxe" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-prose py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">What we design</p>
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Residential Interior Services</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ Icon, title, body }, i) => (
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
      </section>

      {/* ROOM SHOWCASE — tabs */}
      <section id="room-showcase" className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <Reveal>
            <p className="eyebrow">Room showcase</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Explore Every Room</h2>
          </Reveal>
          <Reveal delay={1}>
            <div className="mt-10 flex flex-wrap gap-2">
              {rooms.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setActive(r.key)}
                  className={`rounded-full border px-5 py-2 text-sm uppercase tracking-[0.18em] transition ${
                    active === r.key
                      ? "border-transparent text-white"
                      : "border-border bg-card text-foreground/70 hover:text-foreground"
                  }`}
                  style={active === r.key ? { background: "var(--gradient-bronze)" } : undefined}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-8 grid gap-8 overflow-hidden rounded-3xl border border-border bg-card shadow-luxe md:grid-cols-[1.2fr_1fr]">
              <img src={current.img} alt={current.label} className="h-full max-h-[520px] w-full object-cover" />
              <div className="flex flex-col justify-center p-8 md:p-10">
                <p className="eyebrow text-accent">{current.label}</p>
                <h3 className="mt-3 font-serif text-3xl text-foreground">{current.label}</h3>
                <p className="mt-4 text-foreground/80">{current.desc}</p>
                <ul className="mt-5 space-y-2">
                  {current.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 text-accent" /> {p}
                    </li>
                  ))}
                </ul>
                <a href="#enquire" className="btn-bronze mt-7 self-start">Design This Space</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES — dark */}
      <section className="bg-charcoal py-20 text-ivory md:py-28">
        <div className="container-prose grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow text-accent">Why premium</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">What Makes Our Home Interiors Premium</h2>
            <p className="mt-6 text-ivory/75">
              Every project is detailed, curated and executed with discipline — so the finished home
              feels effortless, elegant and entirely yours.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <ul className="grid gap-4 sm:grid-cols-2">
              {features.map((p) => (
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
          <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Our Residential Interior Process</h2>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s} delay={(i % 3) as 0 | 1 | 2}>
              <li className="relative h-full rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full font-serif text-sm text-white" style={{ background: "var(--gradient-bronze)" }}>
                    {i + 1}
                  </span>
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <p className="mt-4 font-serif text-base text-foreground">{s}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-bone py-20 md:py-28">
        <div className="container-prose">
          <div className="flex items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow">Gallery</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Recent Residential Projects</h2>
            </Reveal>
            <Reveal delay={1}>
              <Link to="/gallery" className="hidden items-center gap-2 text-sm uppercase tracking-[0.2em] text-accent hover:underline md:inline-flex">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((g, i) => (
              <Reveal key={`${g.title}-${i}`} delay={(i % 3) as 0 | 1 | 2}>
                <div className="group relative overflow-hidden rounded-2xl shadow-luxe">
                  <img src={g.img} alt={g.title} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-serif text-lg text-ivory">{g.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent">Residential</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + ENQUIRY */}
      <ServiceBottomCTA />
      <ExploreMoreServices currentSlug="residential-interior-design" />
      <section id="enquire" className="container-prose py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              Design a home that feels truly yours.
            </h2>
            <p className="mt-5 text-foreground/80 md:text-lg">
              Personalized interiors, premium materials and practical storage — planned and executed
              end-to-end by Elite Nest Interiors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquire-form" className="btn-bronze">Book a Free Consultation</a>
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
              <h3 className="mt-3 font-serif text-2xl text-foreground">Tell us about your home</h3>
              <p className="mt-2 text-sm text-muted-foreground">We respond within one business day.</p>
              <div className="mt-5">
                <EnquiryForm source="service:residential-interior-design" serviceTitle="Residential Interior Design" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
