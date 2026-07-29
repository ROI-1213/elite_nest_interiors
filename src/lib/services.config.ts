import turnkeyImg from "@/assets/service-turnkey.png";
import residentialImg from "@/assets/service-residential.jpg";
import commercialImg from "@/assets/service-commercial.jpg";
import renovationImg from "@/assets/service-renovation.jpg";
import constructionsImg from "@/assets/service-constructions.jpg";
import architecturalImg from "@/assets/service-architectural.jpg";
import structuralImg from "@/assets/service-structural.jpg";
import supervisionImg from "@/assets/service-supervision.jpg";
import walkthroughsImg from "@/assets/service-walkthroughs.jpg";

export const SERVICE_ORDER = [
  "Turnkey Interior Solutions",
  "Residential Interior Design",
  "Commercial Interior Design",
  "Renovation & Remodeling",
  "Construction Services",
  "Architectural Design & Planning",
  "Structural Design",
  "Building Supervision",
  "3D Walkthrough Gallery",
] as const;

export type ServiceName = typeof SERVICE_ORDER[number];

export const SERVICE_SLUGS: Record<ServiceName, string> = {
  "Turnkey Interior Solutions": "turnkey-interior-solutions",
  "Residential Interior Design": "residential-interior-design",
  "Commercial Interior Design": "commercial-interior-design",
  "Renovation & Remodeling": "renovation-remodeling",
  "Construction Services": "construction-services",
  "Architectural Design & Planning": "architectural-design-planning",
  "Structural Design": "structural-design",
  "Building Supervision": "building-supervision",
  "3D Walkthrough Gallery": "3d-walkthrough-gallery",
};

export const SERVICE_IMAGES: Record<ServiceName, string> = {
  "Turnkey Interior Solutions": turnkeyImg,
  "Residential Interior Design": residentialImg,
  "Commercial Interior Design": commercialImg,
  "Renovation & Remodeling": renovationImg,
  "Construction Services": constructionsImg,
  "Architectural Design & Planning": architecturalImg,
  "Structural Design": structuralImg,
  "Building Supervision": supervisionImg,
  "3D Walkthrough Gallery": walkthroughsImg,
};

export const SERVICE_DESCRIPTIONS: Record<ServiceName, string> = {
  "Turnkey Interior Solutions": "One-team complete interior execution from concept to final handover.",
  "Residential Interior Design": "Beautiful and practical home interiors designed around comfort, lifestyle, and elegance.",
  "Commercial Interior Design": "Professional commercial interiors crafted for functionality, branding, and business experience.",
  "Renovation & Remodeling": "Transform old or underused spaces into elegant, functional, and modern environments.",
  "Construction Services": "End-to-end construction solutions for homes, villas, and commercial spaces built with quality and precision.",
  "Architectural Design & Planning": "Detailed architectural planning and execution-ready drawings for clear, refined building development.",
  "Structural Design": "Smart structural planning for strong, efficient, and long-lasting buildings.",
  "Building Supervision": "Professional site monitoring to ensure your project is executed correctly, safely, and on schedule.",
  "3D Walkthrough Gallery": "Immersive 3D walkthroughs that help you experience your space before execution.",
};

export const getServiceSlug = (title: string) => {
  return SERVICE_SLUGS[title as ServiceName] || title.toLowerCase().replace(/\s+/g, '-');
};
