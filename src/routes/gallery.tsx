import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { ArrowRight, Eye, MapPin, Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { Reveal } from "@/components/scroll-reveal";
import {
  galleryQuery,
  servicesQuery,
  settingsQuery,
  videoTestimonialsQuery,
} from "@/lib/queries";
import imgConstruction from "@/assets/gallery-construction-1.jpg";
import imgResidential from "@/assets/gallery-residential-1.jpg";
import imgCommercial from "@/assets/gallery-commercial-1.jpg";
import imgRenovation from "@/assets/gallery-renovation-1.jpg";
import imgTurnkey from "@/assets/gallery-turnkey-1.jpg";
import imgBedroom from "@/assets/gallery-bedroom-1.jpg";
import imgKitchen from "@/assets/gallery-kitchen-1.jpg";
import imgPooja from "@/assets/gallery-pooja-1.jpg";
import imgDining from "@/assets/gallery-dining-1.jpg";
import imgFacade from "@/assets/gallery-facade-1.jpg";

import imgBlrLiving from "@/assets/gallery-blr-living.png";
import imgBlrBedroom from "@/assets/gallery-blr-bedroom.png";
import imgBlrKitchen from "@/assets/gallery-blr-kitchen.png";
import imgBlrPooja from "@/assets/gallery-blr-pooja.png";
import imgBlrDining from "@/assets/gallery-blr-dining.png";
import imgBlrFacade from "@/assets/gallery-blr-facade.png";

const heroImg = imgBlrLiving;

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Project Gallery — Elite Nest Interiors" },
      {
        name: "description",
        content:
          "Explore completed projects by Elite Nest Interiors across construction, residential, commercial, renovation and turnkey works.",
      },
      { property: "og:title", content: "Project Gallery — Elite Nest Interiors" },
      {
        property: "og:description",
        content: "Construction, renovation and interior design portfolio.",
      },
    ],
  }),
  loader: ({ context }) => {
    try {
      context?.queryClient?.prefetchQuery(galleryQuery());
      context?.queryClient?.prefetchQuery(servicesQuery());
      context?.queryClient?.prefetchQuery(videoTestimonialsQuery());
      context?.queryClient?.prefetchQuery(settingsQuery);
    } catch (_) {}
  },

  component: GalleryPage,
});

const FILTERS = [
  "All",
  "Construction",
  "Residential Interiors",
  "Commercial Interiors",
  "Renovation",
  "Turnkey Projects",
  "Bedrooms",
  "Living Rooms",
  "Kitchens",
  "Dining",
  "Pooja / Foyer",
  "Walkthrough Videos",
] as const;
type Filter = (typeof FILTERS)[number];
type Category = Exclude<Filter, "All" | "Walkthrough Videos">;

function mapCategory(raw: string | null | undefined): Category {
  const c = (raw || "").toLowerCase();
  if (c.includes("commercial") || c.includes("office")) return "Commercial Interiors";
  if (c.includes("renovat")) return "Renovation";
  if (c.includes("turnkey")) return "Turnkey Projects";
  if (c.includes("construct")) return "Construction";
  if (c.includes("bedroom")) return "Bedrooms";
  if (c.includes("living")) return "Living Rooms";
  if (c.includes("kitchen")) return "Kitchens";
  if (c.includes("dining")) return "Dining";
  if (c.includes("pooja") || c.includes("foyer")) return "Pooja / Foyer";
  return "Residential Interiors";
}


function toEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${u.pathname.split("/").pop()}`;
  } catch {}
  return url;
}

type Item = {
  id: string;
  url: string;
  title: string;
  category: Category;
  description: string | null;
  location: string | null;
};

// Dedicated Bengaluru / South Indian premium interior & construction gallery imagery.
// Each image is used exactly once without repetition across sections.
const CURATED: Item[] = [
  // Construction
  { id: "c1", url: imgConstruction, title: "Villa Under Construction, Whitefield", category: "Construction", description: "Premium independent villa framing works in progress.", location: "Whitefield, Bengaluru" },
  { id: "c2", url: imgBlrFacade, title: "Modern Facade, Hebbal", category: "Construction", description: "Contemporary Bengaluru villa exterior with teak slatted screens.", location: "Hebbal" },

  // Residential Interiors
  { id: "r1", url: imgBlrLiving, title: "Warm Family Living Room, Jayanagar", category: "Residential Interiors", description: "Teak paneling, plush seating, and warm golden lighting.", location: "Jayanagar" },
  { id: "r2", url: imgResidential, title: "Contemporary Residence, Basavanagudi", category: "Residential Interiors", description: "Refined materials, warm tones, and modern Indian elegance.", location: "Basavanagudi" },

  // Commercial Interiors
  { id: "co1", url: imgCommercial, title: "Premium Office Reception, MG Road", category: "Commercial Interiors", description: "Warm teak paneling and marble lounge.", location: "MG Road" },

  // Renovation
  { id: "rn1", url: imgRenovation, title: "Renovated South Indian Home", category: "Renovation", description: "Restored heritage feel with modern comfort.", location: "Malleshwaram" },

  // Turnkey Projects
  { id: "t1", url: imgTurnkey, title: "Completed Villa Handover, Devanahalli", category: "Turnkey Projects", description: "Turnkey luxury villa with grand foyer.", location: "Devanahalli" },
  { id: "t2", url: imgFacade, title: "Modern Villa Exterior, Yelahanka", category: "Turnkey Projects", description: "End-to-end contemporary villa build.", location: "Yelahanka" },

  // Bedrooms
  { id: "b1", url: imgBlrBedroom, title: "Master Bedroom Suite, JP Nagar", category: "Bedrooms", description: "Custom teak wardrobe with cove ceiling lighting.", location: "JP Nagar" },
  { id: "b2", url: imgBedroom, title: "Luxury Guest Bedroom, Koramangala", category: "Bedrooms", description: "Warm wooden accents with ambient bedside lighting.", location: "Koramangala" },

  // Living Rooms
  { id: "l1", url: imgBlrLiving, title: "Luxury Living Lounge, Indiranagar", category: "Living Rooms", description: "Teak wood paneling with soft ambient illumination.", location: "Indiranagar" },

  // Kitchens
  { id: "k1", url: imgBlrKitchen, title: "Bengaluru Modular Kitchen, Kaggadasapura", category: "Kitchens", description: "Dark granite countertops with warm oak cabinetry.", location: "Kaggadasapura" },
  { id: "k2", url: imgKitchen, title: "Modern Parallel Kitchen, HSR Layout", category: "Kitchens", description: "Indian-friendly layout with durable quartz surfaces.", location: "HSR Layout" },

  // Dining
  { id: "d1", url: imgBlrDining, title: "Villa Dining Area, Kanakapura Road", category: "Dining", description: "Solid teak 6-seater dining table with brass chandelier.", location: "Kanakapura Road" },
  { id: "d2", url: imgDining, title: "Apartment Dining Zone, Sarjapur", category: "Dining", description: "Warm wood dining setup under warm ambient light.", location: "Sarjapur Road" },

  // Pooja / Foyer
  { id: "p1", url: imgBlrPooja, title: "Traditional-Modern Pooja Room, Girinagar", category: "Pooja / Foyer", description: "Carved teak mandir with brass diyas and marble floor.", location: "Girinagar" },
  { id: "p2", url: imgPooja, title: "Grand Foyer Entrance, Sadashivanagar", category: "Pooja / Foyer", description: "Teak wood entryway with warm golden accents.", location: "Sadashivanagar" },
];


function GalleryPage() {
  const { data: gallery = [] } = useQuery(galleryQuery());
  useQuery(servicesQuery());
  const { data: videos = [] } = useQuery(videoTestimonialsQuery());
  const { data: settings = {} as any } = useQuery(settingsQuery);

  const [filter, setFilter] = useState<Filter>("All");
  const [imageModal, setImageModal] = useState<Item | null>(null);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const filterButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const scrollFilters = useCallback((dir: "left" | "right") => {
    const el = filterScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -140 : 140, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const btn = filterButtonRefs.current.get(filter);
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [filter]);

  const items: Item[] = useMemo(() => {
    const seen = new Set<string>(CURATED.map((i) => i.url));
    const fromGallery: Item[] = gallery
      .filter((g) => !seen.has(g.image_url) && (seen.add(g.image_url), true))
      .map((g) => ({
        id: g.id,
        url: g.image_url,
        title: g.title,
        category: mapCategory(g.category),
        description: g.description,
        location: null,
      }));
    return [...CURATED, ...fromGallery];
  }, [gallery]);


  const featured = items[0];
  const grid = featured ? items.slice(1) : items;

  const filteredGrid =
    filter === "All" || filter === "Walkthrough Videos"
      ? filter === "Walkthrough Videos"
        ? []
        : grid
      : grid.filter((i) => i.category === filter);

  const showVideos = filter === "All" || filter === "Walkthrough Videos";

  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50 animate-hero-zoom"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal" />
        <div className="container-prose flex min-h-[64vh] flex-col justify-end pt-32 pb-16">
          <Reveal>
            <nav className="text-xs uppercase tracking-[0.2em] text-ivory/60">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span className="mx-2">/</span>
              <span style={{ color: "var(--gold)" }}>Gallery</span>
            </nav>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl text-balance md:text-7xl">
              Our Project <span className="bronze-text">Gallery</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-5 max-w-2xl text-ivory/80 md:text-lg">
              Explore our construction, renovation, and interior design works.
            </p>
          </Reveal>
        </div>
      </section>

      {/* FILTERS */}
      <section className="sticky top-16 z-30 border-y border-border bg-bone/95 backdrop-blur">
        <div className="relative container-prose">
          {/* Left arrow - mobile only */}
          <button
            onClick={() => scrollFilters("left")}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-bone/90 shadow-md text-foreground/70 hover:text-accent transition"
            aria-label="Scroll filters left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Scrollable pills */}
          <div
            ref={filterScrollRef}
            className="flex gap-2 overflow-x-auto py-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-0 px-10"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                ref={(el) => { if (el) filterButtonRefs.current.set(f, el); else filterButtonRefs.current.delete(f); }}
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

          {/* Right arrow - mobile only */}
          <button
            onClick={() => scrollFilters("right")}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-bone/90 shadow-md text-foreground/70 hover:text-accent transition"
            aria-label="Scroll filters right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FEATURED */}
      {featured && filter === "All" && (
        <section className="container-prose py-20 md:py-24">
          <Reveal>
            <p className="eyebrow">Featured Project</p>
          </Reveal>
          <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <button
                onClick={() => setImageModal(featured)}
                className="group block overflow-hidden rounded-2xl shadow-soft"
              >
                <img
                  src={featured.url}
                  alt={featured.title}
                  className="aspect-[5/4] w-full object-cover transition duration-1000 group-hover:scale-105"
                />
              </button>
            </Reveal>
            <Reveal delay={1}>
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--gold)" }}
              >
                {featured.category}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-balance md:text-5xl">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="mt-5 text-foreground/85 md:text-lg">{featured.description}</p>
              )}
              <button onClick={() => setImageModal(featured)} className="btn-bronze mt-8">
                View Project <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </Reveal>
          </div>
        </section>
      )}

      {/* IMAGE GRID */}
      {filter !== "Walkthrough Videos" && (
        <section className="border-t border-border bg-bone">
          <div className="container-prose py-20 md:py-24">
            <Reveal>
              <p className="eyebrow">Selected Work</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Project gallery.</h2>
            </Reveal>
            {filteredGrid.length === 0 ? (
              <div className="mt-12 grid place-items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
                <p className="text-sm">No projects in this category yet.</p>
              </div>
            ) : (
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGrid.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setImageModal(item)}
                    className="group relative block w-full overflow-hidden rounded-2xl break-inside-avoid"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent opacity-0 transition group-hover:opacity-100">
                      <div className="p-5 text-ivory">
                        <p
                          className="text-[10px] uppercase tracking-[0.2em]"
                          style={{ color: "var(--gold)" }}
                        >
                          {item.category}
                        </p>
                        <h3 className="mt-1 font-serif text-lg">{item.title}</h3>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-ivory/75">{item.description}</p>
                        )}
                        {item.location && (
                          <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-ivory/70">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-charcoal opacity-0 transition group-hover:opacity-100">
                      <Eye className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* VIDEO WALKTHROUGHS */}
      {showVideos && videos.length > 0 && (
        <section className="bg-charcoal text-ivory">
          <div className="container-prose py-20 md:py-24">
            <Reveal>
              <p className="eyebrow" style={{ color: "var(--gold)" }}>Walkthroughs</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Video walkthroughs.</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVideoModal(v.video_url)}
                  className="group relative overflow-hidden rounded-2xl border border-ivory/10 text-left"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={
                        v.thumbnail_url ||
                        imgCommercial
                      }
                      alt={v.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
                    <span
                      className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full shadow-lg transition group-hover:scale-110"
                      style={{ background: "var(--gradient-bronze)" }}
                    >
                      <Play className="h-6 w-6 translate-x-0.5 text-white" fill="currentColor" />
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl">{v.title}</h3>
                    {v.author_name && (
                      <p className="mt-1 text-sm text-ivory/60">{v.author_name}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-bone">
        <div className="container-prose py-20 text-center md:py-28">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl text-balance md:text-5xl">
              Like what you see?
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mx-auto mt-5 max-w-2xl text-foreground/75 md:text-lg">
              Let Elite Nest Interiors create a beautiful, functional, and professionally executed
              space for you.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact-us" className="btn-bronze">
                Contact Us
              </Link>
              <Link to="/contact-us" className="btn-ghost">
                Get a Free Consultation
              </Link>
            </div>
          </Reveal>
          {settings.phone && (
            <p className="mt-6 text-sm text-muted-foreground">Call us: {settings.phone}</p>
          )}
        </div>
      </section>

      {/* IMAGE MODAL */}
      {imageModal && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
          onClick={() => setImageModal(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setImageModal(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-6xl">
            <img
              src={imageModal.url}
              alt={imageModal.title}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            <figcaption className="mt-4 text-center text-white">
              <p
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--gold)" }}
              >
                {imageModal.category}
              </p>
              <p className="mt-1 font-serif text-xl">{imageModal.title}</p>
              {imageModal.description && (
                <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
                  {imageModal.description}
                </p>
              )}
            </figcaption>
          </figure>
        </div>
      )}

      {/* VIDEO MODAL */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4"
          onClick={() => setVideoModal(null)}
        >
          <button
            className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setVideoModal(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="aspect-video w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={toEmbed(videoModal)}
              title="Walkthrough"
              className="h-full w-full rounded-2xl"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
