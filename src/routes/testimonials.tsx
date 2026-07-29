import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import featuredImg from "@/assets/blr-testimonial-featured.png";
import { useMemo, useState } from "react";
import { Quote, Star, ShieldCheck, Sparkles, Users, HeartHandshake } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/scroll-reveal";
import { testimonialsQuery, type Testimonial } from "@/lib/queries";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Testimonials — Elite Nest Interiors" },
      {
        name: "description",
        content:
          "Read what clients say about Elite Nest Interiors — construction, renovation, interior design, supervision and turnkey solutions.",
      },
      { property: "og:title", content: "Client Testimonials — Elite Nest Interiors" },
      { property: "og:description", content: "Real client stories and reviews." },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(testimonialsQuery());
  },
  component: TestimonialsPage,
});

const FILTERS = [
  "All",
  "Construction",
  "Interior Design",
  "Renovation",
  "Turnkey Solution",
  "Supervision",
] as const;
type Filter = (typeof FILTERS)[number];

const PLACEHOLDERS: Testimonial[] = [
  {
    id: "p1",
    author_name: "Anitha Reddy",
    author_location: "Koramangala, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Elite Nest handled our 3BHK interiors end-to-end. The detailing, materials and on-time delivery exceeded expectations.",
    service_type: "Interior Design",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p2",
    author_name: "Rahul Verma",
    author_location: "Indiranagar, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Their site supervision was clear and disciplined. Weekly reports and proactive coordination kept the build on track.",
    service_type: "Supervision",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p3",
    author_name: "Sneha Iyer",
    author_location: "Whitefield, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "We chose the turnkey package and didn't have to chase anyone. Quality, budget and timeline were respected throughout.",
    service_type: "Turnkey Solution",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p4",
    author_name: "Mohammed Ali",
    author_location: "Jayanagar, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "From foundation to finishing, the construction team was professional and material quality was excellent.",
    service_type: "Construction",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p5",
    author_name: "Divya Krishnan",
    author_location: "HSR Layout, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Our old home felt brand new after the renovation. Elegant choices, smart space planning and clean execution.",
    service_type: "Renovation",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
  {
    id: "p6",
    author_name: "Vivek & Pooja",
    author_location: "Sarjapur Road, Bengaluru",
    author_avatar_url: null,
    rating: 5,
    content:
      "Beautiful, functional interiors with a personal touch. The team listened to every detail and delivered with class.",
    service_type: "Interior Design",
    project_image_url: null,
    display_order: 0,
    is_active: true,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-accent">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star
          key={j}
          className={`h-4 w-4 ${j < rating ? "fill-current" : "opacity-30"}`}
        />
      ))}
    </div>
  );
}

function TestimonialsPage() {
  const { data: dbTestimonials = [] } = useQuery(testimonialsQuery());
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : PLACEHOLDERS;

  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return testimonials;
    return testimonials.filter(
      (t) =>
        (t.service_type || "").toLowerCase() === filter.toLowerCase() ||
        (t.content || "").toLowerCase().includes(filter.toLowerCase()),
    );
  }, [testimonials, filter]);

  const featured = testimonials[0];
  const grid = filtered.filter((t) => t.id !== featured?.id);

  const stats = [
    { icon: Sparkles, label: "Quality-Focused Execution" },
    { icon: Users, label: "Residential & Commercial Projects" },
    { icon: ShieldCheck, label: "End-to-End Support" },
    { icon: HeartHandshake, label: "Client-Centric Planning" },
  ];

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <img
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1920&q=80"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/85 via-charcoal/75 to-charcoal" />
        <div className="container-prose flex min-h-[60vh] flex-col justify-end pt-32 pb-16">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.2em] text-ivory/60">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="mx-2">/</span>
              <span style={{ color: "var(--gold)" }}>Testimonials</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Client <span className="bronze-text">Testimonials</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl text-ivory/80 md:text-lg">
              What our clients say about Elite Nest Interiors.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-prose py-20 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow">Trust &amp; Quality</p>
            <h2 className="mt-4 font-serif text-4xl text-balance md:text-5xl">
              Trusted by clients for quality, design and execution.
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="text-foreground/85 md:text-lg">
              Every project we handle is built on trust, communication, quality and professional
              execution. Hear from clients who chose Elite Nest Interiors for construction,
              renovation, interiors, supervision and turnkey solutions.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose flex gap-2 overflow-x-auto py-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${
                filter === f
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-card text-foreground/70 hover:border-accent hover:text-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      {featured && filter === "All" && (
        <section className="container-prose py-20 md:py-24">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft md:grid md:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[5/4] md:aspect-auto">
              <img
                src={
                  featured.project_image_url || featuredImg
                }
                alt={featured.author_name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative p-8 md:p-12">
              <Quote
                className="absolute right-6 top-6 h-20 w-20 text-accent/10"
                strokeWidth={1.5}
              />
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--gold)" }}
              >
                Featured Story
              </p>
              <Stars rating={featured.rating} />
              <blockquote className="mt-5 font-serif text-2xl leading-snug text-foreground md:text-3xl">
                &ldquo;{featured.content}&rdquo;
              </blockquote>
              <div className="mt-8 border-t border-border pt-5">
                <p className="font-medium text-foreground">{featured.author_name}</p>
                <p className="text-sm text-muted-foreground">
                  {[featured.author_location, featured.service_type].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CARDS GRID */}
      <section className="container-prose pb-20 md:pb-28">
        {grid.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
            <p className="text-sm">No testimonials in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((t, i) => (
              <Reveal key={t.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <figure className="luxe-card relative flex h-full flex-col p-7 transition hover:-translate-y-1">
                  <Quote
                    className="absolute right-5 top-5 h-12 w-12 text-accent/15"
                    strokeWidth={1.5}
                  />
                  {t.project_image_url && (
                    <img
                      src={t.project_image_url}
                      alt=""
                      className="mb-5 aspect-[5/3] w-full rounded-xl object-cover"
                    />
                  )}
                  <Stars rating={t.rating} />
                  <blockquote className="mt-4 flex-1 font-serif text-lg leading-snug text-foreground">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 text-sm">
                    {t.author_avatar_url ? (
                      <img
                        src={t.author_avatar_url}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-bone font-serif text-accent">
                        {t.author_name[0]}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{t.author_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {[t.author_location, t.service_type].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* TRUST STATS */}
      <section className="bg-charcoal text-ivory">
        <div className="container-prose py-20 md:py-24">
          <Reveal>
            <p className="eyebrow text-center" style={{ color: "var(--gold)" }}>
              Why Clients Stay With Us
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-center font-serif text-3xl md:text-4xl">
              Built on trust, delivered with craft.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="rounded-2xl border border-ivory/10 bg-white/[0.03] p-6 text-center backdrop-blur">
                  <span
                    className="mx-auto grid h-12 w-12 place-items-center rounded-full"
                    style={{ background: "var(--gradient-bronze)" }}
                  >
                    <s.icon className="h-5 w-5 text-white" />
                  </span>
                  <p className="mt-5 font-serif text-lg">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bone">
        <div className="container-prose py-20 text-center md:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl text-balance md:text-5xl">
              Ready to start your project with Elite Nest Interiors?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mx-auto mt-5 max-w-2xl text-foreground/75 md:text-lg">
              Let us help you build, renovate or design a space that reflects your vision.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <Link to="/contact-us" className="btn-bronze mt-10">
              Contact Us
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
