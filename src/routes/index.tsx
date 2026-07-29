import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Hammer, Compass, Star, Play, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-luxury.jpg";
import { SiteLayout } from "@/components/site-layout";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/scroll-reveal";
import { InteriorCategoriesShowcase } from "@/components/interior-categories-showcase";

import { EndToEndServices } from "@/components/end-to-end-services";
import { ServicesWeOffer } from "@/components/services-we-offer";
import { ConsultationEnquiry } from "@/components/consultation-enquiry";
import { ServicesAccordionShowcase } from "@/components/services-accordion-showcase";
import { FeaturedServiceListings } from "@/components/featured-service-listings";


import {
  categoriesQuery,
  galleryQuery,
  servicesQuery,
  settingsQuery,
  testimonialsQuery,
  videoTestimonialsQuery,
} from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elite Nest Interiors — Premium Construction & Interior Studio" },
      {
        name: "description",
        content:
          "Elite Nest Interiors — premium construction, architecture, renovation and turnkey interior solutions. Residential & commercial design crafted to last.",
      },
      { property: "og:title", content: "Elite Nest Interiors" },
      {
        property: "og:description",
        content: "Premium turnkey construction & interior design studio.",
      },
    ],
    links: [
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" } as any,
    ],
  }),

  loader: async ({ context }) => {
    try {
      context?.queryClient?.prefetchQuery(settingsQuery);
      context?.queryClient?.prefetchQuery(categoriesQuery());
      context?.queryClient?.prefetchQuery(servicesQuery());
      context?.queryClient?.prefetchQuery(testimonialsQuery());
      context?.queryClient?.prefetchQuery(videoTestimonialsQuery());
      context?.queryClient?.prefetchQuery(galleryQuery());
    } catch (err) {
      console.warn("[loader] Supabase fetch failed, rendering with fallbacks:", err);
    }
  },

  component: HomePage,
});

const processSteps = [
  {
    number: "01",
    title: "Understand",
    description: "We understand your lifestyle, preferences, space requirements, and budget."
  },
  {
    number: "02",
    title: "Design",
    description: "We create functional, elegant designs tailored to your vision."
  },
  {
    number: "03",
    title: "Plan",
    description: "Detailed drawings, material selection, costing, and execution planning."
  },
  {
    number: "04",
    title: "Execute",
    description: "Expert project management with strict quality and timeline control."
  },
  {
    number: "05",
    title: "Deliver",
    description: "A beautifully finished space, delivered on time and ready to enjoy."
  }
];

function HomePage() {
  const { data: settings = {} as any } = useQuery(settingsQuery);
  const { data: services = [] } = useQuery(servicesQuery());
  const { data: testimonials = [] } = useQuery(testimonialsQuery());
  const { data: videos = [] } = useQuery(videoTestimonialsQuery());
  const { data: gallery = [] } = useQuery(galleryQuery());

  const heroBg = settings.hero_image_url || heroImg;
  const heroTitle = settings.hero_title || "Crafted Interiors.\nBuilt to Last.";
  const heroSubtitle = settings.hero_subtitle ||
    "End-to-end construction, architecture, and turnkey interior design for residences and businesses that notice the details.";
  const ctaTitle = settings.cta_title || "Ready to start your project?";
  const ctaSubtitle = settings.cta_subtitle ||
    "Tell us about your space. Our team will respond within one business day.";

  return (
    <SiteLayout transparentHeader>
      {/* HERO — Full-bg luxury interior */}
      <section
        className="relative isolate overflow-hidden w-[96%] max-w-[1920px] mx-auto rounded-[24px] md:rounded-[40px] mt-2 md:mt-4 shadow-xl"
        style={{ minHeight: "clamp(580px, 85vh, 800px)" }}
      >
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroBg}
            alt="Luxury living room interior by Elite Nest"
            className="h-full w-full animate-hero-zoom object-cover object-center"
          />
          {/* Warm subtle overlay for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,250,240,0.78) 0%, rgba(255,250,240,0.45) 42%, rgba(255,250,240,0.12) 70%, rgba(255,250,240,0.02) 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-40"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,252,247,0.85) 0%, rgba(255,252,247,0) 100%)",
            }}
          />
        </div>

        <div className="container-prose relative flex min-h-[inherit] items-center pt-[160px] pb-10 md:pt-[180px] md:pb-12">
          <div className="max-w-xl lg:max-w-2xl">
            <Reveal delay={1}>
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: "#B8894D" }} />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: "#8A7458" }}
                >
                  Crafting Spaces
                </span>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <h1
                className="mt-5 font-serif leading-[1.02] tracking-tight"
                style={{
                  color: "#221912",
                  fontSize: "clamp(2.25rem, 5.6vw, 4.5rem)",
                }}
              >
                Where Design Meets
                <br />
                <span className="italic" style={{ color: "#B8894D" }}>
                  Timeless Living
                </span>
              </h1>
            </Reveal>

            <Reveal delay={3}>
              <p
                className="mt-6 max-w-lg text-[15px] leading-relaxed sm:text-base"
                style={{ color: "#5C4F41" }}
              >
                Beautiful interiors. Thoughtful design. Perfectly executed.
              </p>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/gallery"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_-14px_rgba(184,137,77,0.75)] transition hover:-translate-y-0.5 hover:brightness-95"
                  style={{ background: "linear-gradient(135deg,#C49A5A,#B8894D)" }}
                >
                  Explore Our Work
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>

          </div>
        </div>

      </section>

      {/* END-TO-END HOME INTERIOR SERVICES */}
      <EndToEndServices />

      {/* SERVICES WE OFFER — split layout */}
      <ServicesWeOffer />

      {/* WHY CHOOSE THE ELITENEST */}
      <section style={{ backgroundColor: "#FBF6EC" }} className="py-20 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl" style={{ color: "#221912" }}>
              Why choose <span style={{ color: "#B8894D" }}>the elitenest</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Traditional Firm */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#E5D4BD]/30">
              <h3 className="font-serif text-2xl mb-6 text-center text-[#221912]">Traditional firm</h3>
              <ul className="space-y-4">
                {[
                  "Beautiful designs that lack practicality",
                  "Hidden costs and budget overruns",
                  "Multiple vendors, multiple headaches",
                  "Delays and inconsistent execution",
                  "No clear ownership or accountability",
                  "Spaces designed for looks, not everyday living"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                    <span className="text-red-500 shrink-0 mt-0.5">❌</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Elite Nest */}
            <div className="bg-[#1D1A17] rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8894D] opacity-10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C49A5A] opacity-10 rounded-full blur-3xl" />
              
              <h3 className="font-serif text-2xl mb-6 text-center text-white">Elite Nest</h3>
              <ul className="space-y-4 relative z-10">
                {[
                  "Function-led designs with timeless aesthetics",
                  "Transparent budgets with no hidden surprises",
                  "Single-point accountability from start to finish",
                  "Structured execution with on-time delivery",
                  "Smart sourcing for quality and value",
                  "Spaces crafted for real-life comfort and performance"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/90 text-sm md:text-base">
                    <span className="text-[#B8894D] shrink-0 mt-0.5">✅</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>




      {/* INTERIOR CATEGORIES SHOWCASE */}
      <InteriorCategoriesShowcase />

      {/* FEATURED SERVICE LISTINGS */}
      <FeaturedServiceListings />




      {/* CONSULTATION ENQUIRY */}
      <ConsultationEnquiry />


      {/* PROCESS */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose py-24 md:py-32">
          <Reveal>
            <p className="eyebrow">Our process</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl text-foreground md:text-5xl">
              Five steps. <span className="bronze-text">Zero surprises.</span>
            </h2>
          </Reveal>

          <div className="relative mt-14">
            <div className="absolute left-9 right-9 top-[36px] hidden h-[1px] origin-left bg-accent/40 md:block" style={{ animation: "draw-line 1.5s ease-out forwards" }} />
            <div className="absolute left-[36px] top-9 bottom-9 block w-[1px] origin-top bg-accent/40 md:hidden" style={{ animation: "draw-line-y 1.5s ease-out forwards" }} />
            
            <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-5 relative z-10">
              {processSteps.map((p, i) => (
                <Reveal key={p.number} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
                  <div className="relative flex flex-row md:flex-col items-start gap-6 md:gap-0">
                    <div className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full border border-accent/40 bg-[#fdfaf5] font-serif text-2xl text-accent shadow-sm z-10">
                      {p.number}
                    </div>
                    <div className="md:mt-6 pt-3 md:pt-0 pb-4 md:pb-0">
                      <h3 className="font-serif text-xl text-foreground">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      {gallery.length > 0 && (
        <section className="container-prose py-24 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow">Selected work</p>
              <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">From the gallery.</h2>
            </Reveal>
            <Reveal delay={1}>
              <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-accent">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {gallery.slice(0, 6).map((g, i) => (
              <Reveal key={g.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link to="/gallery" className="group relative block aspect-[4/5] overflow-hidden rounded-2xl">
                  <img src={g.image_url} alt={g.title} loading="lazy" className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-ivory">
                    {g.category && <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>{g.category}</p>}
                    <h3 className="mt-1 font-serif text-xl">{g.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section
          className="border-t border-border"
          style={{
            background: "linear-gradient(135deg, #7B552F 0%, #9D7140 45%, #B88745 100%)",
            color: "#FFF8EE",
          }}
        >
          <div className="container-prose py-24 md:py-32">
            <Reveal>
              <p className="eyebrow" style={{ color: "#FFE2B0" }}>Kind words</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl" style={{ color: "#FFFFFF" }}>
                Trusted by homeowners and businesses who care about every detail.
              </h2>
            </Reveal>
            <div
              className="testimonials-marquee mt-14"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)",
              }}
            >
              <div className="testimonials-track flex gap-6 w-max">
                {[...testimonials, ...testimonials].map((t, i) => (
                  <figure
                    key={`${t.id}-${i}`}
                    className="flex h-full w-[340px] shrink-0 flex-col rounded-[26px] p-9 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 md:w-[400px]"
                    style={{
                      background: "rgba(255, 248, 238, 0.08)",
                      border: "1px solid rgba(255, 248, 238, 0.22)",
                      boxShadow: "0 18px 45px rgba(62, 40, 20, 0.22)",
                    }}
                  >
                    <div className="flex items-center gap-1" style={{ color: "#FFE2B0" }}>
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-5 flex-1 font-serif text-xl leading-snug" style={{ color: "#FFF8EE" }}>
                      "{t.content}"
                    </blockquote>
                    <figcaption className="mt-6 text-sm font-semibold" style={{ color: "rgba(255, 248, 238, 0.82)" }}>
                      — {t.author_name}
                      {t.author_location && <span style={{ color: "rgba(255, 248, 238, 0.65)" }}> · {t.author_location}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* VIDEO TESTIMONIALS */}
      {videos.length > 0 && (
        <section className="container-prose py-24 md:py-32">
          <Reveal>
            <p className="eyebrow">Hear it firsthand</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">Video testimonials</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {videos.slice(0, 3).map((v, i) => (
              <Reveal key={v.id} delay={((i + 1) as 1 | 2 | 3)}>
                <a href={v.video_url} target="_blank" rel="noreferrer noopener" className="group relative block overflow-hidden rounded-2xl">
                  <div className="relative aspect-video bg-muted">
                    {v.thumbnail_url && (
                      <img src={v.thumbnail_url} alt={v.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 grid place-items-center bg-charcoal/40">
                      <span className="grid h-16 w-16 place-items-center rounded-full text-white shadow-bronze" style={{ background: "var(--gradient-bronze)" }}>
                        <Play className="h-6 w-6" />
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground">{v.title}</h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <ServicesAccordionShowcase />
    </SiteLayout>
  );
}


function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-serif text-3xl text-ivory md:text-4xl">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ivory/55">{label}</p>
    </div>
  );
}
