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
import heroLiving from "@/assets/hero-living.jpg";

/**
 * Curated gallery shown on the site. `assetKey` is a build-stable identifier that
 * gets stored in the database (as `asset://<assetKey>`) so the bundled image can be
 * resolved at render time without depending on hashed asset URLs.
 *
 * Fixed seed IDs are used by `scripts/sync-site-content.js` to upsert these rows into
 * `gallery_items` so they appear in (and can be edited from) the admin panel.
 */
export type CuratedGalleryItem = {
  id: string;
  assetKey: string;
  url: string;
  title: string;
  category: string;
  description: string;
  location: string;
};

export const CURATED_GALLERY: CuratedGalleryItem[] = [
  { id: "00000000-0000-4000-8000-000000000001", assetKey: "gallery-construction-1", url: imgConstruction, title: "Villa Under Construction, Whitefield", category: "Construction", description: "Premium independent villa framing works in progress.", location: "Whitefield, Bengaluru" },
  { id: "00000000-0000-4000-8000-000000000002", assetKey: "gallery-blr-facade", url: imgBlrFacade, title: "Modern Facade, Hebbal", category: "Construction", description: "Contemporary Bengaluru villa exterior with teak slatted screens.", location: "Hebbal" },
  { id: "00000000-0000-4000-8000-000000000003", assetKey: "gallery-blr-living", url: imgBlrLiving, title: "Warm Family Living Room, Jayanagar", category: "Residential Interiors", description: "Teak paneling, plush seating, and warm golden lighting.", location: "Jayanagar" },
  { id: "00000000-0000-4000-8000-000000000004", assetKey: "gallery-residential-1", url: imgResidential, title: "Contemporary Residence, Basavanagudi", category: "Residential Interiors", description: "Refined materials, warm tones, and modern Indian elegance.", location: "Basavanagudi" },
  { id: "00000000-0000-4000-8000-000000000005", assetKey: "gallery-commercial-1", url: imgCommercial, title: "Premium Office Reception, MG Road", category: "Commercial Interiors", description: "Warm teak paneling and marble lounge.", location: "MG Road" },
  { id: "00000000-0000-4000-8000-000000000006", assetKey: "gallery-renovation-1", url: imgRenovation, title: "Renovated South Indian Home, Malleshwaram", category: "Renovation", description: "Restored heritage feel with modern comfort.", location: "Malleshwaram" },
  { id: "00000000-0000-4000-8000-000000000007", assetKey: "gallery-turnkey-1", url: imgTurnkey, title: "Completed Villa Handover, Devanahalli", category: "Turnkey Projects", description: "Turnkey luxury villa with grand foyer.", location: "Devanahalli" },
  { id: "00000000-0000-4000-8000-000000000008", assetKey: "gallery-facade-1", url: imgFacade, title: "Modern Villa Exterior, Yelahanka", category: "Turnkey Projects", description: "End-to-end contemporary villa build.", location: "Yelahanka" },
  { id: "00000000-0000-4000-8000-000000000009", assetKey: "gallery-blr-bedroom", url: imgBlrBedroom, title: "Master Bedroom Suite, JP Nagar", category: "Bedrooms", description: "Custom teak wardrobe with cove ceiling lighting.", location: "JP Nagar" },
  { id: "00000000-0000-4000-8000-00000000000A", assetKey: "gallery-bedroom-1", url: imgBedroom, title: "Luxury Guest Bedroom, Koramangala", category: "Bedrooms", description: "Warm wooden accents with ambient bedside lighting.", location: "Koramangala" },
  { id: "00000000-0000-4000-8000-00000000000B", assetKey: "hero-living", url: heroLiving, title: "Luxury Living Lounge, Indiranagar", category: "Living Rooms", description: "Teak wood paneling with soft ambient illumination.", location: "Indiranagar" },
  { id: "00000000-0000-4000-8000-00000000000C", assetKey: "gallery-blr-kitchen", url: imgBlrKitchen, title: "Bengaluru Modular Kitchen, Kaggadasapura", category: "Kitchens", description: "Dark granite countertops with warm oak cabinetry.", location: "Kaggadasapura" },
  { id: "00000000-0000-4000-8000-00000000000D", assetKey: "gallery-kitchen-1", url: imgKitchen, title: "Modern Parallel Kitchen, HSR Layout", category: "Kitchens", description: "Indian-friendly layout with durable quartz surfaces.", location: "HSR Layout" },
  { id: "00000000-0000-4000-8000-00000000000E", assetKey: "gallery-blr-dining", url: imgBlrDining, title: "Villa Dining Area, Kanakapura Road", category: "Dining", description: "Solid teak 6-seater dining table with brass chandelier.", location: "Kanakapura Road" },
  { id: "00000000-0000-4000-8000-00000000000F", assetKey: "gallery-dining-1", url: imgDining, title: "Apartment Dining Zone, Sarjapur", category: "Dining", description: "Warm wood dining setup under warm ambient light.", location: "Sarjapur Road" },
  { id: "00000000-0000-4000-8000-000000000010", assetKey: "gallery-blr-pooja", url: imgBlrPooja, title: "Traditional-Modern Pooja Room, Girinagar", category: "Pooja / Foyer", description: "Carved teak mandir with brass diyas and marble floor.", location: "Girinagar" },
  { id: "00000000-0000-4000-8000-000000000011", assetKey: "gallery-pooja-1", url: imgPooja, title: "Grand Foyer Entrance, Sadashivanagar", category: "Pooja / Foyer", description: "Teak wood entryway with warm golden accents.", location: "Sadashivanagar" },
];

/**
 * Resolves a gallery item's display URL.
 * - `asset://<assetKey>` references a bundled image and is resolved to its built URL.
 * - Real URLs (http/https, data:, uploads) are returned unchanged.
 * - Anything else falls back to the curated item with the same title.
 */
export function resolveGalleryImageUrl(g: { title?: string; image_url?: string }): string {
  const url = g.image_url ?? "";
  if (url.startsWith("asset://")) {
    const key = url.slice("asset://".length);
    return CURATED_GALLERY.find((c) => c.assetKey === key)?.url || url;
  }
  if (url.startsWith("data:") || url.includes("/uploads/") || /^https?:\/\//i.test(url)) {
    return url;
  }
  return CURATED_GALLERY.find((c) => c.title === g.title)?.url || url;
}
