import {
  Building2,
  House,
  BriefcaseBusiness,
  Store,
  Coffee,
  Hospital,
  GraduationCap
} from "lucide-react";

export const CATEGORY_ORDER = [
  "Apartments",
  "Villas & Residences",
  "Offices",
  "Retail Stores",
  "Cafés & Restaurants",
  "Clinics & Hospitals",
  "Schools & Institutions"
] as const;

export type CategoryName = typeof CATEGORY_ORDER[number];

export const CATEGORY_ICONS: Record<CategoryName, React.ElementType> = {
  "Apartments": Building2,
  "Villas & Residences": House,
  "Offices": BriefcaseBusiness,
  "Retail Stores": Store,
  "Cafés & Restaurants": Coffee,
  "Clinics & Hospitals": Hospital,
  "Schools & Institutions": GraduationCap
};
