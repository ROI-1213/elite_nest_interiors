import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import { updateSiteSettingsServerFn, uploadStorageFileServerFn } from "@/lib/server-functions";
import { settingsQuery, type SiteSettings } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/home-editor")({
  head: () => ({ meta: [{ title: "Home Page Editor — Elite Nest Interiors" }] }),
  component: HomePageEditorPage,
});

const SECTIONS = [
  { id: "sec-hero", num: "01", name: "Hero Section" },
  { id: "sec-e2e", num: "02", name: "End-to-End Carousel" },
  { id: "sec-services-offer", num: "03", name: "Services We Offer" },
  { id: "sec-why-us", num: "04", name: "Why Choose Us" },
  { id: "sec-spaces", num: "05", name: "Interior Spaces" },
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
      path: `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
      contentType: file.type || "image/jpeg",
      base64Data,
    },
  });

  return res?.publicUrl ?? null;
}

function HomePageEditorPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(settingsQuery);
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
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
        toast.success("Hero image uploaded to storage.");
      }
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingHero(false);
    }
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
                  Home Page Editor
                </h1>
                <span className="rounded-full bg-[#EEDBBE] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#735128]">
                  Complete Suite
                </span>
              </div>
              <p className="text-xs text-[#7A6B5D] hidden md:block">
                Edit all 11 homepage sections in their exact visual display order
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
              <p className="mt-1 text-[11px] text-muted-foreground">Appears above the main headline in golden uppercase</p>
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
              <p className="mt-1 text-[11px] text-muted-foreground">Action button leading to the services showcase</p>
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
              <p className="mt-1 text-[11px] text-muted-foreground">
                Tip: The last line is automatically accented in elegant golden serif script.
              </p>
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
                  <div className="relative h-20 w-36 rounded-lg overflow-hidden border border-[#DECDB3] shadow-xs">
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
                placeholder="…or paste direct image URL (leaving blank defaults to luxury showroom)"
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

        {/* SECTION 3: SERVICES WE OFFER */}
        <section id="sec-services-offer" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 03</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Services We Offer (Interactive Split Showcase)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The split interactive showcase featuring category pills on the left and full-width imagery with descriptions on the right.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#F3ECE0] px-3 py-1 text-xs font-medium text-[#735128]">
              Live on /
            </span>
          </div>

          <div className="space-y-4">
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
                Section Subtitle / Description (Optional)
              </label>
              <textarea
                rows={2}
                className={inp}
                placeholder="From initial concept sketches to turnkey handover, we offer specialized architectural & interior design solutions..."
                value={draft.services_offer_subtitle ?? ""}
                onChange={upd("services_offer_subtitle")}
              />
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

        {/* SECTION 5: INTERIOR SPACES */}
        <section id="sec-spaces" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 05</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Interior Categories & Lifestyle Spaces (Coverflow Showcase)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The 3D coverflow showcase highlighting spaces like Bedroom, Modular Kitchen, Living, Dining, Wardrobe, and Foyer.
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
        </section>

        {/* SECTION 6: FEATURED LISTINGS */}
        <section id="sec-featured" className="rounded-2xl border border-[#E3D3BE] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 border-b border-[#F0E6D6] pb-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8894D]">Section 06</span>
              <h2 className="font-serif text-2xl font-bold text-[#2A1D13] mt-0.5">
                Featured Service Listings (Interactive Packages)
              </h2>
              <p className="text-xs sm:text-sm text-[#736353] mt-1">
                The interactive package showcase with filter pills (Turnkey, Residential, Commercial, Renovation, Structural, etc.).
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
              {/* Step 1 */}
              <div className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2A1D13] text-white text-xs font-bold">
                    1
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#735128]">Step 01</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 1 Title</label>
                    <input
                      className={inp}
                      placeholder="Understand"
                      value={draft.process_step1_title ?? ""}
                      onChange={upd("process_step1_title")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 1 Description</label>
                    <textarea
                      rows={2}
                      className={inp}
                      placeholder="We understand your lifestyle, preferences, space requirements, and budget."
                      value={draft.process_step1_desc ?? ""}
                      onChange={upd("process_step1_desc")}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2A1D13] text-white text-xs font-bold">
                    2
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#735128]">Step 02</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 2 Title</label>
                    <input
                      className={inp}
                      placeholder="Design"
                      value={draft.process_step2_title ?? ""}
                      onChange={upd("process_step2_title")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 2 Description</label>
                    <textarea
                      rows={2}
                      className={inp}
                      placeholder="We create functional, elegant designs tailored to your vision."
                      value={draft.process_step2_desc ?? ""}
                      onChange={upd("process_step2_desc")}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2A1D13] text-white text-xs font-bold">
                    3
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#735128]">Step 03</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 3 Title</label>
                    <input
                      className={inp}
                      placeholder="Plan"
                      value={draft.process_step3_title ?? ""}
                      onChange={upd("process_step3_title")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 3 Description</label>
                    <textarea
                      rows={2}
                      className={inp}
                      placeholder="Detailed drawings, material selection, costing, and execution planning."
                      value={draft.process_step3_desc ?? ""}
                      onChange={upd("process_step3_desc")}
                    />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2A1D13] text-white text-xs font-bold">
                    4
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#735128]">Step 04</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 4 Title</label>
                    <input
                      className={inp}
                      placeholder="Execute"
                      value={draft.process_step4_title ?? ""}
                      onChange={upd("process_step4_title")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 4 Description</label>
                    <textarea
                      rows={2}
                      className={inp}
                      placeholder="Expert project management with strict quality and timeline control."
                      value={draft.process_step4_desc ?? ""}
                      onChange={upd("process_step4_desc")}
                    />
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="rounded-xl border border-[#DECDB3] bg-[#FAF5EB] p-4.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#2A1D13] text-white text-xs font-bold">
                    5
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#735128]">Step 05</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 5 Title</label>
                    <input
                      className={inp}
                      placeholder="Deliver"
                      value={draft.process_step5_title ?? ""}
                      onChange={upd("process_step5_title")}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A3822] mb-1">Step 5 Description</label>
                    <textarea
                      rows={2}
                      className={inp}
                      placeholder="A beautifully finished space, delivered on time and ready to enjoy."
                      value={draft.process_step5_desc ?? ""}
                      onChange={upd("process_step5_desc")}
                    />
                  </div>
                </div>
              </div>
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
