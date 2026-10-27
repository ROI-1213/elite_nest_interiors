import { Fragment, useState } from "react";
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

import { PLACEHOLDER_TESTIMONIALS, SITE_SETTINGS_DEFAULTS } from "@/lib/site-content";


import {
  categoriesQuery,
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
      await Promise.all([
        context?.queryClient?.prefetchQuery(settingsQuery),
        context?.queryClient?.prefetchQuery(categoriesQuery()),
        context?.queryClient?.prefetchQuery(servicesQuery()),
        context?.queryClient?.prefetchQuery(testimonialsQuery()),
        context?.queryClient?.prefetchQuery(videoTestimonialsQuery()),
      ]);
    } catch (err) {
      console.warn("[loader] Database fetch error, rendering with fallbacks:", err);
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

function AccentedLines({ title }: { title: string }) {
  const lines = title
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length <= 1) return <>{lines[0] ?? ""}</>;
  return (
    <>
      {lines.slice(0, -1).map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {l}
        </Fragment>
      ))}
      <br />
      <span className="italic" style={{ color: "#B8894D" }}>{lines[lines.length - 1]}</span>
    </>
  );
}

function HomePage() {
  const { data: settings = {} as any } = useQuery(settingsQuery);
  const { data: services = [] } = useQuery(servicesQuery());
  const { data: dbTestimonials = [] } = useQuery(testimonialsQuery());
  const { data: videos = [] } = useQuery(videoTestimonialsQuery());

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : PLACEHOLDER_TESTIMONIALS;

  const processSteps = [
    {
      number: "01",
      title: settings.process_step1_title || "Understand",
      description: settings.process_step1_desc || "We understand your lifestyle, preferences, space requirements, and budget."
    },
    {
      number: "02",
      title: settings.process_step2_title || "Design",
      description: settings.process_step2_desc || "We create functional, elegant designs tailored to your vision."
    },
    {
      number: "03",
      title: settings.process_step3_title || "Plan",
      description: settings.process_step3_desc || "Detailed drawings, material selection, costing, and execution planning."
    },
    {
      number: "04",
      title: settings.process_step4_title || "Execute",
      description: settings.process_step4_desc || "Expert project management with strict quality and timeline control."
    },
    {
      number: "05",
      title: settings.process_step5_title || "Deliver",
      description: settings.process_step5_desc || "A beautifully finished space, delivered on time and ready to enjoy."
    }
  ];

  const processEyebrow = settings.process_eyebrow || "Our process";
  const processTitle = settings.process_title || "Five steps. Zero surprises.";
  const testimonialsEyebrow = settings.testimonials_eyebrow || "Kind words";
  const testimonialsTitle = settings.testimonials_title || "Trusted by homeowners and businesses who care about every detail.";

  const heroBg = settings.hero_image_url || heroImg;
  const heroEyebrow = settings.hero_eyebrow || SITE_SETTINGS_DEFAULTS.hero_eyebrow;
  const heroTitle = settings.hero_title || SITE_SETTINGS_DEFAULTS.hero_title;
  const heroSubtitle = settings.hero_subtitle || SITE_SETTINGS_DEFAULTS.hero_subtitle;
  const heroCtaLabel = settings.hero_cta_label || SITE_SETTINGS_DEFAULTS.hero_cta_label;
  const ctaTitle = settings.cta_title || SITE_SETTINGS_DEFAULTS.cta_title;
  const ctaSubtitle = settings.cta_subtitle || SITE_SETTINGS_DEFAULTS.cta_subtitle;

  const whyUsTitle = settings.why_us_title || SITE_SETTINGS_DEFAULTS.why_us_title;
  const traditionalFirmTitle = settings.traditional_firm_title || SITE_SETTINGS_DEFAULTS.traditional_firm_title;
  const elitenestTitle = settings.elitenest_title || SITE_SETTINGS_DEFAULTS.elitenest_title;
  const splitPoints = (v: string | null | undefined) =>
    (v || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const traditionalPoints =
    splitPoints(settings.traditional_firm_points).length > 0
      ? splitPoints(settings.traditional_firm_points)
      : splitPoints(SITE_SETTINGS_DEFAULTS.traditional_firm_points);
  const elitenestPoints =
    splitPoints(settings.elitenest_points).length > 0
      ? splitPoints(settings.elitenest_points)
      : splitPoints(SITE_SETTINGS_DEFAULTS.elitenest_points);

  const whyAccent = whyUsTitle.lastIndexOf(" the ") >= 0 ? whyUsTitle.slice(whyUsTitle.lastIndexOf(" the ") + 5) : "";
  const whyPre = whyAccent ? whyUsTitle.slice(0, whyUsTitle.lastIndexOf(" the ") + 5) : whyUsTitle;

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

        <div className="container-prose relative flex min-h-[inherit] items-start pt-[100px] pb-10 md:pt-[110px] md:pb-12">
          <div className="max-w-xl lg:max-w-2xl">
            <Reveal delay={1}>
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: "#B8894D" }} />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.32em]"
                  style={{ color: "#8A7458" }}
                >
                  {heroEyebrow}
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
                <AccentedLines title={heroTitle} />
              </h1>
            </Reveal>

            <Reveal delay={3}>
              <p
                className="mt-6 max-w-lg text-[15px] leading-relaxed sm:text-base"
                style={{ color: "#5C4F41" }}
              >
                {heroSubtitle}
              </p>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/gallery"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_30px_-14px_rgba(184,137,77,0.75)] transition hover:-translate-y-0.5 hover:brightness-95"
                  style={{ background: "linear-gradient(135deg,#C49A5A,#B8894D)" }}
                >
                  {heroCtaLabel}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>

          </div>
        </div>

      </section>

      {/* END-TO-END HOME INTERIOR SERVICES */}
      <EndToEndServices eyebrow={settings.e2e_eyebrow} title={settings.e2e_title} />

      {/* SERVICES WE OFFER — split layout */}
      <ServicesWeOffer title={settings.services_offer_title} subtitle={settings.services_offer_subtitle} />

      {/* WHY CHOOSE THE ELITENEST */}
      <section style={{ backgroundColor: "#FBF6EC" }} className="py-20 md:py-32">
        <div className="container-prose">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl" style={{ color: "#221912" }}>
              {whyPre}
              {whyAccent && <span style={{ color: "#B8894D" }}>{whyAccent}</span>}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Traditional Firm */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#E5D4BD]/30">
              <h3 className="font-serif text-2xl mb-6 text-center text-[#221912]">{traditionalFirmTitle}</h3>
              <ul className="space-y-4">
                {traditionalPoints.map((item, i) => (
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
              
              <h3 className="font-serif text-2xl mb-6 text-center text-white">{elitenestTitle}</h3>
              <ul className="space-y-4 relative z-10">
                {elitenestPoints.map((item, i) => (
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
      <InteriorCategoriesShowcase
        eyebrow={settings.categories_section_eyebrow}
        title={settings.categories_section_title}
        subtitle={settings.categories_section_subtitle}
      />

      {/* FEATURED SERVICE LISTINGS */}
      <FeaturedServiceListings
        eyebrow={settings.featured_listings_eyebrow}
        title={settings.featured_listings_title}
        subtitle={settings.featured_listings_subtitle}
      />




      {/* CONSULTATION ENQUIRY */}
      <ConsultationEnquiry heading={ctaTitle} subtitle={ctaSubtitle} />


      {/* PROCESS */}
      <section className="border-y border-border bg-bone">
        <div className="container-prose py-24 md:py-32">
          <Reveal>
            <p className="eyebrow">{processEyebrow}</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl text-foreground md:text-5xl">
              <AccentedLines title={processTitle} />
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
              <p className="eyebrow" style={{ color: "#FFE2B0" }}>{testimonialsEyebrow}</p>
              <h2 className="mt-4 max-w-3xl font-serif text-4xl md:text-5xl" style={{ color: "#FFFFFF" }}>
                {testimonialsTitle}
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
            <p className="eyebrow">{settings.video_section_eyebrow || "Hear it firsthand"}</p>
            <h2 className="mt-4 font-serif text-4xl text-foreground md:text-5xl">
              {settings.video_section_title || "Video testimonials"}
            </h2>
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

      <ServicesAccordionShowcase
        eyebrow={settings.accordion_section_eyebrow}
        title={settings.accordion_section_title}
        subtitle={settings.accordion_section_subtitle}
      />
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
