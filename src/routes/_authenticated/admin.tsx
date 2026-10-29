import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Video,
  MessageSquare,
  Home,
  Info,
  PhoneCall,
  Briefcase,
  Images,
  Star,
  Settings,
  ExternalLink,
  Menu,
  X,
  Layers,
} from "lucide-react";
import { resolveGalleryImageUrl } from "@/lib/gallery.config";
import { resolveServiceImageUrl } from "@/lib/services.config";
import { resolveSpaceImageUrl, DEFAULT_SPACE_IMAGES } from "@/lib/spaces.config";
import {
  DEFAULT_FEATURED_CATEGORIES,
  parseOverrides,
  type CardOverride,
} from "@/lib/featured-listings.config";
import {
  saveGalleryItemServerFn,
  deleteGalleryItemServerFn,
  saveTestimonialServerFn,
  deleteTestimonialServerFn,
  saveVideoTestimonialServerFn,
  deleteVideoTestimonialServerFn,
  uploadStorageFileServerFn,
  updateSiteSettingsServerFn,
  saveServiceServerFn,
  deleteServiceServerFn,
  saveCategoryServerFn,
  deleteCategoryServerFn,
  updateEnquiryStatusServerFn,
  updateEnquiryNotesServerFn,
  deleteEnquiryServerFn,
} from "@/lib/server-functions";
import {
  categoriesQuery,
  enquiriesQuery,
  galleryQuery,
  servicesQuery,
  settingsQuery,
  testimonialsQuery,
  videoTestimonialsQuery,
  type Category,
  type Enquiry,
  type GalleryItem,
  type Service,
  type SiteSettings,
  type Testimonial,
  type VideoTestimonial,
} from "@/lib/queries";
import { getStoredAuth } from "./route";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Elite Nest Interior" }] }),
  component: AdminPage,
});

const TABS = [
  "Enquiries",
  "Homepage Content",
  "About Us Page",
  "Contact Page",
  "Services",
  "Service Categories",
  "Gallery",
  "Testimonials",
  "Video Testimonials",
  "Site Settings",
] as const;
type Tab = (typeof TABS)[number];

const TAB_ITEMS: { id: Tab; label: string; icon: any }[] = [
  { id: "Enquiries", label: "Enquiries", icon: MessageSquare },
  { id: "Homepage Content", label: "Home Page Editor", icon: Home },
  { id: "About Us Page", label: "About Us Page", icon: Info },
  { id: "Contact Page", label: "Contact Page", icon: PhoneCall },
  { id: "Services", label: "Services", icon: Briefcase },
  { id: "Service Categories", label: "Service Categories", icon: Layers },
  { id: "Gallery", label: "Gallery", icon: Images },
  { id: "Testimonials", label: "Testimonials", icon: Star },
  { id: "Video Testimonials", label: "Video Testimonials", icon: Video },
  { id: "Site Settings", label: "Site Settings", icon: Settings },
];

function AdminPage() {
  const ctx = Route.useRouteContext();
  const [tab, setTab] = useState<Tab>("Enquiries");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Client-side authentication state to prevent SSR false negatives
  const [auth, setAuth] = useState<{ user: { id: string; email: string }; isAdmin: boolean } | null>(() => {
    if (typeof window !== "undefined") {
      return getStoredAuth();
    }
    return null;
  });
  const [isVerifying, setIsVerifying] = useState(!auth?.isAdmin && !ctx.isAdmin);

  useEffect(() => {
    const current = getStoredAuth();
    if (!current || !current.isAdmin) {
      window.location.replace("/auth");
      return;
    }
    setAuth(current);
    setIsVerifying(false);
  }, []);

  async function signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("elite_admin_token");
      document.cookie = "elite_admin_token=; path=/; max-age=0; SameSite=Lax;";
      toast.success("Signed out successfully.");
      window.location.replace("/auth");
    }
  }

  const effectiveEmail = auth?.user?.email || ctx.user?.email || "elitenestinteriors@gmail.com";
  const hasAdmin = Boolean(auth?.isAdmin || ctx.isAdmin);

  if (isVerifying && !hasAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B8894D] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-[#8F8173] font-medium">
            Verifying Administrator Access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5D4BD] sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-base text-[#221912]">Elite Nest Interior</span>
          <span className="text-[10px] uppercase tracking-wider bg-[#B8894D]/15 text-[#9E6E34] px-2 py-0.5 rounded font-semibold">
            Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg border border-[#E5D4BD] text-[#6F6257] hover:bg-[#FAF6F0]"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-[#E5D4BD] flex flex-col transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-[#F0E6D8] bg-[#FAF6F0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9E6E34]">
                Admin Control Panel
              </p>
              <h2 className="font-serif text-lg font-semibold text-[#221912] mt-0.5">
                Elite Nest Interior
              </h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded text-[#8F8173] hover:text-[#221912]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#A89C91]">
            Content & Sections
          </p>
          {TAB_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                  active
                    ? "bg-[#B8894D] text-white shadow-sm font-semibold"
                    : "text-[#6F6257] hover:bg-[#FAF6F0] hover:text-[#221912]"
                }`}
              >
                <Icon className={`h-4 w-4 flex-none ${active ? "text-white" : "text-[#B8894D]"}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom account info & links */}
        <div className="p-4 border-t border-[#F0E6D8] bg-[#FAF6F0]/70 space-y-2.5">
          <div className="px-1">
            <p className="text-[10px] uppercase tracking-wider text-[#A89C91] font-semibold">Logged in as</p>
            <p className="text-xs font-medium text-[#221912] truncate mt-0.5" title={effectiveEmail}>
              {effectiveEmail}
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5D4BD] bg-white text-[11px] font-medium text-[#6F6257] hover:text-[#221912] transition shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Site
            </a>
            <button
              onClick={signOut}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50/70 text-[11px] font-medium text-red-700 hover:bg-red-100 transition cursor-pointer shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E5D4BD] sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div>
            <h1 className="font-serif text-2xl font-medium text-[#221912]">{tab}</h1>
            <p className="text-xs text-[#8F8173] mt-0.5">Manage and customize your studio's {tab.toLowerCase()}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#8F8173] hover:text-[#221912] font-medium px-3.5 py-1.5 rounded-lg border border-[#E5D4BD] bg-[#FAF6F0] hover:bg-[#F0E6D8] transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Website
            </a>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 text-xs text-red-700 hover:text-red-800 font-medium px-3.5 py-1.5 rounded-lg border border-red-200 bg-red-50/70 hover:bg-red-100 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {tab === "Enquiries" && <EnquiriesTab />}
          {tab === "Homepage Content" && <HomepageContentTab />}
          {tab === "About Us Page" && <AboutPageContentTab />}
          {tab === "Contact Page" && <ContactPageContentTab />}
          {tab === "Services" && <ServicesTab />}
          {tab === "Service Categories" && <CategoriesTab />}
          {tab === "Gallery" && <GalleryTab />}
          {tab === "Testimonials" && <TestimonialsTab />}
          {tab === "Video Testimonials" && <VideoTestimonialsTab />}
          {tab === "Site Settings" && <SiteSettingsTab />}
        </div>
      </main>
    </div>
  );
}

function TopBar({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container-prose flex h-16 items-center justify-between">
        <div>
          <p className="eyebrow">Admin Panel</p>
          <p className="text-sm font-medium text-foreground">Elite Nest Interior</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">{email}</span>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function formatErrorMessage(err: any, fallback = "An error occurred"): string {
  if (!err) return fallback;
  const msg = typeof err === "string" ? err : err?.message || String(err);
  if (
    msg.includes("<!doctype") ||
    msg.includes("<!DOCTYPE") ||
    msg.includes("<html") ||
    msg.includes("This page didn't load") ||
    msg.includes("Something went wrong on our end")
  ) {
    return "Server encountered an issue saving changes. Please try again.";
  }
  return msg || fallback;
}

/* -------------------- UPLOAD HELPER -------------------- */
async function uploadToStorage(file: File, bucket = "general"): Promise<string | null> {
  const mimeType = file.type || "image/jpeg";

  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });

  const res = await uploadStorageFileServerFn({
    data: {
      bucket,
      filename: file.name,
      mimeType,
      base64Data,
    },
  });

  return res?.publicUrl ?? null;
}

/* -------------------- HOMEPAGE CONTENT TAB -------------------- */
function HomepageContentTab() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const { data: services = [] } = useQuery(servicesQuery({ onlyActive: false }));

  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingSvcId, setUploadingSvcId] = useState<string | null>(null);
  const [uploadingSpaceKey, setUploadingSpaceKey] = useState<string | null>(null);
  const [activeFeaturedCat, setActiveFeaturedCat] = useState("turnkey");
  const [uploadingCardKey, setUploadingCardKey] = useState<string | null>(null);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  async function save() {
    if (!draft) return;
    const { id: _id, ...rest } = draft;
    try {
      const res = await updateSiteSettingsServerFn({ data: rest });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save homepage content."));
        return;
      }
      toast.success("Homepage content saved successfully!");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save homepage content."));
    }
  }

  async function handleHeroUpload(file?: File) {
    if (!file || !draft) return;
    setUploadingHero(true);
    try {
      const url = await uploadToStorage(file, "hero");
      if (url) {
        setDraft({ ...draft, hero_image_url: url });
        toast.success("Hero image uploaded to database.");
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleServiceUpload(service: any, file?: File) {
    if (!file) return;
    setUploadingSvcId(service.id);
    try {
      const url = await uploadToStorage(file, "services");
      if (url) {
        const res = await saveServiceServerFn({
          data: {
            ...service,
            image_url: url,
          },
        });
        if ((res as any)?.success === false) {
          toast.error(formatErrorMessage((res as any)?.error, "Failed to update image"));
          return;
        }
        qc.invalidateQueries({ queryKey: ["services"] });
        toast.success(`Image updated for "${service.title}"!`);
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
    } finally {
      setUploadingSvcId(null);
    }
  }

  async function handleServiceUrlUpdate(service: any, newUrl: string) {
    try {
      const res = await saveServiceServerFn({
        data: {
          ...service,
          image_url: newUrl.trim() || null,
        },
      });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to update image URL"));
        return;
      }
      qc.invalidateQueries({ queryKey: ["services"] });
      toast.success(`Image URL updated for "${service.title}"!`);
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Failed to update image URL"));
    }
  }

  async function handleSpaceUpload(field: keyof SiteSettings, spaceLabel: string, file?: File) {
    if (!file || !draft) return;
    setUploadingSpaceKey(String(field));
    try {
      const url = await uploadToStorage(file, "spaces");
      if (url) {
        setDraft({ ...draft, [field]: url });
        toast.success(`Image uploaded for ${spaceLabel}!`);
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
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
        toast.success("Card image updated!");
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
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
  }

  if (!draft) return <p className="text-sm text-muted-foreground">Loading homepage settings…</p>;

  const upd = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft({ ...draft, [k]: e.target.value });

  const defaultSpaceImages: Record<string, string> = DEFAULT_SPACE_IMAGES;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl text-foreground">Home Page Editor</h2>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
              Complete Suite
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage text, headlines, and all display images for all 11 homepage sections.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/home-editor"
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs sm:text-sm font-medium text-accent hover:bg-accent/20 transition"
          >
            <span>Open Dedicated Full-Page Editor</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-muted/50 transition"
          >
            <span>View Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={save}
            className="rounded-lg bg-primary px-5 py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            Save homepage changes
          </button>
        </div>
      </div>

      {/* 1. Hero Section */}
      <Card title="1. Hero Section (Above the Fold)">
        <p className="text-xs text-muted-foreground mb-4">
          The main welcome screen at the top of the homepage with luxury headline, background, and primary action.
        </p>
        <Grid>
          <Field label="Hero Eyebrow (Small top badge)">
            <input className={inp} placeholder="e.g. Crafting Spaces" value={draft.hero_eyebrow ?? ""} onChange={upd("hero_eyebrow")} />
          </Field>
          <Field label="Hero Button (CTA) Label">
            <input className={inp} placeholder="e.g. Explore Our Work" value={draft.hero_cta_label ?? ""} onChange={upd("hero_cta_label")} />
          </Field>
          <Field label="Hero Main Title (Use \n for a line break)" full>
            <textarea rows={2} className={inp} placeholder="Where Design Meets\nTimeless Living" value={draft.hero_title ?? ""} onChange={upd("hero_title")} />
          </Field>
          <Field label="Hero Subtitle" full>
            <textarea rows={3} className={inp} placeholder="Subtitle description..." value={draft.hero_subtitle ?? ""} onChange={upd("hero_subtitle")} />
          </Field>
          <Field label="Hero Background Image" full>
            <div className="flex flex-wrap items-center gap-3">
              {draft.hero_image_url && (
                <img src={draft.hero_image_url} alt="Hero" className="h-16 w-28 rounded object-cover border border-border" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                <Upload className="h-4 w-4" />
                {uploadingHero ? "Uploading…" : "Upload new image"}
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
              className={`${inp} mt-2`}
              placeholder="…or paste direct hero image URL"
              value={draft.hero_image_url ?? ""}
              onChange={upd("hero_image_url")}
            />
          </Field>
        </Grid>
      </Card>

      {/* 2. End-to-End Home Interior Services */}
      <Card title="2. End-to-End Home Interior Services (Infinite Carousel)">
        <p className="text-xs text-muted-foreground mb-4">
          The continuous auto-scrolling carousel showcasing our full spectrum of interior and construction services.
        </p>
        <Grid>
          <Field label="Eyebrow Badge">
            <input className={inp} placeholder="What we offer" value={draft.e2e_eyebrow ?? ""} onChange={upd("e2e_eyebrow")} />
          </Field>
          <Field label="Section Heading">
            <input className={inp} placeholder="Our End-to-End Home Interior Design Services In Bangalore" value={draft.e2e_title ?? ""} onChange={upd("e2e_title")} />
          </Field>
        </Grid>
      </Card>

      {/* 3. Services We Offer (With complete images & content editing) */}
      <Card title="3. Services We Offer (Interactive Split Showcase - Images & Content)">
        <p className="text-xs text-muted-foreground mb-4">
          The split interactive showcase featuring service category buttons on the left and dynamic full-width previews on the right. Edit the section headline and change the image for any of the 9 services below.
        </p>
        <Grid>
          <Field label="Section Title" full>
            <input className={inp} placeholder="Services We Offer" value={draft.services_offer_title ?? ""} onChange={upd("services_offer_title")} />
          </Field>
          <Field label="Section Subtitle" full>
            <textarea rows={2} className={inp} placeholder="From initial concept sketches to turnkey handover..." value={draft.services_offer_subtitle ?? ""} onChange={upd("services_offer_subtitle")} />
          </Field>
        </Grid>

        {/* 9 Services Images & Details */}
        <div className="mt-6 border-t border-border pt-5">
          <h4 className="font-serif text-base text-foreground mb-1">
            Service Items & Active Display Images
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            Each service is displayed in the split showcase. Click "Change Image" or paste a direct URL to update the photo shown when the user selects that service.
          </p>

          <div className="space-y-3">
            {services.map((svc: any) => {
              const currentImg = resolveServiceImageUrl(svc.title, svc.image_url);
              const isUploading = uploadingSvcId === svc.id;

              return (
                <div
                  key={svc.id}
                  className="rounded-lg border border-border/80 bg-background/50 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-16 w-24 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                      <img src={currentImg} alt={svc.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        /services/${svc.slug}
                      </span>
                      <h5 className="font-serif text-sm font-semibold text-foreground">
                        {svc.title}
                      </h5>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {svc.short_description || "Turnkey interior execution across Bengaluru"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 md:max-w-md w-full md:w-auto">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition">
                      <Upload className="h-3.5 w-3.5 text-accent" />
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
                      className="flex-1 md:w-48 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
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
      </Card>

      {/* 4. Why Choose Elite Nest */}
      <Card title="4. Why Choose Elite Nest (Comparison Matrix)">
        <p className="text-xs text-muted-foreground mb-4">
          Side-by-side comparison table contrasting traditional contractor firms with Elite Nest's transparent approach.
        </p>
        <Grid>
          <Field label="Section Title" full>
            <input className={inp} value={draft.why_us_title ?? ""} onChange={upd("why_us_title")} />
          </Field>
          <Field label="Traditional Firm Column Title">
            <input className={inp} value={draft.traditional_firm_title ?? ""} onChange={upd("traditional_firm_title")} />
          </Field>
          <Field label="Elite Nest Column Title">
            <input className={inp} value={draft.elitenest_title ?? ""} onChange={upd("elitenest_title")} />
          </Field>
          <Field label="Traditional Firm Points (one per line)" full>
            <textarea rows={6} className={inp} value={draft.traditional_firm_points ?? ""} onChange={upd("traditional_firm_points")} />
          </Field>
          <Field label="Elite Nest Points (one per line)" full>
            <textarea rows={6} className={inp} value={draft.elitenest_points ?? ""} onChange={upd("elitenest_points")} />
          </Field>
        </Grid>
      </Card>

      {/* 5. Interior Categories Showcase */}
      <Card title="5. Interior Categories & Lifestyle Spaces (Coverflow Showcase - Images & Content)">
        <p className="text-xs text-muted-foreground mb-4">
          The 3D coverflow showcase highlighting spaces like Bedroom, Modular Kitchen, Living, Dining, Wardrobe, and Foyer. Edit headers and custom room space images below.
        </p>
        <Grid>
          <Field label="Eyebrow Badge">
            <input className={inp} placeholder="Our Interior Expertise" value={draft.categories_section_eyebrow ?? ""} onChange={upd("categories_section_eyebrow")} />
          </Field>
          <Field label="Section Title">
            <input className={inp} placeholder="Spaces Designed Around Your Lifestyle" value={draft.categories_section_title ?? ""} onChange={upd("categories_section_title")} />
          </Field>
          <Field label="Section Subtitle" full>
            <textarea rows={2} className={inp} placeholder="Explore our curated interior solutions for every corner of your home." value={draft.categories_section_subtitle ?? ""} onChange={upd("categories_section_subtitle")} />
          </Field>
        </Grid>

        {/* 6 Space Room Images */}
        <div className="mt-6 border-t border-border pt-5">
          <h4 className="font-serif text-base text-foreground mb-1">
            Room Space Images (Coverflow Cards)
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            Upload new photos or paste image URLs for each of the 6 rooms.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                <div key={sp.key} className="rounded-lg border border-border/80 bg-background/50 p-3 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video w-full rounded overflow-hidden border border-border bg-muted mb-2">
                      <img src={currentVal} alt={sp.label} className="h-full w-full object-cover" />
                    </div>
                    <h5 className="font-serif text-xs font-semibold text-foreground">{sp.label}</h5>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <label className="w-full inline-flex cursor-pointer items-center justify-center gap-1.5 rounded border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition">
                      <Upload className="h-3 w-3 text-accent" />
                      <span>{isUploading ? "Uploading…" : "Upload Image"}</span>
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
                      className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
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
      </Card>

      {/* 6. Featured Service Listings */}
      <Card title="6. Featured Service Listings (Interactive Packages & Cards)">
        <p className="text-xs text-muted-foreground mb-4">
          The horizontal card carousel with category tabs (Turnkey, Residential, Commercial, Renovation, Structural, etc.). Edit headers, switch category tabs, and change card images/details below.
        </p>
        <Grid>
          <Field label="Eyebrow Badge">
            <input className={inp} placeholder="Featured Service Listings" value={draft.featured_listings_eyebrow ?? ""} onChange={upd("featured_listings_eyebrow")} />
          </Field>
          <Field label="Section Title">
            <input className={inp} placeholder="Featured Listings" value={draft.featured_listings_title ?? ""} onChange={upd("featured_listings_title")} />
          </Field>
          <Field label="Section Subtitle" full>
            <textarea rows={2} className={inp} placeholder="Explore our curated work across interiors, construction, supervision, and design execution." value={draft.featured_listings_subtitle ?? ""} onChange={upd("featured_listings_subtitle")} />
          </Field>
        </Grid>

        {/* Category Tabs & Cards Editor */}
        <div className="mt-6 border-t border-border pt-5">
          <h4 className="font-serif text-base text-foreground mb-1">
            Category Tab Showcase Cards & Images
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            Select a category tab to edit its 5 showcase cards, upload new photos, or edit titles.
          </p>

          {/* Tab selector */}
          <div className="flex flex-wrap gap-2 pb-2">
            {DEFAULT_FEATURED_CATEGORIES.map((cat) => {
              const isSelected = cat.key === activeFeaturedCat;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveFeaturedCat(cat.key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                      : "border border-border bg-background hover:bg-muted text-muted-foreground"
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
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="rounded-lg border border-border/80 bg-background/50 p-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video w-full rounded overflow-hidden border border-border bg-muted mb-2">
                          <img
                            src={currentImg}
                            alt={currentTitle}
                            className="h-full w-full object-cover"
                          />
                          {currentTag && (
                            <span className="absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent border border-accent/40 bg-background/90">
                              {currentTag}
                            </span>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Card Title
                            </label>
                            <input
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground font-medium focus:border-accent focus:outline-none"
                              value={currentTitle}
                              onChange={(e) =>
                                updateCardOverride(currentCat.key, idx, { title: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Card Tag
                            </label>
                            <input
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                              value={currentTag}
                              onChange={(e) =>
                                updateCardOverride(currentCat.key, idx, { tag: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Description
                            </label>
                            <input
                              className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                              value={currentDesc}
                              onChange={(e) =>
                                updateCardOverride(currentCat.key, idx, { description: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2.5 border-t border-border space-y-1.5">
                        <label className="w-full inline-flex cursor-pointer items-center justify-center gap-1.5 rounded border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition">
                          <Upload className="h-3 w-3 text-accent" />
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
                          className="w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
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
      </Card>

      {/* 7. Free Consultation CTA Banner */}
      <Card title="7. Free Consultation Enquiry Banner">
        <p className="text-xs text-muted-foreground mb-4">
          Mid-page call to action banner driving user inquiries and project consultations.
        </p>
        <Grid>
          <Field label="CTA Title" full>
            <input className={inp} value={draft.cta_title ?? ""} onChange={upd("cta_title")} />
          </Field>
          <Field label="CTA Subtitle" full>
            <textarea rows={3} className={inp} value={draft.cta_subtitle ?? ""} onChange={upd("cta_subtitle")} />
          </Field>
        </Grid>
      </Card>

      {/* 8. Our Process Section */}
      <Card title="8. Our Process Section (5 Execution Steps)">
        <p className="text-xs text-muted-foreground mb-4">
          The 5-step numbered workflow timeline detailing your client journey from Understand to Deliver.
        </p>
        <Grid>
          <Field label="Process Eyebrow">
            <input className={inp} placeholder="Our process" value={draft.process_eyebrow ?? ""} onChange={upd("process_eyebrow")} />
          </Field>
          <Field label="Process Main Heading">
            <input className={inp} placeholder="Five steps. Zero surprises." value={draft.process_title ?? ""} onChange={upd("process_title")} />
          </Field>

          {/* Step 1 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Step 01</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Step 1 Title">
                <input className={inp} placeholder="Understand" value={draft.process_step1_title ?? ""} onChange={upd("process_step1_title")} />
              </Field>
              <Field label="Step 1 Description">
                <textarea rows={2} className={inp} placeholder="Description..." value={draft.process_step1_desc ?? ""} onChange={upd("process_step1_desc")} />
              </Field>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Step 02</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Step 2 Title">
                <input className={inp} placeholder="Design" value={draft.process_step2_title ?? ""} onChange={upd("process_step2_title")} />
              </Field>
              <Field label="Step 2 Description">
                <textarea rows={2} className={inp} placeholder="Description..." value={draft.process_step2_desc ?? ""} onChange={upd("process_step2_desc")} />
              </Field>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Step 03</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Step 3 Title">
                <input className={inp} placeholder="Plan" value={draft.process_step3_title ?? ""} onChange={upd("process_step3_title")} />
              </Field>
              <Field label="Step 3 Description">
                <textarea rows={2} className={inp} placeholder="Description..." value={draft.process_step3_desc ?? ""} onChange={upd("process_step3_desc")} />
              </Field>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Step 04</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Step 4 Title">
                <input className={inp} placeholder="Execute" value={draft.process_step4_title ?? ""} onChange={upd("process_step4_title")} />
              </Field>
              <Field label="Step 4 Description">
                <textarea rows={2} className={inp} placeholder="Description..." value={draft.process_step4_desc ?? ""} onChange={upd("process_step4_desc")} />
              </Field>
            </div>
          </div>

          {/* Step 5 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">Step 05</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Step 5 Title">
                <input className={inp} placeholder="Deliver" value={draft.process_step5_title ?? ""} onChange={upd("process_step5_title")} />
              </Field>
              <Field label="Step 5 Description">
                <textarea rows={2} className={inp} placeholder="Description..." value={draft.process_step5_desc ?? ""} onChange={upd("process_step5_desc")} />
              </Field>
            </div>
          </div>
        </Grid>
      </Card>

      {/* 9. Client Testimonials */}
      <Card title="9. Client Testimonials (Luxury Marquee)">
        <p className="text-xs text-muted-foreground mb-4">
          Header text for the scrolling luxury client reviews marquee. To add, edit, or delete individual reviews, use the <strong>Testimonials</strong> tab in the sidebar.
        </p>
        <Grid>
          <Field label="Written Testimonials Eyebrow">
            <input className={inp} value={draft.testimonials_eyebrow ?? ""} onChange={upd("testimonials_eyebrow")} />
          </Field>
          <Field label="Written Testimonials Title">
            <input className={inp} value={draft.testimonials_title ?? ""} onChange={upd("testimonials_title")} />
          </Field>
        </Grid>
      </Card>

      {/* 10. Video Testimonials */}
      <Card title="10. Video Testimonials Section">
        <p className="text-xs text-muted-foreground mb-4">
          Header text for the client video testimonials section. To add YouTube/Vimeo video links or custom thumbnails, use the <strong>Video Testimonials</strong> tab in the sidebar.
        </p>
        <Grid>
          <Field label="Video Testimonials Eyebrow">
            <input className={inp} value={draft.video_section_eyebrow ?? ""} onChange={upd("video_section_eyebrow")} />
          </Field>
          <Field label="Video Testimonials Title">
            <input className={inp} value={draft.video_section_title ?? ""} onChange={upd("video_section_title")} />
          </Field>
        </Grid>
      </Card>

      {/* 11. Services Accordion Showcase */}
      <Card title="11. Comprehensive Services Accordion (Bottom Showcase)">
        <p className="text-xs text-muted-foreground mb-4">
          The expandable accordion section at the bottom of the homepage detailing specialized interior and architecture disciplines.
        </p>
        <Grid>
          <Field label="Eyebrow Badge">
            <input className={inp} placeholder="Our Services" value={draft.accordion_section_eyebrow ?? ""} onChange={upd("accordion_section_eyebrow")} />
          </Field>
          <Field label="Section Title">
            <input className={inp} placeholder="Crafting Bengaluru Spaces With Design, Precision & Execution" value={draft.accordion_section_title ?? ""} onChange={upd("accordion_section_title")} />
          </Field>
          <Field label="Section Subtitle" full>
            <textarea rows={2} className={inp} placeholder="Explore our premium architecture, construction, supervision, and interior design services..." value={draft.accordion_section_subtitle ?? ""} onChange={upd("accordion_section_subtitle")} />
          </Field>
        </Grid>
      </Card>

      <div className="flex justify-end pb-8">
        <button onClick={save} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
          Save homepage changes
        </button>
      </div>
    </div>
  );
}


/* -------------------- ABOUT US PAGE CONTENT TAB -------------------- */
function AboutPageContentTab() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  async function save() {
    if (!draft) return;
    const { id: _id, ...rest } = draft;
    try {
      const res = await updateSiteSettingsServerFn({ data: rest });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save About Us settings."));
        return;
      }
      toast.success("About Us page settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save About Us settings."));
    }
  }

  async function handleHeroUpload(file?: File) {
    if (!file || !draft) return;
    setUploadingHero(true);
    try {
      const url = await uploadToStorage(file, "about");
      if (url) {
        setDraft({ ...draft, about_image_url: url });
        toast.success("About Us hero image uploaded to database.");
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
    } finally {
      setUploadingHero(false);
    }
  }

  if (!draft) return <p className="text-sm text-muted-foreground">Loading About Us settings…</p>;

  const upd = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft({ ...draft, [k]: e.target.value });

  return (
    <div className="space-y-8">
      <SectionHead
        title="About Us Page Content"
        subtitle="Manage hero headline, brand story, 6 philosophy pillars, difference matrix, materials, trust stats, and closing CTA."
        action={
          <button
            onClick={save}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Save About Us changes
          </button>
        }
      />

      {/* 1. Hero Section */}
      <Card title="1. Hero Section (Above the Fold)">
        <Grid>
          <Field label="Hero Eyebrow">
            <input className={inp} value={draft.about_hero_eyebrow ?? ""} onChange={upd("about_hero_eyebrow")} />
          </Field>
          <Field label="Hero Main Title (Use \n for a line break)" full>
            <textarea rows={2} className={inp} value={draft.about_hero_title ?? ""} onChange={upd("about_hero_title")} />
          </Field>
          <Field label="Hero Subtitle" full>
            <textarea rows={3} className={inp} value={draft.about_hero_subtitle ?? ""} onChange={upd("about_hero_subtitle")} />
          </Field>
          <Field label="Positioning Card (Right Side, Use \n for a line break)" full>
            <textarea rows={2} className={inp} value={draft.about_positioning ?? ""} onChange={upd("about_positioning")} />
          </Field>
          <Field label="Hero Background Image" full>
            <div className="flex flex-wrap items-center gap-3">
              {draft.about_image_url && (
                <img src={draft.about_image_url} alt="About Hero" className="h-16 w-28 rounded object-cover border border-border" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                <Upload className="h-4 w-4" />
                {uploadingHero ? "Uploading…" : "Upload new image"}
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
              className={`${inp} mt-2`}
              placeholder="…or paste image URL"
              value={draft.about_image_url ?? ""}
              onChange={upd("about_image_url")}
            />
          </Field>
        </Grid>
      </Card>

      {/* 2. Why We Exist */}
      <Card title="2. Why We Exist Section">
        <Grid>
          <Field label="Eyebrow">
            <input className={inp} value={draft.about_why_eyebrow ?? ""} onChange={upd("about_why_eyebrow")} />
          </Field>
          <Field label="Main Heading">
            <input className={inp} value={draft.about_why_title ?? ""} onChange={upd("about_why_title")} />
          </Field>
          <Field label="Company Story / Content" full>
            <textarea rows={6} className={inp} value={draft.about_why_content ?? ""} onChange={upd("about_why_content")} />
          </Field>
        </Grid>
      </Card>

      {/* 3. Philosophy */}
      <Card title="3. Design Philosophy Section (6 Principles)">
        <Grid>
          <Field label="Philosophy Eyebrow">
            <input className={inp} value={draft.about_philosophy_eyebrow ?? ""} onChange={upd("about_philosophy_eyebrow")} />
          </Field>
          <Field label="Philosophy Heading">
            <input className={inp} value={draft.about_philosophy_title ?? ""} onChange={upd("about_philosophy_title")} />
          </Field>
          <Field label="Philosophy Subtitle" full>
            <textarea rows={2} className={inp} value={draft.about_philosophy_subtitle ?? ""} onChange={upd("about_philosophy_subtitle")} />
          </Field>

          {/* Principle 1 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">01 Principle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input className={inp} value={draft.about_phil1_title ?? ""} onChange={upd("about_phil1_title")} /></Field>
              <Field label="Description"><textarea rows={2} className={inp} value={draft.about_phil1_desc ?? ""} onChange={upd("about_phil1_desc")} /></Field>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">02 Principle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input className={inp} value={draft.about_phil2_title ?? ""} onChange={upd("about_phil2_title")} /></Field>
              <Field label="Description"><textarea rows={2} className={inp} value={draft.about_phil2_desc ?? ""} onChange={upd("about_phil2_desc")} /></Field>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">03 Principle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input className={inp} value={draft.about_phil3_title ?? ""} onChange={upd("about_phil3_title")} /></Field>
              <Field label="Description"><textarea rows={2} className={inp} value={draft.about_phil3_desc ?? ""} onChange={upd("about_phil3_desc")} /></Field>
            </div>
          </div>

          {/* Principle 4 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">04 Principle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input className={inp} value={draft.about_phil4_title ?? ""} onChange={upd("about_phil4_title")} /></Field>
              <Field label="Description"><textarea rows={2} className={inp} value={draft.about_phil4_desc ?? ""} onChange={upd("about_phil4_desc")} /></Field>
            </div>
          </div>

          {/* Principle 5 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">05 Principle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input className={inp} value={draft.about_phil5_title ?? ""} onChange={upd("about_phil5_title")} /></Field>
              <Field label="Description"><textarea rows={2} className={inp} value={draft.about_phil5_desc ?? ""} onChange={upd("about_phil5_desc")} /></Field>
            </div>
          </div>

          {/* Principle 6 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">06 Principle</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title"><input className={inp} value={draft.about_phil6_title ?? ""} onChange={upd("about_phil6_title")} /></Field>
              <Field label="Description"><textarea rows={2} className={inp} value={draft.about_phil6_desc ?? ""} onChange={upd("about_phil6_desc")} /></Field>
            </div>
          </div>
        </Grid>
      </Card>

      {/* 4. The Difference Comparison */}
      <Card title="4. The Difference (Comparison Matrix)">
        <Grid>
          <Field label="Section Eyebrow"><input className={inp} value={draft.about_diff_eyebrow ?? ""} onChange={upd("about_diff_eyebrow")} /></Field>
          <Field label="Section Main Title"><input className={inp} value={draft.about_diff_title ?? ""} onChange={upd("about_diff_title")} /></Field>
          <Field label="Traditional Firm Title"><input className={inp} value={draft.about_diff_trad_title ?? ""} onChange={upd("about_diff_trad_title")} /></Field>
          <Field label="Traditional Firm Subtitle"><input className={inp} value={draft.about_diff_trad_subtitle ?? ""} onChange={upd("about_diff_trad_subtitle")} /></Field>
          <Field label="Traditional Firm Points (one per line)" full>
            <textarea rows={6} className={inp} value={draft.about_diff_trad_points ?? ""} onChange={upd("about_diff_trad_points")} />
          </Field>
          <Field label="Elite Nest Title"><input className={inp} value={draft.about_diff_elite_title ?? ""} onChange={upd("about_diff_elite_title")} /></Field>
          <Field label="Elite Nest Subtitle"><input className={inp} value={draft.about_diff_elite_subtitle ?? ""} onChange={upd("about_diff_elite_subtitle")} /></Field>
          <Field label="Elite Nest Points (one per line)" full>
            <textarea rows={6} className={inp} value={draft.about_diff_elite_points ?? ""} onChange={upd("about_diff_elite_points")} />
          </Field>
        </Grid>
      </Card>

      {/* 5. Spaces We Build */}
      <Card title="5. Spaces We Build Section">
        <Grid>
          <Field label="Section Eyebrow"><input className={inp} value={draft.about_spaces_eyebrow ?? ""} onChange={upd("about_spaces_eyebrow")} /></Field>
          <Field label="Section Heading"><input className={inp} value={draft.about_spaces_title ?? ""} onChange={upd("about_spaces_title")} /></Field>
          <Field label="Description" full>
            <textarea rows={3} className={inp} value={draft.about_spaces_desc ?? ""} onChange={upd("about_spaces_desc")} />
          </Field>
        </Grid>
      </Card>

      {/* 6. Material & Build */}
      <Card title="6. Material & Build (6 Engineering Pillars)">
        <Grid>
          <Field label="Eyebrow"><input className={inp} value={draft.about_mat_eyebrow ?? ""} onChange={upd("about_mat_eyebrow")} /></Field>
          <Field label="Heading"><input className={inp} value={draft.about_mat_title ?? ""} onChange={upd("about_mat_title")} /></Field>
          <Field label="Description" full>
            <textarea rows={2} className={inp} value={draft.about_mat_desc ?? ""} onChange={upd("about_mat_desc")} />
          </Field>

          {/* Pillar 1 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pillar 1 Title"><input className={inp} value={draft.about_mat1_title ?? ""} onChange={upd("about_mat1_title")} /></Field>
              <Field label="Pillar 1 Description"><textarea rows={2} className={inp} value={draft.about_mat1_desc ?? ""} onChange={upd("about_mat1_desc")} /></Field>
            </div>
          </div>
          {/* Pillar 2 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pillar 2 Title"><input className={inp} value={draft.about_mat2_title ?? ""} onChange={upd("about_mat2_title")} /></Field>
              <Field label="Pillar 2 Description"><textarea rows={2} className={inp} value={draft.about_mat2_desc ?? ""} onChange={upd("about_mat2_desc")} /></Field>
            </div>
          </div>
          {/* Pillar 3 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pillar 3 Title"><input className={inp} value={draft.about_mat3_title ?? ""} onChange={upd("about_mat3_title")} /></Field>
              <Field label="Pillar 3 Description"><textarea rows={2} className={inp} value={draft.about_mat3_desc ?? ""} onChange={upd("about_mat3_desc")} /></Field>
            </div>
          </div>
          {/* Pillar 4 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pillar 4 Title"><input className={inp} value={draft.about_mat4_title ?? ""} onChange={upd("about_mat4_title")} /></Field>
              <Field label="Pillar 4 Description"><textarea rows={2} className={inp} value={draft.about_mat4_desc ?? ""} onChange={upd("about_mat4_desc")} /></Field>
            </div>
          </div>
          {/* Pillar 5 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pillar 5 Title"><input className={inp} value={draft.about_mat5_title ?? ""} onChange={upd("about_mat5_title")} /></Field>
              <Field label="Pillar 5 Description"><textarea rows={2} className={inp} value={draft.about_mat5_desc ?? ""} onChange={upd("about_mat5_desc")} /></Field>
            </div>
          </div>
          {/* Pillar 6 */}
          <div className="rounded-lg border border-border/80 bg-background/50 p-4 sm:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pillar 6 Title"><input className={inp} value={draft.about_mat6_title ?? ""} onChange={upd("about_mat6_title")} /></Field>
              <Field label="Pillar 6 Description"><textarea rows={2} className={inp} value={draft.about_mat6_desc ?? ""} onChange={upd("about_mat6_desc")} /></Field>
            </div>
          </div>
        </Grid>
      </Card>

      {/* 7. Trust & Stats */}
      <Card title="7. Trust Metrics & Commitments">
        <Grid>
          <Field label="Eyebrow"><input className={inp} value={draft.about_trust_eyebrow ?? ""} onChange={upd("about_trust_eyebrow")} /></Field>
          <Field label="Main Heading"><input className={inp} value={draft.about_trust_title ?? ""} onChange={upd("about_trust_title")} /></Field>

          {/* Stats 1 & 2 */}
          <Field label="Stat 1 Value (e.g. 100%)"><input className={inp} value={draft.about_stat1_val ?? ""} onChange={upd("about_stat1_val")} /></Field>
          <Field label="Stat 1 Label"><input className={inp} value={draft.about_stat1_label ?? ""} onChange={upd("about_stat1_label")} /></Field>
          <Field label="Stat 2 Value (e.g. On-time)"><input className={inp} value={draft.about_stat2_val ?? ""} onChange={upd("about_stat2_val")} /></Field>
          <Field label="Stat 2 Label"><input className={inp} value={draft.about_stat2_label ?? ""} onChange={upd("about_stat2_label")} /></Field>
          {/* Stats 3 & 4 */}
          <Field label="Stat 3 Value (e.g. Pan-India)"><input className={inp} value={draft.about_stat3_val ?? ""} onChange={upd("about_stat3_val")} /></Field>
          <Field label="Stat 3 Label"><input className={inp} value={draft.about_stat3_label ?? ""} onChange={upd("about_stat3_label")} /></Field>
          <Field label="Stat 4 Value (e.g. Concept → Keys)"><input className={inp} value={draft.about_stat4_val ?? ""} onChange={upd("about_stat4_val")} /></Field>
          <Field label="Stat 4 Label"><input className={inp} value={draft.about_stat4_label ?? ""} onChange={upd("about_stat4_label")} /></Field>

          <Field label="Commitments / Trust Points (one per line)" full>
            <textarea rows={6} className={inp} value={draft.about_trust_points ?? ""} onChange={upd("about_trust_points")} />
          </Field>
        </Grid>
      </Card>

      {/* 8. Closing CTA */}
      <Card title="8. Closing Consultation CTA Banner">
        <Grid>
          <Field label="Eyebrow"><input className={inp} value={draft.about_cta_eyebrow ?? ""} onChange={upd("about_cta_eyebrow")} /></Field>
          <Field label="Headline" full><input className={inp} value={draft.about_cta_title ?? ""} onChange={upd("about_cta_title")} /></Field>
          <Field label="Subtitle / Description" full><textarea rows={3} className={inp} value={draft.about_cta_desc ?? ""} onChange={upd("about_cta_desc")} /></Field>
          <Field label="Button Text"><input className={inp} value={draft.about_cta_button ?? ""} onChange={upd("about_cta_button")} /></Field>
        </Grid>
      </Card>

      <div className="flex justify-end pb-8">
        <button onClick={save} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
          Save About Us changes
        </button>
      </div>
    </div>
  );
}

/* -------------------- VIDEO TESTIMONIALS TAB -------------------- */
function VideoTestimonialsTab() {
  const qc = useQueryClient();
  const { data } = useQuery(videoTestimonialsQuery({ onlyActive: false }));
  const [editing, setEditing] = useState<Partial<VideoTestimonial> | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  async function save(v: Partial<VideoTestimonial>) {
    if (!v.title?.trim() || !v.video_url?.trim()) {
      return toast.error("Title and video URL are required.");
    }
    const payload = {
      id: v.id,
      title: v.title.trim(),
      author_name: v.author_name?.trim() || null,
      video_url: v.video_url.trim(),
      thumbnail_url: v.thumbnail_url?.trim() || null,
      display_order: v.display_order ?? 0,
      is_active: v.is_active ?? true,
    };
    try {
      const res = await saveVideoTestimonialServerFn({ data: payload });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save video testimonial."));
        return;
      }
      toast.success("Video testimonial saved.");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["video_testimonials"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save video testimonial."));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete video testimonial?")) return;
    try {
      const res = await deleteVideoTestimonialServerFn({ data: { id } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to delete video testimonial."));
        return;
      }
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["video_testimonials"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to delete video testimonial."));
    }
  }

  async function handleThumbUpload(file?: File) {
    if (!file || !editing) return;
    setUploadingThumb(true);
    try {
      const url = await uploadToStorage(file, "video-thumbs");
      if (url) {
        setEditing({ ...editing, thumbnail_url: url });
        toast.success("Thumbnail uploaded.");
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
    } finally {
      setUploadingThumb(false);
    }
  }

  async function swap(a: VideoTestimonial, b: VideoTestimonial) {
    try {
      await Promise.all([
        saveVideoTestimonialServerFn({ data: { ...a, display_order: b.display_order } }),
        saveVideoTestimonialServerFn({ data: { ...b, display_order: a.display_order } }),
      ]);
      qc.invalidateQueries({ queryKey: ["video_testimonials"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to reorder."));
    }
  }

  const items = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);

  return (
    <div>
      <SectionHead
        title="Video Testimonials"
        subtitle="Customer video walkthroughs and client stories shown on the homepage."
        action={
          <button
            onClick={() =>
              setEditing({
                display_order: items.length + 1,
                is_active: true,
              })
            }
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90 transition"
          >
            <Plus className="h-4 w-4" /> New Video
          </button>
        }
      />
      {items.length === 0 && <Empty label="No video testimonials yet." />}
      <div className="grid gap-3">
        {items.map((v, i) => (
          <div
            key={v.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
          >
            {v.thumbnail_url ? (
              <img
                src={v.thumbnail_url}
                alt={v.title}
                className="h-14 w-20 flex-none rounded object-cover"
              />
            ) : (
              <div className="flex h-14 w-20 flex-none items-center justify-center rounded bg-secondary text-xs text-muted-foreground">
                <Video className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{v.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {v.author_name ? `${v.author_name} · ` : ""}
                <a href={v.video_url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  {v.video_url}
                </a>
              </p>
            </div>
            <div className="flex items-center gap-1">
              {!v.is_active && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Inactive
                </span>
              )}
              <button
                disabled={i === 0}
                onClick={() => swap(v, items[i - 1])}
                className="rounded-md border border-border p-1.5 hover:border-accent disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                disabled={i === items.length - 1}
                onClick={() => swap(v, items[i + 1])}
                className="rounded-md border border-border p-1.5 hover:border-accent disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditing(v)}
                className="rounded-md border border-border p-1.5 hover:border-accent"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(v.id)}
                className="rounded-md border border-border p-1.5 text-destructive hover:border-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={editing.id ? "Edit video testimonial" : "New video testimonial"}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        >
          <Field label="Video Title" full>
            <input
              className={inp}
              placeholder="e.g. Modern Minimalist 4BHK Villa Walkthrough"
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </Field>
          <Field label="Author / Client Name">
            <input
              className={inp}
              placeholder="e.g. Rahul & Priya Sharma"
              value={editing.author_name ?? ""}
              onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
            />
          </Field>
          <Field label="Display Order">
            <input
              type="number"
              className={inp}
              value={editing.display_order ?? 0}
              onChange={(e) =>
                setEditing({ ...editing, display_order: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Video URL (YouTube, Vimeo, MP4)" full>
            <input
              className={inp}
              placeholder="https://www.youtube.com/watch?v=..."
              value={editing.video_url ?? ""}
              onChange={(e) => setEditing({ ...editing, video_url: e.target.value })}
            />
          </Field>
          <Field label="Thumbnail Cover Image" full>
            <div className="flex items-center gap-3">
              {editing.thumbnail_url && (
                <img
                  src={editing.thumbnail_url}
                  alt=""
                  className="h-16 w-24 flex-none rounded object-cover"
                />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                <Upload className="h-4 w-4" />
                {uploadingThumb ? "Uploading…" : "Upload cover image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleThumbUpload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <input
              className={`${inp} mt-2`}
              placeholder="…or paste image URL"
              value={editing.thumbnail_url ?? ""}
              onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })}
            />
          </Field>
          <Toggle
            checked={editing.is_active ?? true}
            onChange={(v) => setEditing({ ...editing, is_active: v })}
            label="Active (visible on website)"
          />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- ENQUIRIES -------------------- */
function EnquiriesTab() {
  const qc = useQueryClient();
  const { data, isLoading, refetch } = useQuery(enquiriesQuery());

  async function updateStatus(id: string, status: Enquiry["status"]) {
    try {
      const res = await updateEnquiryStatusServerFn({ data: { id, status } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to update status"));
        return;
      }
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["enquiries"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to update status"));
    }
  }
  async function updateNotes(id: string, admin_notes: string) {
    try {
      const res = await updateEnquiryNotesServerFn({ data: { id, admin_notes } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to update notes"));
        return;
      }
      qc.invalidateQueries({ queryKey: ["enquiries"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to update notes"));
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete enquiry?")) return;
    try {
      const res = await deleteEnquiryServerFn({ data: { id } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to delete enquiry"));
        return;
      }
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["enquiries"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to delete enquiry"));
    }
  }

  return (
    <div>
      <SectionHead
        title="Enquiries"
        subtitle="Manage leads submitted through contact and consultation forms."
        action={
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
          >
            Refresh
          </button>
        }
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading enquiries…</p>}
      {data?.length === 0 && <Empty label="No enquiries received yet." />}
      <div className="grid gap-3">
        {data?.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <p className="font-serif text-lg text-foreground">{e.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleString()} · via {e.source || "website"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={e.status}
                  onChange={(ev) => updateStatus(e.id, ev.target.value as Enquiry["status"])}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In progress</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
                <button onClick={() => remove(e.id)} className="rounded-md border border-border p-1.5 text-destructive hover:border-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-foreground/85 sm:grid-cols-3">
              <p><span className="text-muted-foreground">Phone:</span> <a className="hover:underline" href={`tel:${e.phone}`}>{e.phone}</a></p>
              {e.email && <p><span className="text-muted-foreground">Email:</span> <a className="hover:underline" href={`mailto:${e.email}`}>{e.email}</a></p>}
              {e.service_title && <p><span className="text-muted-foreground">Service:</span> {e.service_title}</p>}
            </div>
            {e.message && <p className="mt-3 whitespace-pre-line rounded-md bg-secondary p-3 text-sm">{e.message}</p>}
            <textarea
              defaultValue={e.admin_notes ?? ""}
              onBlur={(ev) => ev.target.value !== (e.admin_notes ?? "") && updateNotes(e.id, ev.target.value)}
              placeholder="Internal notes…"
              rows={2}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- CONTACT PAGE CONTENT TAB -------------------- */
function ContactPageContentTab() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  async function save() {
    if (!draft) return;
    const { id: _id, ...rest } = draft;
    try {
      const res = await updateSiteSettingsServerFn({ data: rest });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save Contact Page settings."));
        return;
      }
      toast.success("Contact Page settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save Contact Page settings."));
    }
  }

  async function handleHeroUpload(file?: File) {
    if (!file || !draft) return;
    setUploadingHero(true);
    try {
      const url = await uploadToStorage(file, "contact-hero");
      if (url) {
        setDraft({ ...draft, contact_hero_image_url: url });
        toast.success("Contact hero image uploaded.");
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
    } finally {
      setUploadingHero(false);
    }
  }

  if (!draft) return <p className="text-sm text-muted-foreground">Loading Contact Page settings…</p>;

  const upd = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft({ ...draft, [k]: e.target.value });

  return (
    <div className="space-y-8">
      <SectionHead
        title="Contact Page Content"
        subtitle="Manage business contact channels, hero headline & background image, 3 stat counters, enquiry guarantees, and Google Maps embed."
        action={
          <button
            onClick={save}
            className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Save Contact Page changes
          </button>
        }
      />

      {/* 1. Direct Contact Channels */}
      <Card title="1. Direct Contact Channels (Phone, WhatsApp, Email & Address)">
        <Grid>
          <Field label="Phone Number (Clickable tel:)">
            <input className={inp} placeholder="+91 93640 48269" value={draft.phone ?? ""} onChange={upd("phone")} />
          </Field>
          <Field label="WhatsApp Number (incl. country code)">
            <input className={inp} placeholder="+91 93640 48269" value={draft.whatsapp ?? ""} onChange={upd("whatsapp")} />
          </Field>
          <Field label="Contact Email Address">
            <input className={inp} placeholder="contact@elitenestinteriors.com" value={draft.email ?? ""} onChange={upd("email")} />
          </Field>
          <Field label="Business Hours">
            <input className={inp} placeholder="Mon–Sat · 10am – 7pm" value={draft.business_hours ?? ""} onChange={upd("business_hours")} />
          </Field>
          <Field label="Studio / Office Address" full>
            <textarea rows={2} className={inp} placeholder="Physical address..." value={draft.address ?? ""} onChange={upd("address")} />
          </Field>
          <Field label="Google Maps Location or Embed URL" full>
            <input className={inp} placeholder="https://maps.google.com/..." value={draft.google_map_url ?? ""} onChange={upd("google_map_url")} />
          </Field>
        </Grid>
      </Card>

      {/* 2. Hero Section */}
      <Card title="2. Hero Section (Above the Fold)">
        <Grid>
          <Field label="Hero Eyebrow">
            <input className={inp} placeholder="Get In Touch" value={draft.contact_hero_eyebrow ?? ""} onChange={upd("contact_hero_eyebrow")} />
          </Field>
          <Field label="Hero Title" full>
            <input className={inp} placeholder="Let's Build Something That Lasts." value={draft.contact_hero_title ?? ""} onChange={upd("contact_hero_title")} />
          </Field>
          <Field label="Hero Subtitle" full>
            <textarea rows={3} className={inp} placeholder="Description..." value={draft.contact_hero_subtitle ?? ""} onChange={upd("contact_hero_subtitle")} />
          </Field>
          <Field label="Hero Background Image" full>
            <div className="flex flex-wrap items-center gap-3">
              {draft.contact_hero_image_url && (
                <img src={draft.contact_hero_image_url} alt="" className="h-16 w-28 rounded object-cover border border-border" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                <Upload className="h-4 w-4" />
                {uploadingHero ? "Uploading…" : "Upload Hero Image"}
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
            <input className={`${inp} mt-2`} placeholder="…or paste image URL" value={draft.contact_hero_image_url ?? ""} onChange={upd("contact_hero_image_url")} />
          </Field>
          <Field label="CTA Button 1 Label">
            <input className={inp} placeholder="Book a Free Consultation" value={draft.contact_hero_cta1 ?? ""} onChange={upd("contact_hero_cta1")} />
          </Field>
          <Field label="CTA Button 2 Label">
            <input className={inp} placeholder="WhatsApp Us" value={draft.contact_hero_cta2 ?? ""} onChange={upd("contact_hero_cta2")} />
          </Field>
        </Grid>
      </Card>

      {/* 3. Stat Strip */}
      <Card title="3. Hero Trust Stats (3 Counters)">
        <Grid>
          <Field label="Stat 1 Value (e.g. 120+)">
            <input className={inp} value={draft.contact_stat1_val ?? ""} onChange={upd("contact_stat1_val")} />
          </Field>
          <Field label="Stat 1 Label (e.g. Projects Delivered)">
            <input className={inp} value={draft.contact_stat1_label ?? ""} onChange={upd("contact_stat1_label")} />
          </Field>
          <Field label="Stat 2 Value (e.g. 15+)">
            <input className={inp} value={draft.contact_stat2_val ?? ""} onChange={upd("contact_stat2_val")} />
          </Field>
          <Field label="Stat 2 Label (e.g. Years of Craft)">
            <input className={inp} value={draft.contact_stat2_label ?? ""} onChange={upd("contact_stat2_label")} />
          </Field>
          <Field label="Stat 3 Value (e.g. 24hr)">
            <input className={inp} value={draft.contact_stat3_val ?? ""} onChange={upd("contact_stat3_val")} />
          </Field>
          <Field label="Stat 3 Label (e.g. Response Time)">
            <input className={inp} value={draft.contact_stat3_label ?? ""} onChange={upd("contact_stat3_label")} />
          </Field>
        </Grid>
      </Card>

      {/* 4. Enquiry Section */}
      <Card title="4. Enquiry Section & Value Guarantees">
        <Grid>
          <Field label="Section Eyebrow">
            <input className={inp} value={draft.contact_enquiry_eyebrow ?? ""} onChange={upd("contact_enquiry_eyebrow")} />
          </Field>
          <Field label="Section Main Heading">
            <input className={inp} value={draft.contact_enquiry_title ?? ""} onChange={upd("contact_enquiry_title")} />
          </Field>
          <Field label="Section Subtitle / Description" full>
            <textarea rows={2} className={inp} value={draft.contact_enquiry_subtitle ?? ""} onChange={upd("contact_enquiry_subtitle")} />
          </Field>
          <Field label="Guarantee 1 (e.g. Free design consultation)">
            <input className={inp} value={draft.contact_guarantee1 ?? ""} onChange={upd("contact_guarantee1")} />
          </Field>
          <Field label="Guarantee 2 (e.g. Transparent quote within 48 hrs)">
            <input className={inp} value={draft.contact_guarantee2 ?? ""} onChange={upd("contact_guarantee2")} />
          </Field>
          <Field label="Guarantee 3 (e.g. Dedicated project manager)" full>
            <input className={inp} value={draft.contact_guarantee3 ?? ""} onChange={upd("contact_guarantee3")} />
          </Field>
        </Grid>
      </Card>

      {/* 5. Map Section */}
      <Card title="5. Google Maps Location Section">
        <Grid>
          <Field label="Section Eyebrow">
            <input className={inp} value={draft.contact_map_eyebrow ?? ""} onChange={upd("contact_map_eyebrow")} />
          </Field>
          <Field label="Section Main Heading">
            <input className={inp} value={draft.contact_map_title ?? ""} onChange={upd("contact_map_title")} />
          </Field>
        </Grid>
      </Card>

      <div className="flex justify-end pb-8">
        <button onClick={save} className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
          Save Contact Page changes
        </button>
      </div>
    </div>
  );
}

/* -------------------- CATEGORIES -------------------- */
function CategoriesTab() {
  const qc = useQueryClient();
  const { data } = useQuery(categoriesQuery({ onlyActive: false }));
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  async function save(c: Partial<Category>) {
    const name = c.name?.trim();
    const slug = c.slug?.trim();
    if (!name || !slug) return toast.error("Name and slug required.");
    const payload = {
      id: c.id,
      name,
      slug,
      description: c.description ?? null,
      image_url: c.image_url ?? null,
      display_order: c.display_order ?? 0,
      is_active: c.is_active ?? true,
    };
    try {
      const res = await saveCategoryServerFn({ data: payload });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save category"));
        return;
      }
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["service_categories"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save category"));
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete category?")) return;
    try {
      const res = await deleteCategoryServerFn({ data: { id } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to delete category"));
        return;
      }
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["service_categories"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to delete category"));
    }
  }

  return (
    <div>
      <SectionHead
        title="Service Categories"
        subtitle="Group services for navigation and showcase."
        action={
          <button
            onClick={() => setEditing({ display_order: (data?.length ?? 0) + 1, is_active: true })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New Category
          </button>
        }
      />
      {data?.length === 0 && <Empty label="No categories yet." />}
      <div className="grid gap-3">
        {data?.map((c) => (
          <Row key={c.id} title={c.name} subtitle={c.slug} active={c.is_active} onEdit={() => setEditing(c)} onDelete={() => remove(c.id)} />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit category" : "New category"} onClose={() => setEditing(null)} onSave={() => save(editing)}>
          <Field label="Name"><input className={inp} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
          <Field label="Slug"><input className={inp} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
          <Field label="Description"><textarea rows={3} className={inp} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          <Field label="Image URL">
            <div className="flex gap-2">
              <input
                className={inp}
                value={editing.image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                placeholder="https://... or upload photo"
              />
              <label className="flex-none inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5D4BD] bg-[#FAF6F0] hover:bg-[#F0E6D8] text-xs font-medium text-[#6F6257] cursor-pointer transition">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadToStorage(file, "categories");
                      if (url) {
                        setEditing({ ...editing, image_url: url });
                        toast.success("Category image uploaded!");
                      }
                    } catch (err: any) {
                      toast.error("Upload failed: " + err.message);
                    }
                  }}
                />
              </label>
            </div>
          </Field>
          <Field label="Display order"><input type="number" className={inp} value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
          <Toggle checked={editing.is_active ?? true} onChange={(v) => setEditing({ ...editing, is_active: v })} label="Active" />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- SERVICES -------------------- */
function ServicesTab() {
  const qc = useQueryClient();
  const { data } = useQuery(servicesQuery({ onlyActive: false }));
  const { data: cats } = useQuery(categoriesQuery({ onlyActive: false }));
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  async function save(s: Partial<Service>) {
    if (!s.title?.trim() || !s.slug?.trim()) return toast.error("Title and slug required.");
    const payload = {
      id: s.id,
      category_id: s.category_id || null,
      title: s.title.trim(),
      slug: s.slug.trim(),
      short_description: s.short_description ?? null,
      description: s.description ?? null,
      image_url: s.image_url ?? null,
      gallery: s.gallery ?? [],
      features: s.features ?? [],
      price_from: s.price_from ?? null,
      seo_title: s.seo_title ?? null,
      seo_description: s.seo_description ?? null,
      display_order: s.display_order ?? 0,
      is_active: s.is_active ?? true,
    };
    try {
      const res = await saveServiceServerFn({ data: payload });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save service"));
        return;
      }
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["services"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save service"));
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete service?")) return;
    try {
      const res = await deleteServiceServerFn({ data: { id } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to delete service"));
        return;
      }
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["services"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to delete service"));
    }
  }

  return (
    <div>
      <SectionHead
        title="Services"
        subtitle="Individual interior design and execution services shown across the site."
        action={
          <button
            onClick={() => setEditing({ display_order: (data?.length ?? 0) + 1, is_active: true, features: [], gallery: [] })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New Service
          </button>
        }
      />
      {data?.length === 0 && <Empty label="No services yet." />}
      <div className="grid gap-3">
        {data?.map((s) => (
          <Row key={s.id} title={s.title} subtitle={`Order: ${s.display_order} | /services/${s.slug}`} active={s.is_active} onEdit={() => setEditing(s)} onDelete={() => remove(s.id)} />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit service" : "New service"} onClose={() => setEditing(null)} onSave={() => save(editing)}>
          <Field label="Title"><input className={inp} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Slug"><input className={inp} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
          <Field label="Category">
            <select className={inp} value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}>
              <option value="">— None —</option>
              {cats?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Short description"><textarea rows={2} className={inp} value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} /></Field>
          <Field label="Full description"><textarea rows={5} className={inp} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          <Field label="Image URL">
            <div className="flex gap-2">
              <input
                className={inp}
                value={editing.image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                placeholder="https://... or upload photo"
              />
              <label className="flex-none inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5D4BD] bg-[#FAF6F0] hover:bg-[#F0E6D8] text-xs font-medium text-[#6F6257] cursor-pointer transition">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadToStorage(file, "services");
                      if (url) {
                        setEditing({ ...editing, image_url: url });
                        toast.success("Service image uploaded!");
                      }
                    } catch (err: any) {
                      toast.error("Upload failed: " + err.message);
                    }
                  }}
                />
              </label>
            </div>
          </Field>
          <Field label="Features (one per line)">
            <textarea rows={4} className={inp}
              value={(editing.features ?? []).join("\n")}
              onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
            />
          </Field>
          <Field label="Gallery image URLs (one per line)">
            <textarea rows={3} className={inp}
              value={(editing.gallery ?? []).join("\n")}
              onChange={(e) => setEditing({ ...editing, gallery: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
            />
          </Field>
          <Field label="SEO title"><input className={inp} value={editing.seo_title ?? ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} /></Field>
          <Field label="SEO description"><textarea rows={2} className={inp} value={editing.seo_description ?? ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} /></Field>
          <Field label="Display order"><input type="number" className={inp} value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
          <Toggle checked={editing.is_active ?? true} onChange={(v) => setEditing({ ...editing, is_active: v })} label="Active" />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- TESTIMONIALS -------------------- */
function TestimonialsTab() {
  const qc = useQueryClient();
  const { data } = useQuery(testimonialsQuery({ onlyActive: false }));
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  async function save(t: Partial<Testimonial>) {
    if (!t.author_name?.trim() || !t.content?.trim()) return toast.error("Name and content required.");
    const payload = {
      id: t.id,
      author_name: t.author_name.trim(),
      author_location: t.author_location ?? null,
      author_avatar_url: t.author_avatar_url ?? null,
      rating: t.rating ?? 5,
      content: t.content.trim(),
      service_type: t.service_type ?? null,
      project_image_url: t.project_image_url ?? null,
      display_order: t.display_order ?? 0,
      is_active: t.is_active ?? true,
    };
    try {
      const res = await saveTestimonialServerFn({ data: payload });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save testimonial."));
        return;
      }
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save testimonial."));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    try {
      const res = await deleteTestimonialServerFn({ data: { id } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to delete testimonial."));
        return;
      }
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to delete testimonial."));
    }
  }

  return (
    <div>
      <SectionHead
        title="Written Testimonials"
        subtitle="Manage client reviews and feedback shown on the website."
        action={
          <button
            onClick={() => setEditing({ rating: 5, display_order: (data?.length ?? 0) + 1, is_active: true })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> New Testimonial
          </button>
        }
      />
      {(!data || data.length === 0) && <Empty label="No testimonials yet." />}
      <div className="grid gap-3">
        {data?.map((t) => (
          <Row
            key={t.id}
            title={`${t.author_name} (${t.rating}★)`}
            subtitle={`${t.author_location ? `${t.author_location} · ` : ""}${t.service_type ? `${t.service_type} · ` : ""}"${t.content.slice(0, 70)}…"`}
            active={t.is_active}
            onEdit={() => setEditing(t)}
            onDelete={() => remove(t.id)}
          />
        ))}
      </div>
      {editing && (
        <Modal
          title={editing.id ? "Edit testimonial" : "New testimonial"}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        >
          <Field label="Client Name">
            <input
              className={inp}
              value={editing.author_name ?? ""}
              onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
            />
          </Field>
          <Field label="Location (e.g. Indiranagar, Bengaluru)">
            <input
              className={inp}
              value={editing.author_location ?? ""}
              onChange={(e) => setEditing({ ...editing, author_location: e.target.value })}
            />
          </Field>
          <Field label="Service Type (e.g. 3BHK Villa Interior)">
            <input
              className={inp}
              value={editing.service_type ?? ""}
              onChange={(e) => setEditing({ ...editing, service_type: e.target.value })}
            />
          </Field>
          <Field label="Rating (1 to 5)">
            <input
              type="number"
              min={1}
              max={5}
              className={inp}
              value={editing.rating ?? 5}
              onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
            />
          </Field>
          <Field label="Client Photo URL (optional)">
            <div className="flex gap-2">
              <input
                className={inp}
                placeholder="https://... or upload photo"
                value={editing.author_avatar_url ?? ""}
                onChange={(e) => setEditing({ ...editing, author_avatar_url: e.target.value })}
              />
              <label className="flex-none inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5D4BD] bg-[#FAF6F0] hover:bg-[#F0E6D8] text-xs font-medium text-[#6F6257] cursor-pointer transition">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadToStorage(file, "testimonials");
                      if (url) {
                        setEditing({ ...editing, author_avatar_url: url });
                        toast.success("Client photo uploaded!");
                      }
                    } catch (err: any) {
                      toast.error("Upload failed: " + err.message);
                    }
                  }}
                />
              </label>
            </div>
          </Field>
          <Field label="Project Photo URL (optional)">
            <div className="flex gap-2">
              <input
                className={inp}
                placeholder="https://... or upload photo"
                value={editing.project_image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, project_image_url: e.target.value })}
              />
              <label className="flex-none inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5D4BD] bg-[#FAF6F0] hover:bg-[#F0E6D8] text-xs font-medium text-[#6F6257] cursor-pointer transition">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadToStorage(file, "testimonials");
                      if (url) {
                        setEditing({ ...editing, project_image_url: url });
                        toast.success("Project photo uploaded!");
                      }
                    } catch (err: any) {
                      toast.error("Upload failed: " + err.message);
                    }
                  }}
                />
              </label>
            </div>
          </Field>
          <Field label="Content" full>
            <textarea
              rows={4}
              className={inp}
              value={editing.content ?? ""}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            />
          </Field>
          <Field label="Display Order">
            <input
              type="number"
              className={inp}
              value={editing.display_order ?? 0}
              onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
            />
          </Field>
          <Toggle
            checked={editing.is_active ?? true}
            onChange={(v) => setEditing({ ...editing, is_active: v })}
            label="Active"
          />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- SITE SETTINGS -------------------- */
function SiteSettingsTab() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  useEffect(() => { if (data && !draft) setDraft(data); }, [data, draft]);

  async function save() {
    if (!draft) return;
    const { id: _id, ...rest } = draft;
    try {
      const res = await updateSiteSettingsServerFn({ data: rest });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save settings."));
        return;
      }
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save settings."));
    }
  }

  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const upd = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft({ ...draft, [k]: e.target.value });

  return (
    <div className="space-y-8">
      <SectionHead
        title="Site Settings & Business Details"
        subtitle="Contact information, social profiles, Vision & Mission, and footer content."
        action={<button onClick={save} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Save changes</button>}
      />

      <Card title="Brand & Identity">
        <Grid>
          <Field label="Business name"><input className={inp} value={draft.business_name ?? ""} onChange={upd("business_name")} /></Field>
          <Field label="Tagline"><input className={inp} value={draft.tagline ?? ""} onChange={upd("tagline")} /></Field>
        </Grid>
      </Card>

      <Card title="Contact Details">
        <Grid>
          <Field label="Phone"><input className={inp} value={draft.phone ?? ""} onChange={upd("phone")} /></Field>
          <Field label="WhatsApp (incl. country code)"><input className={inp} value={draft.whatsapp ?? ""} onChange={upd("whatsapp")} /></Field>
          <Field label="Email"><input className={inp} value={draft.email ?? ""} onChange={upd("email")} /></Field>
          <Field label="Business hours"><input className={inp} value={draft.business_hours ?? ""} onChange={upd("business_hours")} /></Field>
          <Field label="Address" full><textarea rows={2} className={inp} value={draft.address ?? ""} onChange={upd("address")} /></Field>
          <Field label="Google Maps URL" full><input className={inp} value={draft.google_map_url ?? ""} onChange={upd("google_map_url")} /></Field>
        </Grid>
      </Card>

      <Card title="Social Links">
        <Grid>
          <Field label="Instagram"><input className={inp} value={draft.instagram_url ?? ""} onChange={upd("instagram_url")} /></Field>
          <Field label="Facebook"><input className={inp} value={draft.facebook_url ?? ""} onChange={upd("facebook_url")} /></Field>
          <Field label="YouTube"><input className={inp} value={draft.youtube_url ?? ""} onChange={upd("youtube_url")} /></Field>
          <Field label="LinkedIn"><input className={inp} value={draft.linkedin_url ?? ""} onChange={upd("linkedin_url")} /></Field>
          <Field label="Twitter / X"><input className={inp} value={draft.twitter_url ?? ""} onChange={upd("twitter_url")} /></Field>
          <Field label="Pinterest"><input className={inp} value={draft.pinterest_url ?? ""} onChange={upd("pinterest_url")} /></Field>
        </Grid>
      </Card>

      <Card title="Vision & Mission">
        <Grid>
          <Field label="Vision title"><input className={inp} value={draft.vision_title ?? ""} onChange={upd("vision_title")} /></Field>
          <Field label="Vision content" full><textarea rows={4} className={inp} value={draft.vision_content ?? ""} onChange={upd("vision_content")} /></Field>
          <Field label="Mission title"><input className={inp} value={draft.mission_title ?? ""} onChange={upd("mission_title")} /></Field>
          <Field label="Mission content" full><textarea rows={4} className={inp} value={draft.mission_content ?? ""} onChange={upd("mission_content")} /></Field>
        </Grid>
      </Card>

      <Card title="Footer">
        <Grid>
          <Field label="Footer about" full><textarea rows={3} className={inp} value={draft.footer_about ?? ""} onChange={upd("footer_about")} /></Field>
          <Field label="Copyright line" full><input className={inp} value={draft.footer_copyright ?? ""} onChange={upd("footer_copyright")} /></Field>
        </Grid>
      </Card>

      <div className="flex justify-end pb-8">
        <button onClick={save} className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground">Save changes</button>
      </div>
    </div>
  );
}

/* -------------------- GALLERY -------------------- */
const GALLERY_BUCKET = "gallery";

const GALLERY_CATEGORIES = [
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
];

function GalleryTab() {
  const qc = useQueryClient();
  const { data } = useQuery(galleryQuery({ onlyActive: false }));
  const { data: settingsData } = useQuery(settingsQuery);
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [pageSettings, setPageSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (settingsData && !pageSettings) setPageSettings(settingsData);
  }, [settingsData, pageSettings]);

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["gallery_items"] });
  }

  async function savePageSettings() {
    if (!pageSettings) return;
    const { id: _id, ...rest } = pageSettings;
    try {
      const res = await updateSiteSettingsServerFn({ data: rest });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save gallery page settings."));
        return;
      }
      toast.success("Gallery page settings saved successfully!");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save gallery page settings."));
    }
  }

  async function handleHeroUpload(file?: File) {
    if (!file || !pageSettings) return;
    setUploadingHero(true);
    try {
      const url = await uploadToStorage(file, "gallery-hero");
      if (url) {
        setPageSettings({ ...pageSettings, gallery_hero_image_url: url });
        toast.success("Gallery hero image uploaded.");
      }
    } catch (err: any) {
      toast.error(formatErrorMessage(err, "Upload failed"));
    } finally {
      setUploadingHero(false);
    }
  }

  async function uploadFile(file: File): Promise<string | null> {
    try {
      const url = await uploadToStorage(file, GALLERY_BUCKET);
      if (url) {
        toast.success("Image saved to database successfully.");
        return url;
      }
    } catch (err: any) {
      console.error("Storage upload failed:", err);
      toast.error(err?.message || "Failed to upload image.");
    }
    return null;
  }

  async function onFilePick(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (url) setEditing((prev) => ({ ...(prev ?? {}), image_url: url }));
  }

  async function quickUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    setUploading(false);
    if (!url) return;
    const nextOrder = (data?.length ?? 0) + 1;
    const item = {
      title: file.name.replace(/\.[^.]+$/, ""),
      image_url: url,
      category: "Residential Interiors",
      location: "Bengaluru",
      display_order: nextOrder,
      is_active: true,
    };
    try {
      const res = await saveGalleryItemServerFn({ data: item });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to upload image."));
        return;
      }
      toast.success("Uploaded and saved to gallery!");
      invalidate();
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to upload image."));
    }
  }

  async function save(g: Partial<GalleryItem>) {
    if (!g.title?.trim() || !g.image_url?.trim())
      return toast.error("Title and image required.");
    const payload = {
      id: g.id,
      title: g.title.trim(),
      category: g.category ?? null,
      location: g.location?.trim() || null,
      image_url: g.image_url.trim(),
      description: g.description ?? null,
      display_order: g.display_order ?? 0,
      is_active: g.is_active ?? true,
    };
    try {
      const res = await saveGalleryItemServerFn({ data: payload });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to save gallery item."));
        return;
      }
      toast.success("Saved gallery item");
      setEditing(null);
      invalidate();
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to save gallery item."));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete gallery item?")) return;
    try {
      const res = await deleteGalleryItemServerFn({ data: { id } });
      if ((res as any)?.success === false) {
        toast.error(formatErrorMessage((res as any)?.error, "Failed to delete gallery item."));
        return;
      }
      toast.success("Deleted");
      invalidate();
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to delete gallery item."));
    }
  }

  async function swap(a: GalleryItem, b: GalleryItem) {
    try {
      await Promise.all([
        saveGalleryItemServerFn({ data: { ...a, display_order: b.display_order } }),
        saveGalleryItemServerFn({ data: { ...b, display_order: a.display_order } }),
      ]);
      invalidate();
    } catch (e: any) {
      toast.error(formatErrorMessage(e, "Failed to reorder."));
    }
  }

  const items = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);

  const updPage = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (pageSettings) {
      setPageSettings({ ...pageSettings, [k]: e.target.value });
    }
  };

  return (
    <div className="space-y-8">
      {/* GALLERY PAGE SETTINGS */}
      {pageSettings && (
        <Card title="Gallery Page Settings (Headlines, Hero Image & CTAs)">
          <Grid>
            <Field label="Hero Title">
              <input className={inp} value={pageSettings.gallery_hero_title ?? ""} onChange={updPage("gallery_hero_title")} />
            </Field>
            <Field label="Hero Subtitle">
              <input className={inp} value={pageSettings.gallery_hero_subtitle ?? ""} onChange={updPage("gallery_hero_subtitle")} />
            </Field>
            <Field label="Hero Background Image" full>
              <div className="flex flex-wrap items-center gap-3">
                {pageSettings.gallery_hero_image_url && (
                  <img src={pageSettings.gallery_hero_image_url} alt="" className="h-16 w-28 rounded object-cover border border-border" />
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                  <Upload className="h-4 w-4" />
                  {uploadingHero ? "Uploading…" : "Upload Hero Image"}
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
              <input className={`${inp} mt-2`} placeholder="…or paste image URL" value={pageSettings.gallery_hero_image_url ?? ""} onChange={updPage("gallery_hero_image_url")} />
            </Field>
            <Field label="Featured Section Eyebrow">
              <input className={inp} value={pageSettings.gallery_featured_eyebrow ?? ""} onChange={updPage("gallery_featured_eyebrow")} />
            </Field>
            <Field label="Grid Eyebrow">
              <input className={inp} value={pageSettings.gallery_grid_eyebrow ?? ""} onChange={updPage("gallery_grid_eyebrow")} />
            </Field>
            <Field label="Grid Main Title">
              <input className={inp} value={pageSettings.gallery_grid_title ?? ""} onChange={updPage("gallery_grid_title")} />
            </Field>
            <Field label="Video Section Eyebrow">
              <input className={inp} value={pageSettings.gallery_video_eyebrow ?? ""} onChange={updPage("gallery_video_eyebrow")} />
            </Field>
            <Field label="Video Section Title">
              <input className={inp} value={pageSettings.gallery_video_title ?? ""} onChange={updPage("gallery_video_title")} />
            </Field>
            <Field label="CTA Headline">
              <input className={inp} value={pageSettings.gallery_cta_title ?? ""} onChange={updPage("gallery_cta_title")} />
            </Field>
            <Field label="CTA Subtitle" full>
              <textarea rows={2} className={inp} value={pageSettings.gallery_cta_subtitle ?? ""} onChange={updPage("gallery_cta_subtitle")} />
            </Field>
            <Field label="CTA Button 1 Label">
              <input className={inp} value={pageSettings.gallery_cta_btn1 ?? ""} onChange={updPage("gallery_cta_btn1")} />
            </Field>
            <Field label="CTA Button 2 Label">
              <input className={inp} value={pageSettings.gallery_cta_btn2 ?? ""} onChange={updPage("gallery_cta_btn2")} />
            </Field>
          </Grid>
          <div className="mt-4 flex justify-end">
            <button onClick={savePageSettings} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Save gallery page settings
            </button>
          </div>
        </Card>
      )}

      {/* PORTFOLIO ITEMS LIST */}
      <div>
        <SectionHead
          title="Portfolio Projects"
          subtitle="Manage all interior, construction, and architectural projects shown in the gallery."
          action={
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading…" : "Quick upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    quickUpload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                onClick={() =>
                  setEditing({ display_order: items.length + 1, is_active: true, category: "Residential Interiors" })
                }
                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4" /> New Project
              </button>
            </div>
          }
        />
        {items.length === 0 && <Empty label="No gallery items yet." />}
        <div className="grid gap-3">
          {items.map((g, i) => (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
            >
              <img
                src={resolveGalleryImageUrl(g)}
                alt={g.title}
                className="h-14 w-20 flex-none rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{g.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {g.category ?? "—"} {g.location ? `· ${g.location}` : ""} · order {g.display_order}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!g.is_active && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Inactive
                  </span>
                )}
                <button
                  disabled={i === 0}
                  onClick={() => swap(g, items[i - 1])}
                  className="rounded-md border border-border p-1.5 hover:border-accent disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  disabled={i === items.length - 1}
                  onClick={() => swap(g, items[i + 1])}
                  className="rounded-md border border-border p-1.5 hover:border-accent disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditing(g)}
                  className="rounded-md border border-border p-1.5 hover:border-accent"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(g.id)}
                  className="rounded-md border border-border p-1.5 text-destructive hover:border-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {editing && (
          <Modal
            title={editing.id ? "Edit gallery project" : "New gallery project"}
            onClose={() => setEditing(null)}
            onSave={() => save(editing)}
          >
            <Field label="Project Title" full>
              <input
                className={inp}
                placeholder="e.g. Modern Villa, Indiranagar"
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                className={inp}
                value={editing.category ?? "Residential Interiors"}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <input
                className={inp}
                placeholder="e.g. Indiranagar, Bengaluru"
                value={editing.location ?? ""}
                onChange={(e) => setEditing({ ...editing, location: e.target.value })}
              />
            </Field>
            <Field label="Project Image" full>
              <div className="flex items-center gap-3">
                {editing.image_url && (
                  <img
                    src={resolveGalleryImageUrl(editing)}
                    alt=""
                    className="h-16 w-24 flex-none rounded object-cover"
                  />
                )}
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      onFilePick(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              <input
                className={`${inp} mt-2`}
                placeholder="…or paste image URL"
                value={editing.image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
              />
            </Field>
            <Field label="Description" full>
              <textarea
                rows={3}
                className={inp}
                placeholder="Description of materials, finishes, or scope..."
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </Field>
            <Field label="Display order">
              <input
                type="number"
                className={inp}
                value={editing.display_order ?? 0}
                onChange={(e) =>
                  setEditing({ ...editing, display_order: Number(e.target.value) })
                }
              />
            </Field>
            <Toggle
              checked={editing.is_active ?? true}
              onChange={(v) => setEditing({ ...editing, is_active: v })}
              label="Active (visible on website)"
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

/* -------------------- SHARED UI -------------------- */
const inp = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20";

function SectionHead({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-serif text-2xl text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{label}</p>;
}

function Row({ title, subtitle, active, onEdit, onDelete }: { title: string; subtitle?: string; active?: boolean; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {!active && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">Inactive</span>}
        <button onClick={onEdit} className="rounded-md border border-border p-1.5 hover:border-accent"><Pencil className="h-4 w-4" /></button>
        <button onClick={onDelete} className="rounded-md border border-border p-1.5 text-destructive hover:border-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-medium text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-input" />
      {label}
    </label>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-serif text-lg text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Modal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}
