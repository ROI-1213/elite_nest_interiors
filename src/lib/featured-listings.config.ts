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

export type FeaturedCard = {
  title: string;
  description: string;
  tag: string;
  image: string;
};

export type FeaturedCategory = {
  key: string;
  label: string;
  to: string;
  cards: FeaturedCard[];
};

export const DEFAULT_FEATURED_CATEGORIES: FeaturedCategory[] = [
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

export type CardOverride = {
  image?: string | null;
  title?: string | null;
  description?: string | null;
  tag?: string | null;
};

export type OverridesMap = Record<string, CardOverride>;

export function parseOverrides(raw?: string | null): OverridesMap {
  if (!raw || typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as OverridesMap;
    }
  } catch {
    // Ignore JSON parse errors
  }
  return {};
}

export function resolveFeaturedCategories(rawOverrides?: string | null): FeaturedCategory[] {
  const overrides = parseOverrides(rawOverrides);
  if (Object.keys(overrides).length === 0) {
    return DEFAULT_FEATURED_CATEGORIES;
  }

  return DEFAULT_FEATURED_CATEGORIES.map((cat) => {
    const updatedCards = cat.cards.map((card, idx) => {
      const key = `${cat.key}_${idx}`;
      const ov = overrides[key];
      if (!ov) return card;

      const imgOverride = ov.image && typeof ov.image === "string" && ov.image.trim() && !ov.image.includes("unsplash.com")
        ? ov.image.trim()
        : card.image;

      return {
        title: ov.title && ov.title.trim() ? ov.title.trim() : card.title,
        description: ov.description && ov.description.trim() ? ov.description.trim() : card.description,
        tag: ov.tag && ov.tag.trim() ? ov.tag.trim() : card.tag,
        image: imgOverride,
      };
    });

    return {
      ...cat,
      cards: updatedCards,
    };
  });
}
