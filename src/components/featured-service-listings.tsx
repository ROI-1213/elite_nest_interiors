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
      { title: "Kitchen + Modular Storage", description: "Modular storage with premium hardware.", tag: "Modular", image: blrWardrobe },
      { title: "Penthouse Fitout Execution", description: "Luxury turnkey interior execution.", tag: "Penthouse", image: blrBedroom },
    ],
  },
  {
    key: "residential",
    label: "Residential",
    to: "/services/residential-interior-design",
    cards: [
      { title: "Bengaluru Luxury Living", description: "Warm, elegant living space with premium finishes.", tag: "Living", image: imgResidential },
      { title: "Modern Apartment Bedroom", description: "Calm bedroom with soft textures and smart storage.", tag: "Bedroom", image: blrBedroom },
      { title: "Premium Modular Kitchen", description: "Practical kitchen layout with refined materials.", tag: "Kitchen", image: blrKitchen },
      { title: "Villa Dining Space", description: "Elegant dining area for family gatherings.", tag: "Dining", image: blrDining },
      { title: "Foyer & Entryway Design", description: "Welcoming entryway crafted for warmth.", tag: "Foyer", image: blrReception },
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
      { title: "Executive Boardroom Studio", description: "High-end corporate meeting environment.", tag: "Executive", image: imgCommercial },
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
      { title: "Villa Facade Restoration", description: "Exterior & civil structural facelift.", tag: "Restore", image: imgConstructions },
    ],
  },
  {
    key: "constructions",
    label: "Constructions",
    to: "/services/construction-services",
    cards: [
      { title: "Bengaluru Villa Build", description: "Ground-up premium villa construction.", tag: "Villa", image: imgConstructions },
      { title: "Independent House Build", description: "Custom independent home execution.", tag: "House", image: imgConstructions },
      { title: "Residential Structure Work", description: "RCC and structural residential builds.", tag: "Structure", image: imgStructural },
      { title: "Site Execution & Finish", description: "Quality-first site execution and finish.", tag: "Site", image: imgSupervision },
      { title: "RCC Core Construction", description: "Heavy structural core execution.", tag: "RCC", image: blrRccFrame },
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
      { title: "3D Layout Blueprint", description: "Comprehensive architectural blueprints.", tag: "Blueprint", image: imgArchitectural },
    ],
  },
  {
    key: "structural",
    label: "Structural Design",
    to: "/services/structural-design",
    cards: [
      { title: "RCC Frame Planning", description: "RCC framing designed for durability.", tag: "RCC", image: blrRccFrame },
      { title: "Column Beam Layout", description: "Optimized column-beam grids.", tag: "Layout", image: blrColumnBeam },
      { title: "Foundation Detailing", description: "Foundation design coordination.", tag: "Foundation", image: imgConstructions },
      { title: "Structural Review", description: "Peer review of structural drawings.", tag: "Review", image: imgArchitectural },
      { title: "Structural Calculation", description: "Load calculations & safety checks.", tag: "Analysis", image: imgStructural },
    ],
  },
  {
    key: "supervision",
    label: "Building Supervision",
    to: "/services/building-supervision",
    cards: [
      { title: "Site Quality Inspection", description: "On-site quality checks at every stage.", tag: "QA", image: imgSupervision },
      { title: "Drawing Review On Site", description: "Live drawing review with contractors.", tag: "Review", image: imgArchitectural },
      { title: "Contractor Supervision", description: "Coordination between site teams.", tag: "Site", image: imgConstructions },
      { title: "Pre-Handover Audit", description: "Pre-handover audits and walkthroughs.", tag: "Audit", image: imgSupervision },
      { title: "Material Testing Check", description: "Rigorous material strength testing.", tag: "Testing", image: blrColumnBeam },
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
      { title: "Cinematic Space Tour", description: "Story-driven interior visualisation.", tag: "Preview", image: blrCeiling },
      { title: "VR Apartment Experience", description: "360-degree virtual tour experience.", tag: "VR", image: blrBedroom },
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

  const topCards = category.cards.slice(0, 2);
  const bottomCards = category.cards.slice(2, 5);

  return (
    <section
      style={{
        background: "linear-gradient(180deg,#FFFAF2 0%,#F6EFE4 100%)",
        padding: "60px 0 80px 0",
      }}
    >
      <div className="container-prose">

        {/* Heading */}
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.32em", color: GOLD }}>
            Featured Service Listings
          </span>
          <h2 className="mt-3 font-serif" style={{ fontSize: "clamp(2rem,4.5vw,4rem)", color: "#2B211B", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
            Featured <span style={{ color: GOLD }}>Listings</span>
          </h2>
          <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.7, color: "#6F6258", maxWidth: 480 }}>
            Explore our curated work across interiors, construction, supervision, and design execution.
          </p>
        </div>

        {/* ── Filter Buttons with Manual Scroll Controls ───────────────────── */}
        <div style={{ position: "relative", marginTop: 28 }}>
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

        {/* ── Cards Grid: 2 Cards Above + 3 Cards Below ──────────────────────── */}
        <div key={activeKey} className="mt-6 flex flex-col gap-3.5 sm:gap-4">
          
          {/* Row 1: 2 Cards Above */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {topCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-[rgba(196,154,90,0.25)] bg-[#1a140e] transition-transform duration-300 hover:-translate-y-1"
                style={{ height: "clamp(180px, 32vw, 290px)" }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(15,10,6,0.92) 0%, rgba(15,10,6,0.35) 60%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-4">
                  {card.tag && (
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#E9C98A] border border-[#C58B45]/40 bg-[#C58B45]/20 mb-1 sm:mb-1.5"
                    >
                      {card.tag}
                    </span>
                  )}
                  <h3 className="font-serif text-xs sm:text-base md:text-xl font-medium leading-tight text-white line-clamp-1 sm:line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="mt-1 hidden sm:block text-[11px] sm:text-xs text-white/75 line-clamp-1 md:line-clamp-2">
                    {card.description}
                  </p>
                  <Link
                    to={category.to}
                    className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E9C98A] hover:underline"
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 3 Cards Below */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {bottomCards.map((card, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg sm:rounded-2xl border border-[rgba(196,154,90,0.25)] bg-[#1a140e] transition-transform duration-300 hover:-translate-y-1"
                style={{ height: "clamp(150px, 26vw, 240px)" }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(15,10,6,0.92) 0%, rgba(15,10,6,0.3) 65%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-x-2 bottom-2.5 z-10 sm:inset-x-4 sm:bottom-4">
                  {card.tag && (
                    <span
                      className="inline-block rounded-full px-1.5 py-0.5 text-[8px] sm:text-[9.5px] font-semibold uppercase tracking-wider text-[#E9C98A] border border-[#C58B45]/40 bg-[#C58B45]/20 mb-1"
                    >
                      {card.tag}
                    </span>
                  )}
                  <h3 className="font-serif text-[11px] sm:text-sm md:text-lg font-medium leading-tight text-white line-clamp-1 sm:line-clamp-2">
                    {card.title}
                  </h3>
                  <Link
                    to={category.to}
                    className="mt-1 inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#E9C98A] hover:underline"
                  >
                    View <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
