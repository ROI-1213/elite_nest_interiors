import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import imgConstructions from "@/assets/service-constructions.jpg";
import imgSupervision from "@/assets/service-supervision.jpg";
import imgArchitectural from "@/assets/service-architectural.jpg";
import imgRenovation from "@/assets/service-renovation.jpg";
import imgStructural from "@/assets/service-structural.jpg";
import imgResidential from "@/assets/service-residential.jpg";
import imgCommercial from "@/assets/service-commercial.jpg";
import imgTurnkey from "@/assets/service-turnkey.png";
import imgWalkthroughs from "@/assets/service-walkthroughs.jpg";
import blrBedroom from "@/assets/blr-bedroom.jpg";
import blrKitchen from "@/assets/blr-kitchen.jpg";
import blrDining from "@/assets/blr-dining.jpg";
import blrReception from "@/assets/blr-reception.jpg";
import blrShowroom from "@/assets/blr-showroom.jpg";
import blrCafe from "@/assets/blr-cafe.jpg";
import blrBathroom from "@/assets/blr-bathroom.jpg";
import blrLivingDining from "@/assets/blr-living-dining.jpg";
import blrWardrobe from "@/assets/blr-wardrobe.jpg";
import blrCeiling from "@/assets/blr-ceiling.jpg";
import blrRccFrame from "@/assets/blr-rcc-frame.jpg";
import blrColumnBeam from "@/assets/blr-column-beam.jpg";

const CATEGORIES = [
  {
    key: "turnkey",
    label: "Turnkey Interiors",
    to: "/services/turnkey-interior-solutions",
    cards: [
      { title: "Complete Apartment Interior", description: "End-to-end handover for a 3BHK residence.", tag: "Turnkey", image: imgTurnkey },
      { title: "Villa Turnkey Execution", description: "From civil to styling, delivered as one.", tag: "Villa", image: imgResidential },
      { title: "Living + Dining Setup", description: "Integrated living and dining execution.", tag: "Living", image: blrLivingDining },
      { title: "Kitchen + Wardrobe Finish", description: "Modular storage with premium hardware.", tag: "Modular", image: blrWardrobe },
    ],
  },
  {
    key: "residential",
    label: "Residential",
    to: "/services/residential-interior-design",
    cards: [
      { title: "Bengaluru Luxury Living Room", description: "Warm, elegant living space with premium finishes.", tag: "Living", image: imgResidential },
      { title: "Modern Apartment Bedroom", description: "Calm bedroom with soft textures and smart storage.", tag: "Bedroom", image: blrBedroom },
      { title: "Premium Modular Kitchen", description: "Practical kitchen layout with refined materials.", tag: "Kitchen", image: blrKitchen },
      { title: "Villa Dining Space", description: "Elegant dining area for family gatherings.", tag: "Dining", image: blrDining },
    ],
  },
  {
    key: "commercial",
    label: "Commercial",
    to: "/services/commercial-interior-design",
    cards: [
      { title: "Bengaluru Office Interior", description: "Focused, elegant workspace design.", tag: "Office", image: imgCommercial },
      { title: "Premium Reception Space", description: "Warm-toned welcome zone for premium brands.", tag: "Reception", image: blrReception },
      { title: "Modern Showroom Design", description: "Clean lines, curated lighting, brand-first.", tag: "Showroom", image: blrShowroom },
      { title: "Café Interior Concept", description: "Cozy Bengaluru café with warm wood accents.", tag: "Café", image: blrCafe },
    ],
  },
  {
    key: "renovation",
    label: "Renovation",
    to: "/services/renovation-remodeling",
    cards: [
      { title: "Apartment Makeover", description: "Refreshed layout, lighting and finishes.", tag: "Makeover", image: imgRenovation },
      { title: "Kitchen Renovation", description: "Reworked kitchen with modern modularity.", tag: "Kitchen", image: blrKitchen },
      { title: "Bathroom Upgrade", description: "Spa-like premium bathroom rebuild.", tag: "Bathroom", image: blrBathroom },
      { title: "Living Room Refresh", description: "Reimagined living zone with new furniture.", tag: "Living", image: blrLivingDining },
    ],
  },
  {
    key: "constructions",
    label: "Constructions",
    to: "/services/construction-services",
    cards: [
      { title: "Bengaluru Villa Construction", description: "Ground-up premium villa construction.", tag: "Villa", image: imgConstructions },
      { title: "Independent House Build", description: "Custom independent home execution.", tag: "House", image: imgConstructions },
      { title: "Residential Structure Work", description: "RCC and structural residential builds.", tag: "Structure", image: imgStructural },
      { title: "Premium Site Execution", description: "Quality-first site execution and finish.", tag: "Site", image: imgSupervision },
    ],
  },
  {
    key: "architectural",
    label: "Architectural Details",
    to: "/services/architectural-design-planning",
    cards: [
      { title: "Floor Plan Detailing", description: "Precise, buildable floor plan sets.", tag: "Plans", image: imgArchitectural },
      { title: "Elevation Planning", description: "Refined elevation studies and options.", tag: "Elevation", image: imgArchitectural },
      { title: "Working Drawings", description: "Contractor-ready working drawing sets.", tag: "Drawings", image: imgStructural },
      { title: "Material Specification", description: "Curated material and finish schedules.", tag: "Materials", image: blrKitchen },
    ],
  },
  {
    key: "structural",
    label: "Structural Design",
    to: "/services/structural-design",
    cards: [
      { title: "RCC Frame Planning", description: "RCC framing designed for durability.", tag: "RCC", image: blrRccFrame },
      { title: "Column Beam Layout", description: "Optimized column-beam grids.", tag: "Layout", image: blrColumnBeam },
      { title: "Foundation Coordination", description: "Foundation design coordination.", tag: "Foundation", image: imgConstructions },
      { title: "Structural Drawing Review", description: "Peer review of structural drawings.", tag: "Review", image: imgArchitectural },
    ],
  },
  {
    key: "supervision",
    label: "Building Supervision",
    to: "/services/building-supervision",
    cards: [
      { title: "Site Quality Inspection", description: "On-site quality checks at every stage.", tag: "QA", image: imgSupervision },
      { title: "Drawing Review On Site", description: "Live drawing review with contractors.", tag: "Review", image: imgArchitectural },
      { title: "Contractor Coordination", description: "Coordination between site teams.", tag: "Coordination", image: imgConstructions },
      { title: "Final Site Review", description: "Pre-handover audits and walkthroughs.", tag: "Audit", image: imgSupervision },
    ],
  },
  {
    key: "walkthroughs",
    label: "3D Walkthroughs",
    to: "/services/3d-walkthrough-gallery",
    cards: [
      { title: "3D Home Walkthrough", description: "Cinematic 3D home walkthrough render.", tag: "3D", image: imgWalkthroughs },
      { title: "Interior Render Preview", description: "Photorealistic interior preview.", tag: "Render", image: blrLivingDining },
      { title: "Commercial Walkthrough", description: "Immersive commercial space preview.", tag: "Commercial", image: blrReception },
      { title: "Cinematic Space Preview", description: "Story-driven interior visualisation.", tag: "Preview", image: blrCeiling },
    ],
  },
];

const GOLD = "#B88745";
const GOLD_LIGHT = "#E9C98A";
const GOLD_BORDER = "rgba(184,135,69,0.4)";

export function FeaturedServiceListings() {
  const [activeKey, setActiveKey] = useState("turnkey");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const category = CATEGORIES.find((c) => c.key === activeKey) ?? CATEGORIES[0];

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scrollBy = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  return (
    <section
      style={{
        background: "linear-gradient(180deg,#FFFAF2 0%,#F6EFE4 100%)",
        padding: "90px 0",
      }}
    >
      <div className="container-prose">

        {/* Heading */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.32em", color: GOLD }}>
            Featured Service Listings
          </span>
          <h2 className="mt-3 font-serif" style={{ fontSize: "clamp(2.25rem,5.2vw,4.5rem)", color: "#2B211B", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            Featured <span style={{ color: GOLD }}>Listings</span>
          </h2>
          <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.7, color: "#6F6258", maxWidth: 480 }}>
            Explore our curated work across interiors, construction, supervision, and design execution.
          </p>
        </div>

        {/* ── Filter Buttons with Manual Scroll Controls ───────────────────── */}
        <div style={{ position: "relative", marginTop: 32 }}>
          {/* Scroll Left Button */}
          <button
            type="button"
            aria-label="Scroll category filters left"
            onClick={() => scrollBy(-260)}
            disabled={!canScrollLeft}
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#FFFAF2",
              border: `1px solid ${GOLD_BORDER}`,
              color: canScrollLeft ? "#8A6338" : "#D4C5B0",
              cursor: canScrollLeft ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(43,33,27,0.12)",
              opacity: canScrollLeft ? 1 : 0.35,
              transition: "opacity 0.2s, background 0.2s, color 0.2s, transform 0.2s",
              outline: "none",
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Scroll Right Button */}
          <button
            type="button"
            aria-label="Scroll category filters right"
            onClick={() => scrollBy(260)}
            disabled={!canScrollRight}
            style={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#FFFAF2",
              border: `1px solid ${GOLD_BORDER}`,
              color: canScrollRight ? "#8A6338" : "#D4C5B0",
              cursor: canScrollRight ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(43,33,27,0.12)",
              opacity: canScrollRight ? 1 : 0.35,
              transition: "opacity 0.2s, background 0.2s, color 0.2s, transform 0.2s",
              outline: "none",
            }}
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollContainerRef}
            onWheel={handleWheel}
            className="category-scroll-bar"
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              overflowY: "hidden",
              paddingBottom: 10,
              paddingLeft: 6,
              paddingRight: 6,
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch" as never,
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat.key === activeKey;
              return (
                <button
                  key={cat.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveKey(cat.key)}
                  style={{
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    borderRadius: 9999,
                    padding: "7px 18px",
                    fontSize: 12.5,
                    fontWeight: 500,
                    cursor: "pointer",
                    border: `1px solid ${GOLD_BORDER}`,
                    background: isActive ? GOLD : "rgba(255,250,242,0.9)",
                    color: isActive ? "#fff" : "#8A6338",
                    boxShadow: isActive ? "0 8px 20px rgba(184,135,69,0.28)" : "none",
                    transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 10,
                    outline: "none",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards ──────────────────────────────────────────────────────── */}
        <div
          key={activeKey}
          className="featured-listings-grid"
          style={{
            marginTop: 24,
            display: "grid",
            gap: 16,
          }}
        >
          {category.cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 16,
                border: "1px solid rgba(196,154,90,0.18)",
                backgroundColor: "#1a140e",
                // first card spans 2 rows on desktop
                ...(idx === 0 ? { gridRow: "span 2" } : {}),
                // second card spans 2 cols on desktop
                ...(idx === 1 ? { gridColumn: "span 2" } : {}),
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                loading={idx === 0 ? "eager" : "lazy"}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Dark gradient overlay — pointer-events none so it NEVER blocks clicks */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />
              {/* Text content */}
              <div style={{ position: "absolute", left: 20, right: 20, bottom: 18, zIndex: 2 }}>
                {card.tag && (
                  <span style={{
                    display: "inline-block",
                    borderRadius: 9999,
                    padding: "3px 10px",
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    background: "rgba(197,139,69,0.18)",
                    color: GOLD_LIGHT,
                    border: `1px solid rgba(197,139,69,0.4)`,
                  }}>
                    {card.tag}
                  </span>
                )}
                <h3 style={{
                  marginTop: 8,
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "clamp(16px,1.8vw,22px)",
                  lineHeight: 1.2,
                  color: "#fff",
                }}>
                  {card.title}
                </h3>
                <div style={{ marginTop: 6, height: 2, width: 36, borderRadius: 9999, background: "#C49A5A" }} />
                <p style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.78)" }}>
                  {card.description}
                </p>
                <Link
                  to={category.to}
                  style={{
                    marginTop: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: GOLD_LIGHT,
                    textDecoration: "none",
                  }}
                >
                  View Details <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
