import bedroomImg from "@/assets/cat-bedroom.jpg";
import kitchenImg from "@/assets/cat-kitchen.jpg";
import livingImg from "@/assets/cat-living.jpg";
import diningImg from "@/assets/cat-dining.jpg";
import wardrobeImg from "@/assets/cat-wardrobe.jpg";
import foyerImg from "@/assets/cat-foyer.jpg";

export const SPACE_KEYS = [
  "space_bedroom_img",
  "space_kitchen_img",
  "space_living_img",
  "space_dining_img",
  "space_wardrobe_img",
  "space_foyer_img",
] as const;

export type SpaceKey = typeof SPACE_KEYS[number];

export const SPACE_LABELS: Record<SpaceKey, string> = {
  space_bedroom_img: "Bedroom Space",
  space_kitchen_img: "Modular Kitchen",
  space_living_img: "Living Room",
  space_dining_img: "Dining Space",
  space_wardrobe_img: "Wardrobe & Storage",
  space_foyer_img: "Entrance Foyer",
};

export const DEFAULT_SPACE_IMAGES: Record<SpaceKey, string> = {
  space_bedroom_img: bedroomImg,
  space_kitchen_img: kitchenImg,
  space_living_img: livingImg,
  space_dining_img: diningImg,
  space_wardrobe_img: wardrobeImg,
  space_foyer_img: foyerImg,
};

export function resolveSpaceImageUrl(key: SpaceKey | string, imageUrl?: string | null): string {
  if (imageUrl && typeof imageUrl === "string" && imageUrl.trim() && !imageUrl.includes("unsplash.com")) {
    return imageUrl.trim();
  }
  return DEFAULT_SPACE_IMAGES[key as SpaceKey] || bedroomImg;
}
