import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ExternalLink,
  Save,
  Upload,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import {
  updateSiteSettingsServerFn,
  uploadStorageFileServerFn,
  saveServiceServerFn,
} from "@/lib/server-functions";
import {
  settingsQuery,
  servicesQuery,
  type SiteSettings,
  type Service,
} from "@/lib/queries";
import { SERVICE_IMAGES, SERVICE_ORDER, resolveServiceImageUrl } from "@/lib/services.config";
import { DEFAULT_SPACE_IMAGES, resolveSpaceImageUrl } from "@/lib/spaces.config";
import {
  DEFAULT_FEATURED_CATEGORIES,
  parseOverrides,
  type CardOverride,
} from "@/lib/featured-listings.config";
import { getStoredAuth } from "./route";

export const Route = createFileRoute("/_authenticated/home-editor")({
  head: () => ({ meta: [{ title: "Home Page Editor — Elite Nest Interiors" }] }),
  component: HomePageEditorPage,
});

const SECTIONS = [
  { id: "sec-hero", num: "01", name: "Hero Section" },
  { id: "sec-e2e", num: "02", name: "End-to-End Carousel" },
  { id: "sec-services-offer", num: "03", name: "Services We Offer (Images & Content)" },
  { id: "sec-why-us", num: "04", name: "Why Choose Us" },
  { id: "sec-spaces", num: "05", name: "Interior Spaces (Images & Content)" },
  { id: "sec-featured", num: "06", name: "Featured Listings" },
  { id: "sec-cta", num: "07", name: "Consultation Banner" },
  { id: "sec-process", num: "08", name: "5-Step Process" },
  { id: "sec-testimonials", num: "09", name: "Client Reviews" },
  { id: "sec-videos", num: "10", name: "Video Reviews" },
  { id: "sec-accordion", num: "11", name: "Services Accordion" },
];

const inp =
  "w-full rounded-lg border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition";

async function uploadToStorage(file: File, folder: string): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const mimeType = file.type || "image/jpeg";

  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
  });
  reader.readAsDataURL(file);
  const base64Data = await base64Promise;

  const res = await uploadStorageFileServerFn({
    data: {
      bucket: "site-assets",
      filename,
      mimeType,
      base64Data,
    },
  });

  return res?.publicUrl ?? null;
}

function HomePageEditorPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(settingsQuery);
  const { data: services = [] } = useQuery(servicesQuery({ onlyActive: false }));

  // Client-side authentication guard
  const [auth, setAuth] = useState<{ user: { id: string; email: string }; isAdmin: boolean } | null>(() => {
    if (typeof window !== "undefined") {
      return getStoredAuth();
    }
    return null;
  });
  const [isVerifying, setIsVerifying] = useState(!auth?.isAdmin);

  useEffect(() => {
    const current = getStoredAuth();
    if (!current || !current.isAdmin) {
      window.location.replace("/auth");
      return;
    }
    setAuth(current);
    setIsVerifying(false);
  }, []);

  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingSvcId, setUploadingSvcId] = useState<string | null>(null);
  const [uploadingSpaceKey, setUploadingSpaceKey] = useState<string | null>(null);
  const [activeFeaturedCat, setActiveFeaturedCat] = useState("turnkey");
  const [uploadingCardKey, setUploadingCardKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("sec-hero");

  useEffect(() => {
    if (data && !draft) {
      setDraft(data);
    }
  }, [data, draft]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveChanges();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  async function saveChanges() {
    if (!draft) return;
    setIsSaving(true);
    const { id: _id, ...rest } = draft;
    try {
      await updateSiteSettingsServerFn({ data: rest });
      toast.success("Home page content successfully saved and published!");
      setIsDirty(false);
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to save homepage changes.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleHeroUpload(file?: File) {
    if (!file || !draft) return;
    setUploadingHero(true);
    try {
      const url = await uploadToStorage(file, "hero");
      if (url) {
        setDraft({ ...draft, hero_image_url: url });
        setIsDirty(true);
        toast.success("Hero image uploaded.");
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleServiceUpload(service: Service, file?: File) {
    if (!file) return;
    setUploadingSvcId(service.id);
    try {
      const url = await uploadToStorage(file, "services");
      if (url) {
        await saveServiceServerFn({
          data: {
            ...service,
            image_url: url,
          },
        });
        qc.invalidateQueries({ queryKey: ["services"] });
        toast.success(`Image updated for "${service.title}"!`);
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingSvcId(null);
    }
  }

  async function handleServiceUrlUpdate(service: Service, newUrl: string) {
    try {
      await saveServiceServerFn({
        data: {
          ...service,
          image_url: newUrl.trim() || null,
        },
      });
      qc.invalidateQueries({ queryKey: ["services"] });
      toast.success(`Image URL updated for "${service.title}"!`);
    } catch (err: any) {
      toast.error("Failed to update image URL: " + err.message);
    }
  }

  async function handleSpaceUpload(field: keyof SiteSettings, spaceLabel: string, file?: File) {
    if (!file || !draft) return;
    setUploadingSpaceKey(String(field));
    try {
      const url = await uploadToStorage(file, "spaces");
      if (url) {
        setDraft({ ...draft, [field]: url });
        setIsDirty(true);
        toast.success(`Image uploaded for ${spaceLabel}!`);
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingSpaceKey(null);
    }
  }

  async function handleFeaturedCardUpload(catKey: string, cardIdx: number, file?: File) {
    if (!file || !draft) return;
    const key = `${catKey}_${cardIdx}`;
    setUploadingCardKey(key);
    try {
      const url = await uploadToStorage(file, "featured-cards");
      if (url) {
        const overrides = parseOverrides(draft.featured_listings_cards);
        overrides[key] = { ...(overrides[key] || {}), image: url };
        setDraft({ ...draft, featured_listings_cards: JSON.stringify(overrides) });
        setIsDirty(true);
        toast.success("Card image updated!");
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingCardKey(null);
    }
  }

  function updateCardOverride(catKey: string, cardIdx: number, patch: CardOverride) {
    if (!draft) return;
    const key = `${catKey}_${cardIdx}`;
    const overrides = parseOverrides(draft.featured_listings_cards);
    overrides[key] = { ...(overrides[key] || {}), ...patch };
    setDraft({ ...draft, featured_listings_cards: JSON.stringify(overrides) });
    setIsDirty(true);
  }

  const upd = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!draft) return;
    setDraft({ ...draft, [k]: e.target.value });
    setIsDirty(true);
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (isLoading || !draft) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-accent border-t-transparent" />
        <p className="mt-4 font-serif text-lg text-foreground">Loading Home Page Editor…</p>
        <p className="text-sm text-muted-foreground">Fetching complete site configuration</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-foreground pb-36">
      {/* ── Top Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#E8DEC8] bg-[#FFFDF9]/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-lg border border-[#DECDB3] bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4A3B2C] hover:bg-[#FAF4EB] transition shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
            <div className="hidden sm:block h-6 w-px bg-[#DECDB3]" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-[#2A1D13]">
                  Home Page Complete Editor
                </h1>
                <span className="rounded-full bg-[#EEDBBE] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#735128]">
                  Full Suite
                </span>
              </div>
              <p className="text-xs text-[#7A6B5D] hidden md:block">
                Edit text, headlines, and all images for all 11 homepage sections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DECDB3] bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-[#4A3B2C] hover:bg-[#FAF4EB] transition shadow-xs"
              title="Open live homepage in a new tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#B8894D]" />
              <span className="hidden sm:inline">Preview Live Site</span>
            </a>

            <button
              type="button"
              onClick={saveChanges}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-sm transition disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #C49A5A 0%, #B8894D 100%)" }}
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Publishing…" : "Save & Publish"}</span>
            </button>
          </div>
        </div>

        {/* ── Quick Jump Section Bar ────────────────────────────── */}
        <div className="border-t border-[#EFE5D3] bg-[#FAF5EB] px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A7458] mr-1 flex items-center gap-1">
              <Layers className="h-3 w-3" /> Jump to:
            </span>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  activeSection === s.id
                    ? "bg-[#2A1D13] text-white shadow-xs"
                    : "bg-white text-[#5D4A36] border border-[#DECDB3] hover:bg-[#F2E8D8]"
                }`}
              >
                <span className="opacity-60 mr-1">{s.num}</span> {s.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content Container ────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">

        {/* SECTION 1: HERO */}
        <section id="sec-hero" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 01</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">Hero Section (Above the Fold)</h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The full-viewport welcome screen visitors see first upon landing on the homepage.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Eyebrow Badge Text
              </label>
              <input
                className={inp}
                placeholder="e.g. Crafting Spaces"
                value={draft.hero_eyebrow ?? ""}
                onChange={upd("hero_eyebrow")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Primary CTA Button Label
              </label>
              <input
                className={inp}
                placeholder="e.g. Explore Our Work"
                value={draft.hero_cta_label ?? ""}
                onChange={upd("hero_cta_label")}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Hero Main Headline (Use \n for line breaks)
              </label>
              <textarea
                rows={2}
                className={inp}
                placeholder="Where Design Meets\nTimeless Living"
                value={draft.hero_title ?? ""}
                onChange={upd("hero_title")}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                className={inp}
                placeholder="Beautiful interiors. Thoughtful design. Perfectly executed."
                value={draft.hero_subtitle ?? ""}
                onChange={upd("hero_subtitle")}
              />
            </div>

            <div className="sm:col-span-2 border-t border-[#F0E6D6] pt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-2">
                Hero Background Image
              </label>
              <div className="flex flex-wrap items-center gap-4">
                {draft.hero_image_url && (
                  <div className="relative h-24 w-40 rounded-lg overflow-hidden border border-[#DECDB3] shadow-xs">
                    <img src={draft.hero_image_url} alt="Hero Preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#DECDB3] bg-[#FAF5EB] px-4 py-2 text-xs sm:text-sm font-medium text-[#4A3B2C] hover:bg-[#F2E8D8] transition shadow-xs">
                  <Upload className="h-4 w-4 text-[#B8894D]" />
                  <span>{uploadingHero ? "Uploading to storage…" : "Upload new hero image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleHeroUpload(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              <input
                className={`${inp} mt-2.5`}
                placeholder="…or paste direct hero image URL"
                value={draft.hero_image_url ?? ""}
                onChange={upd("hero_image_url")}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: END-TO-END SERVICES */}
        <section id="sec-e2e" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 02</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                End-to-End Home Interior Services (Infinite Carousel)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The continuous auto-scrolling horizontal cards showing all 9 specialized turnkey offerings.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Eyebrow Badge
              </label>
              <input
                className={inp}
                placeholder="What we offer"
                value={draft.e2e_eyebrow ?? ""}
                onChange={upd("e2e_eyebrow")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Section Heading
              </label>
              <input
                className={inp}
                placeholder="Our End-to-End Home Interior Design Services In Bangalore"
                value={draft.e2e_title ?? ""}
                onChange={upd("e2e_title")}
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: SERVICES WE OFFER (WITH FULL IMAGE & CONTENT EDITING FOR ALL 9 SERVICES) */}
        <section id="sec-services-offer" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 03</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Services We Offer (Interactive Split Showcase)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Edit the section headline, plus the images and details for each of the 9 services displayed in this interactive split section.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Section Title
                </label>
                <input
                  className={inp}
                  placeholder="Services We Offer"
                  value={draft.services_offer_title ?? ""}
                  onChange={upd("services_offer_title")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  className={inp}
                  placeholder="From initial concept sketches to turnkey handover..."
                  value={draft.services_offer_subtitle ?? ""}
                  onChange={upd("services_offer_subtitle")}
                />
              </div>
            </div>

            {/* Individual Service Images & Information */}
            <div className="border-t border-[#F0E6D6] pt-6">
              <div className="mb-4">
                <h3 className="font-serif text-lg font-bold text-[#2A1D13]">
                  Service Items & Display Images ({services.length > 0 ? services.length : SERVICE_ORDER.length} Services)
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Change the image shown on the right side of the split showcase when each service is active.
                </p>
              </div>

              <div className="space-y-4">
                {(services.length > 0 ? services : SERVICE_ORDER.map((name, idx) => ({
                  id: `svc-${idx + 1}`,
                  title: name,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  image_url: SERVICE_IMAGES[name],
                  short_description: "",
                  description: "",
                  display_order: idx + 1,
                  is_active: true,
                }))).map((svc: any) => {
                  const currentImg = resolveServiceImageUrl(svc.title, svc.image_url);
                  const isUploading = uploadingSvcId === svc.id;

                  return (
                    <div
                      key={svc.id || svc.slug}
                      className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4 flex flex-col md:flex-row md:items-center gap-5 justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-32 shrink-0 rounded-lg overflow-hidden border border-[#D5C2A5] bg-black/5 shadow-xs">
                          <img
                            src={currentImg}
                            alt={svc.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7458]">
                            /services/{svc.slug}
                          </span>
                          <h4 className="font-serif text-base font-bold text-[#2A1D13]">
                            {svc.title}
                          </h4>
                          <p className="text-xs text-[#6F6052] mt-0.5 line-clamp-1">
                            {svc.short_description || "Turnkey interior execution across Bengaluru"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 md:max-w-md w-full md:w-auto">
                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#DECDB3] bg-white px-3.5 py-2 text-xs font-semibold text-[#4A3B2C] hover:bg-[#F2E8D8] transition shadow-xs">
                          <Upload className="h-3.5 w-3.5 text-[#B8894D]" />
                          <span>{isUploading ? "Uploading…" : "Change Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              handleServiceUpload(svc, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <input
                          className="flex-1 md:w-56 rounded-lg border border-[#DECDB3] bg-white px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                          placeholder="Paste image URL..."
                          defaultValue={svc.image_url ?? ""}
                          onBlur={(e) => {
                            if (e.target.value !== svc.image_url) {
                              handleServiceUrlUpdate(svc, e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHY CHOOSE US */}
        <section id="sec-why-us" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 04</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Why Choose Elite Nest (Comparison Matrix)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Side-by-side comparison table contrasting traditional contractor firms with Elite Nest's transparent approach.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Comparison Section Main Title
              </label>
              <input
                className={inp}
                placeholder="Why choose the elitenest"
                value={draft.why_us_title ?? ""}
                onChange={upd("why_us_title")}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="rounded-xl border border-red-200 bg-red-50/40 p-4.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-red-900 mb-1.5">
                  Traditional Firm (Left Column Title)
                </label>
                <input
                  className={inp}
                  placeholder="Traditional firm"
                  value={draft.traditional_firm_title ?? ""}
                  onChange={upd("traditional_firm_title")}
                />
                <label className="block text-xs font-semibold text-red-950/80 mt-3 mb-1">
                  Pain Points (One bullet per line, marked with ❌)
                </label>
                <textarea
                  rows={7}
                  className={inp}
                  placeholder="Unclear estimates & surprise costs&#10;Subcontracted work with poor quality control&#10;Frequent delays and missing deadlines"
                  value={draft.traditional_firm_points ?? ""}
                  onChange={upd("traditional_firm_points")}
                />
              </div>

              <div className="rounded-xl border border-[#D5B888] bg-[#FAF5EB] p-4.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3822] mb-1.5">
                  Elite Nest (Right Column Title)
                </label>
                <input
                  className={inp}
                  placeholder="Elite Nest"
                  value={draft.elitenest_title ?? ""}
                  onChange={upd("elitenest_title")}
                />
                <label className="block text-xs font-semibold text-[#4A3822]/80 mt-3 mb-1">
                  Advantages (One bullet per line, marked with ✅)
                </label>
                <textarea
                  rows={7}
                  className={inp}
                  placeholder="100% single-point accountability&#10;Fixed transparent quotes with zero surprises&#10;Strict milestone-based timeline delivery"
                  value={draft.elitenest_points ?? ""}
                  onChange={upd("elitenest_points")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERIOR SPACES (WITH FULL IMAGE EDITING FOR BEDROOM, KITCHEN, LIVING, DINING, WARDROBE, FOYER) */}
        <section id="sec-spaces" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 05</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Interior Categories & Lifestyle Spaces (Coverflow Showcase)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Edit the section header, plus the 3D coverflow images for Bedroom, Kitchen, Living, Dining, Wardrobe, and Foyer.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  className={inp}
                  placeholder="Our Interior Expertise"
                  value={draft.categories_section_eyebrow ?? ""}
                  onChange={upd("categories_section_eyebrow")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Section Heading
                </label>
                <input
                  className={inp}
                  placeholder="Spaces Designed Around Your Lifestyle"
                  value={draft.categories_section_title ?? ""}
                  onChange={upd("categories_section_title")}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  className={inp}
                  placeholder="Explore our curated interior solutions for every corner of your home."
                  value={draft.categories_section_subtitle ?? ""}
                  onChange={upd("categories_section_subtitle")}
                />
              </div>
            </div>

            {/* Individual Room Space Images */}
            <div className="border-t border-[#F0E6D6] pt-6">
              <div className="mb-4">
                <h3 className="font-serif text-lg font-bold text-[#2A1D13]">
                  Room Space Images (6 Coverflow Spaces)
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Custom images for each room space in the coverflow. Leaving a field blank defaults to the curated showroom image.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { key: "space_bedroom_img", label: "Bedroom Space" },
                  { key: "space_kitchen_img", label: "Modular Kitchen" },
                  { key: "space_living_img", label: "Living Room" },
                  { key: "space_dining_img", label: "Dining Space" },
                  { key: "space_wardrobe_img", label: "Wardrobe & Storage" },
                  { key: "space_foyer_img", label: "Entrance Foyer" },
                ].map((sp) => {
                  const currentVal = resolveSpaceImageUrl(sp.key, (draft as any)[sp.key]);
                  const isUploading = uploadingSpaceKey === sp.key;

                  return (
                    <div key={sp.key} className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4 flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#D5C2A5] bg-black/5 mb-3">
                          <img src={currentVal} alt={sp.label} className="h-full w-full object-cover" />
                        </div>
                        <h4 className="font-serif text-sm font-bold text-[#2A1D13]">{sp.label}</h4>
                      </div>

                      <div className="mt-3 space-y-2">
                        <label className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#DECDB3] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A3B2C] hover:bg-[#F2E8D8] transition shadow-xs">
                          <Upload className="h-3 w-3 text-[#B8894D]" />
                          <span>{isUploading ? "Uploading…" : "Upload New Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                              handleSpaceUpload(sp.key as any, sp.label, e.target.files?.[0]);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#DECDB3] bg-white px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                          placeholder="…or paste image URL"
                          value={((draft as any)[sp.key]?.includes("unsplash.com") ? "" : (draft as any)[sp.key]) ?? ""}
                          onChange={upd(sp.key as any)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: FEATURED LISTINGS */}
        <section id="sec-featured" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 06</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Featured Service Listings (Interactive Packages & Cards)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Edit the section headers, plus the individual cards and photos for all 9 category tabs.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Eyebrow Badge
                </label>
                <input
                  className={inp}
                  placeholder="Featured Service Listings"
                  value={draft.featured_listings_eyebrow ?? ""}
                  onChange={upd("featured_listings_eyebrow")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Section Title
                </label>
                <input
                  className={inp}
                  placeholder="Featured Listings"
                  value={draft.featured_listings_title ?? ""}
                  onChange={upd("featured_listings_title")}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  className={inp}
                  placeholder="Explore our curated work across interiors, construction, supervision, and design execution."
                  value={draft.featured_listings_subtitle ?? ""}
                  onChange={upd("featured_listings_subtitle")}
                />
              </div>
            </div>

            {/* Interactive Category Selector & Card Image Editor */}
            <div className="border-t border-[#F0E6D6] pt-6">
              <div className="mb-4">
                <h3 className="font-serif text-lg font-bold text-[#2A1D13]">
                  Category Tab Showcase Cards & Images
                </h3>
                <p className="text-xs text-[#7A6B5D]">
                  Select a category tab below to preview and customize its 5 showcase cards, upload new photos, or edit titles.
                </p>
              </div>

              {/* Tab Pills */}
              <div className="flex flex-wrap gap-2 pb-2">
                {DEFAULT_FEATURED_CATEGORIES.map((cat) => {
                  const isSelected = cat.key === activeFeaturedCat;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveFeaturedCat(cat.key)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? "bg-[#B8894D] text-white shadow-xs font-semibold"
                          : "border border-[#DECDB3] bg-[#FAF5EB] text-[#5D4A36] hover:bg-[#F2E8D8]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* 5 Cards for Selected Category */}
              {(() => {
                const currentCat =
                  DEFAULT_FEATURED_CATEGORIES.find((c) => c.key === activeFeaturedCat) ||
                  DEFAULT_FEATURED_CATEGORIES[0];
                const overrides = parseOverrides(draft.featured_listings_cards);

                return (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentCat.cards.map((card, idx) => {
                      const key = `${currentCat.key}_${idx}`;
                      const ov = overrides[key] || {};
                      const currentImg =
                        ov.image && !ov.image.includes("unsplash.com")
                          ? ov.image
                          : card.image;
                      const currentTitle = ov.title ?? card.title;
                      const currentDesc = ov.description ?? card.description;
                      const currentTag = ov.tag ?? card.tag;
                      const isUploading = uploadingCardKey === key;

                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4 flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#D5C2A5] bg-black/5 mb-3">
                              <img
                                src={currentImg}
                                alt={currentTitle}
                                className="h-full w-full object-cover"
                              />
                              {currentTag && (
                                <span className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E9C98A] border border-[#C58B45]/40 bg-[#1a140e]/90 backdrop-blur-xs">
                                  {currentTag}
                                </span>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#735128]">
                                  Card Title
                                </label>
                                <input
                                  className="w-full rounded-md border border-[#DECDB3] bg-white px-2 py-1 text-xs text-[#2A1D13] font-semibold focus:border-accent focus:outline-none"
                                  value={currentTitle}
                                  onChange={(e) =>
                                    updateCardOverride(currentCat.key, idx, { title: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#735128]">
                                  Card Tag
                                </label>
                                <input
                                  className="w-full rounded-md border border-[#DECDB3] bg-white px-2 py-1 text-xs text-[#2A1D13] focus:border-accent focus:outline-none"
                                  value={currentTag}
                                  onChange={(e) =>
                                    updateCardOverride(currentCat.key, idx, { tag: e.target.value })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#735128]">
                                  Description
                                </label>
                                <input
                                  className="w-full rounded-md border border-[#DECDB3] bg-white px-2 py-1 text-xs text-[#2A1D13] focus:border-accent focus:outline-none"
                                  value={currentDesc}
                                  onChange={(e) =>
                                    updateCardOverride(currentCat.key, idx, { description: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#DECDB3]/60 space-y-2">
                            <label className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#DECDB3] bg-white px-3 py-1.5 text-xs font-semibold text-[#4A3B2C] hover:bg-[#F2E8D8] transition shadow-xs">
                              <Upload className="h-3 w-3 text-[#B8894D]" />
                              <span>{isUploading ? "Uploading…" : "Change Image"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploading}
                                onChange={(e) => {
                                  handleFeaturedCardUpload(currentCat.key, idx, e.target.files?.[0]);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                            <input
                              className="w-full rounded-lg border border-[#DECDB3] bg-white px-2 py-1 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none"
                              placeholder="…or paste image URL"
                              value={((ov.image?.includes("unsplash.com") ? "" : ov.image) ?? "")}
                              onChange={(e) =>
                                updateCardOverride(currentCat.key, idx, { image: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {/* SECTION 7: CONSULTATION CTA BANNER */}
        <section id="sec-cta" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 07</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Free Consultation Enquiry Banner
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Mid-page conversion banner driving user inquiries, cost estimations, and consultations.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Banner Headline
              </label>
              <input
                className={inp}
                placeholder="Looking For Expert Guidance To Design Your Dream Space?"
                value={draft.cta_title ?? ""}
                onChange={upd("cta_title")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Banner Subtitle / Description
              </label>
              <textarea
                rows={3}
                className={inp}
                placeholder="Share your requirements and our interior design team will help you plan a beautiful, functional, and personalized space."
                value={draft.cta_subtitle ?? ""}
                onChange={upd("cta_subtitle")}
              />
            </div>
          </div>
        </section>

        {/* SECTION 8: 5-STEP PROCESS */}
        <section id="sec-process" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 08</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Our Process Section (5 Execution Steps)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The 5-step numbered workflow timeline detailing your client journey from Understand to Deliver.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Process Eyebrow
                </label>
                <input
                  className={inp}
                  placeholder="Our process"
                  value={draft.process_eyebrow ?? ""}
                  onChange={upd("process_eyebrow")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                  Process Main Heading
                </label>
                <input
                  className={inp}
                  placeholder="Five steps. Zero surprises."
                  value={draft.process_title ?? ""}
                  onChange={upd("process_title")}
                />
              </div>
            </div>

            {/* 5 Steps Grid */}
            <div className="space-y-4 pt-2">
              {[
                { num: 1, titleKey: "process_step1_title", descKey: "process_step1_desc", defaultTitle: "Understand", defaultDesc: "We understand your lifestyle, preferences, space requirements, and budget." },
                { num: 2, titleKey: "process_step2_title", descKey: "process_step2_desc", defaultTitle: "Design", defaultDesc: "We create functional, elegant designs tailored to your vision." },
                { num: 3, titleKey: "process_step3_title", descKey: "process_step3_desc", defaultTitle: "Plan", defaultDesc: "Detailed drawings, material selection, costing, and execution planning." },
                { num: 4, titleKey: "process_step4_title", descKey: "process_step4_desc", defaultTitle: "Execute", defaultDesc: "Expert project management with strict quality and timeline control." },
                { num: 5, titleKey: "process_step5_title", descKey: "process_step5_desc", defaultTitle: "Deliver", defaultDesc: "A beautifully finished space, delivered on time and ready to enjoy." },
              ].map((st) => (
                <div key={st.num} className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4.5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2A1D13] text-white text-xs font-bold">
                      {st.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#735128]">Step 0{st.num}</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step {st.num} Title</label>
                      <input
                        className={inp}
                        placeholder={st.defaultTitle}
                        value={(draft as any)[st.titleKey] ?? ""}
                        onChange={upd(st.titleKey as any)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step {st.num} Description</label>
                      <textarea
                        rows={2}
                        className={inp}
                        placeholder={st.defaultDesc}
                        value={(draft as any)[st.descKey] ?? ""}
                        onChange={upd(st.descKey as any)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: CLIENT TESTIMONIALS */}
        <section id="sec-testimonials" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 09</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Client Testimonials (Luxury Marquee)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Header text for the scrolling luxury client reviews marquee.
              </p>
            </div>
            <Link
              to="/admin"
              className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[#DECDB3] bg-[#FAF5EB] px-3 py-1.5 text-xs font-medium text-[#4A3B2C] hover:bg-[#F2E8D8] transition"
            >
              <span>Manage Individual Reviews</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Written Testimonials Eyebrow
              </label>
              <input
                className={inp}
                placeholder="Kind words"
                value={draft.testimonials_eyebrow ?? ""}
                onChange={upd("testimonials_eyebrow")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Written Testimonials Heading
              </label>
              <input
                className={inp}
                placeholder="Trusted by homeowners and businesses who care about every detail."
                value={draft.testimonials_title ?? ""}
                onChange={upd("testimonials_title")}
              />
            </div>
          </div>
        </section>

        {/* SECTION 10: VIDEO TESTIMONIALS */}
        <section id="sec-videos" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 10</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Video Testimonials Section
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                Header text for the client video testimonials showcase.
              </p>
            </div>
            <Link
              to="/admin"
              className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[#DECDB3] bg-[#FAF5EB] px-3 py-1.5 text-xs font-medium text-[#4A3B2C] hover:bg-[#F2E8D8] transition"
            >
              <span>Manage Video Links</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Video Testimonials Eyebrow
              </label>
              <input
                className={inp}
                placeholder="Hear it firsthand"
                value={draft.video_section_eyebrow ?? ""}
                onChange={upd("video_section_eyebrow")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Video Testimonials Heading
              </label>
              <input
                className={inp}
                placeholder="Video testimonials"
                value={draft.video_section_title ?? ""}
                onChange={upd("video_section_title")}
              />
            </div>
          </div>
        </section>

        {/* SECTION 11: SERVICES ACCORDION */}
        <section id="sec-accordion" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 11</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Comprehensive Services Accordion (Bottom Showcase)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The expandable accordion section at the bottom of the homepage detailing specialized interior and architecture disciplines.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Eyebrow Badge
              </label>
              <input
                className={inp}
                placeholder="Our Services"
                value={draft.accordion_section_eyebrow ?? ""}
                onChange={upd("accordion_section_eyebrow")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Section Title
              </label>
              <input
                className={inp}
                placeholder="Crafting Bengaluru Spaces With Design, Precision & Execution"
                value={draft.accordion_section_title ?? ""}
                onChange={upd("accordion_section_title")}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5D4A36] mb-1.5">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                className={inp}
                placeholder="Explore our premium architecture, construction, supervision, and interior design services..."
                value={draft.accordion_section_subtitle ?? ""}
                onChange={upd("accordion_section_subtitle")}
              />
            </div>
          </div>
        </section>

      </main>

      {/* ── Floating Action Dock at Bottom ─────────────────────── */}
      <div className="fixed bottom-6 inset-x-0 z-40 px-4 pointer-events-none">
        <div className="max-w-xl mx-auto rounded-2xl border border-[#DECDB3] bg-[#221912]/92 backdrop-blur-md p-3.5 shadow-2xl flex items-center justify-between gap-3 text-white pointer-events-auto">
          <div className="flex items-center gap-2.5 pl-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isDirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            <span className="text-xs sm:text-sm font-medium text-[#F4ECE1]">
              {isDirty ? "Unsaved changes" : "All changes published"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              <span>View Site</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <button
              type="button"
              onClick={saveChanges}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#221912] shadow-sm transition disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #F5D399 0%, #D8A65D 100%)" }}
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving…" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
