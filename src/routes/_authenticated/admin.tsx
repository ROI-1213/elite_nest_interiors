import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, RefreshCcw, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Elite Nest Interior" }] }),
  component: AdminPage,
});

const TABS = [
  "Enquiries",
  "Categories",
  "Services",
  "Gallery",
  "Testimonials",
  "Video Testimonials",
  "Site Settings",
] as const;
type Tab = (typeof TABS)[number];

function AdminPage() {
  const ctx = Route.useRouteContext();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Enquiries");

  useEffect(() => {
    if (!ctx.isAdmin) {
      toast.error("You need admin access. Ask the owner to grant your account the admin role.");
    }
  }, [ctx.isAdmin]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (!ctx.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar email={ctx.user.email ?? ""} onSignOut={signOut} />
        <div className="container-prose py-16">
          <div className="rounded-2xl border border-border bg-card p-8">
            <h1 className="font-serif text-2xl text-foreground">Access pending</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account ({ctx.user.email}) is signed in but doesn't yet have admin access.
              Ask the studio owner to run this once in the database:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4 text-xs">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${ctx.user.id}', 'admin');`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar email={ctx.user.email ?? ""} onSignOut={signOut} />
      <div className="container-prose py-8">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-border pb-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-md px-4 py-2 text-sm transition ${
                tab === t ? "bg-card font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Enquiries" && <EnquiriesTab />}
        {tab === "Categories" && <CategoriesTab />}
        {tab === "Services" && <ServicesTab />}
        {tab === "Gallery" && <GalleryTab />}
        {tab === "Testimonials" && <TestimonialsTab />}
        {tab === "Video Testimonials" && <VideoTestimonialsTab />}
        {tab === "Site Settings" && <SiteSettingsTab />}
      </div>
    </div>
  );
}

function TopBar({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container-prose flex h-16 items-center justify-between">
        <div>
          <p className="eyebrow">Admin</p>
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

/* -------------------- ENQUIRIES -------------------- */
function EnquiriesTab() {
  const qc = useQueryClient();
  const { data, isLoading, refetch } = useQuery(enquiriesQuery);

  async function updateStatus(id: string, status: Enquiry["status"]) {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  }
  async function updateNotes(id: string, admin_notes: string) {
    const { error } = await supabase.from("enquiries").update({ admin_notes }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  }

  return (
    <div>
      <SectionHead
        title="Enquiries"
        subtitle="Leads submitted from the website."
        action={
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        }
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {data && data.length === 0 && <Empty label="No enquiries yet." />}
      <div className="grid gap-4">
        {data?.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">{e.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleString()}
                  {e.source && <> · {e.source}</>}
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
      name,
      slug,
      description: c.description ?? null,
      image_url: c.image_url ?? null,
      display_order: c.display_order ?? 0,
      is_active: c.is_active ?? true,
    };
    const { error } = c.id
      ? await supabase.from("service_categories").update(payload).eq("id", c.id)
      : await supabase.from("service_categories").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["service_categories"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete category?")) return;
    const { error } = await supabase.from("service_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["service_categories"] });
  }

  return (
    <div>
      <SectionHead title="Service categories" subtitle="Group services for navigation."
        action={<button onClick={() => setEditing({ display_order: 0, is_active: true })} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> New</button>}
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
          <Field label="Image URL"><input className={inp} value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field>
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
    const { error } = s.id
      ? await supabase.from("services").update(payload).eq("id", s.id)
      : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["services"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["services"] });
  }

  return (
    <div>
      <SectionHead title="Services" subtitle="Individual services shown on the website."
        action={<button onClick={() => setEditing({ display_order: 0, is_active: true, features: [], gallery: [] })} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> New</button>}
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
          <Field label="Image URL"><input className={inp} value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></Field>
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
      author_name: t.author_name.trim(),
      author_location: t.author_location ?? null,
      author_avatar_url: t.author_avatar_url ?? null,
      rating: t.rating ?? 5,
      content: t.content.trim(),
      display_order: t.display_order ?? 0,
      is_active: t.is_active ?? true,
    };
    const { error } = t.id
      ? await supabase.from("testimonials").update(payload).eq("id", t.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["testimonials"] });
  }

  return (
    <div>
      <SectionHead title="Testimonials" action={<button onClick={() => setEditing({ rating: 5, display_order: 0, is_active: true })} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> New</button>} />
      {data?.length === 0 && <Empty label="No testimonials." />}
      <div className="grid gap-3">
        {data?.map((t) => (
          <Row key={t.id} title={t.author_name} subtitle={t.content.slice(0, 80) + "…"} active={t.is_active} onEdit={() => setEditing(t)} onDelete={() => remove(t.id)} />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit testimonial" : "New testimonial"} onClose={() => setEditing(null)} onSave={() => save(editing)}>
          <Field label="Author name"><input className={inp} value={editing.author_name ?? ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} /></Field>
          <Field label="Location"><input className={inp} value={editing.author_location ?? ""} onChange={(e) => setEditing({ ...editing, author_location: e.target.value })} /></Field>
          <Field label="Avatar URL"><input className={inp} value={editing.author_avatar_url ?? ""} onChange={(e) => setEditing({ ...editing, author_avatar_url: e.target.value })} /></Field>
          <Field label="Rating (1-5)"><input type="number" min={1} max={5} className={inp} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></Field>
          <Field label="Content"><textarea rows={4} className={inp} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></Field>
          <Field label="Display order"><input type="number" className={inp} value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
          <Toggle checked={editing.is_active ?? true} onChange={(v) => setEditing({ ...editing, is_active: v })} label="Active" />
        </Modal>
      )}
    </div>
  );
}

/* -------------------- VIDEO TESTIMONIALS -------------------- */
function VideoTestimonialsTab() {
  const qc = useQueryClient();
  const { data } = useQuery(videoTestimonialsQuery({ onlyActive: false }));
  const [editing, setEditing] = useState<Partial<VideoTestimonial> | null>(null);

  async function save(v: Partial<VideoTestimonial>) {
    if (!v.title?.trim() || !v.video_url?.trim()) return toast.error("Title and video URL required.");
    const payload = {
      title: v.title.trim(),
      author_name: v.author_name ?? null,
      video_url: v.video_url.trim(),
      thumbnail_url: v.thumbnail_url ?? null,
      display_order: v.display_order ?? 0,
      is_active: v.is_active ?? true,
    };
    const { error } = v.id
      ? await supabase.from("video_testimonials").update(payload).eq("id", v.id)
      : await supabase.from("video_testimonials").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["video_testimonials"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("video_testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["video_testimonials"] });
  }

  return (
    <div>
      <SectionHead title="Video testimonials" action={<button onClick={() => setEditing({ display_order: 0, is_active: true })} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> New</button>} />
      {data?.length === 0 && <Empty label="No video testimonials." />}
      <div className="grid gap-3">
        {data?.map((v) => (
          <Row key={v.id} title={v.title} subtitle={v.video_url} active={v.is_active} onEdit={() => setEditing(v)} onDelete={() => remove(v.id)} />
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit video testimonial" : "New video testimonial"} onClose={() => setEditing(null)} onSave={() => save(editing)}>
          <Field label="Title"><input className={inp} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <Field label="Author"><input className={inp} value={editing.author_name ?? ""} onChange={(e) => setEditing({ ...editing, author_name: e.target.value })} /></Field>
          <Field label="Video URL (YouTube/Vimeo)"><input className={inp} value={editing.video_url ?? ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} /></Field>
          <Field label="Thumbnail URL"><input className={inp} value={editing.thumbnail_url ?? ""} onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })} /></Field>
          <Field label="Display order"><input type="number" className={inp} value={editing.display_order ?? 0} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
          <Toggle checked={editing.is_active ?? true} onChange={(v) => setEditing({ ...editing, is_active: v })} label="Active" />
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
    const { error } = await supabase.from("site_settings").update(rest).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  }

  if (!draft) return <p className="text-sm text-muted-foreground">Loading…</p>;
  const upd = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDraft({ ...draft, [k]: e.target.value });

  return (
    <div className="space-y-8">
      <SectionHead title="Site settings" subtitle="Contact details, social links, About, Vision and footer content."
        action={<button onClick={save} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Save changes</button>} />

      <Card title="Brand">
        <Grid>
          <Field label="Business name"><input className={inp} value={draft.business_name ?? ""} onChange={upd("business_name")} /></Field>
          <Field label="Tagline"><input className={inp} value={draft.tagline ?? ""} onChange={upd("tagline")} /></Field>
        </Grid>
      </Card>

      <Card title="Contact details">
        <Grid>
          <Field label="Phone"><input className={inp} value={draft.phone ?? ""} onChange={upd("phone")} /></Field>
          <Field label="WhatsApp (incl. country code)"><input className={inp} value={draft.whatsapp ?? ""} onChange={upd("whatsapp")} /></Field>
          <Field label="Email"><input className={inp} value={draft.email ?? ""} onChange={upd("email")} /></Field>
          <Field label="Business hours"><input className={inp} value={draft.business_hours ?? ""} onChange={upd("business_hours")} /></Field>
          <Field label="Address" full><textarea rows={2} className={inp} value={draft.address ?? ""} onChange={upd("address")} /></Field>
          <Field label="Google Maps URL" full><input className={inp} value={draft.google_map_url ?? ""} onChange={upd("google_map_url")} /></Field>
        </Grid>
      </Card>

      <Card title="Social links">
        <Grid>
          <Field label="Instagram"><input className={inp} value={draft.instagram_url ?? ""} onChange={upd("instagram_url")} /></Field>
          <Field label="Facebook"><input className={inp} value={draft.facebook_url ?? ""} onChange={upd("facebook_url")} /></Field>
          <Field label="YouTube"><input className={inp} value={draft.youtube_url ?? ""} onChange={upd("youtube_url")} /></Field>
          <Field label="LinkedIn"><input className={inp} value={draft.linkedin_url ?? ""} onChange={upd("linkedin_url")} /></Field>
          <Field label="Twitter / X"><input className={inp} value={draft.twitter_url ?? ""} onChange={upd("twitter_url")} /></Field>
          <Field label="Pinterest"><input className={inp} value={draft.pinterest_url ?? ""} onChange={upd("pinterest_url")} /></Field>
        </Grid>
      </Card>

      <Card title="About">
        <Grid>
          <Field label="About title"><input className={inp} value={draft.about_title ?? ""} onChange={upd("about_title")} /></Field>
          <Field label="About image URL"><input className={inp} value={draft.about_image_url ?? ""} onChange={upd("about_image_url")} /></Field>
          <Field label="About content" full><textarea rows={5} className={inp} value={draft.about_content ?? ""} onChange={upd("about_content")} /></Field>
        </Grid>
      </Card>

      <Card title="Vision & Mission">
        <Grid>
          <Field label="Vision title"><input className={inp} value={draft.vision_title ?? ""} onChange={upd("vision_title")} /></Field>
          <Field label="Vision content" full><textarea rows={4} className={inp} value={draft.vision_content ?? ""} onChange={upd("vision_content")} /></Field>
          <Field label="Mission content" full><textarea rows={4} className={inp} value={draft.mission_content ?? ""} onChange={upd("mission_content")} /></Field>
        </Grid>
      </Card>

      <Card title="Footer">
        <Grid>
          <Field label="Footer about" full><textarea rows={3} className={inp} value={draft.footer_about ?? ""} onChange={upd("footer_about")} /></Field>
          <Field label="Copyright line" full><input className={inp} value={draft.footer_copyright ?? ""} onChange={upd("footer_copyright")} /></Field>
        </Grid>
      </Card>

      <div className="flex justify-end">
        <button onClick={save} className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground">Save changes</button>
      </div>
    </div>
  );
}

/* -------------------- GALLERY -------------------- */
const GALLERY_BUCKET = "gallery";

function GalleryTab() {
  const qc = useQueryClient();
  const { data } = useQuery(galleryQuery({ onlyActive: false }));
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [uploading, setUploading] = useState(false);

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["gallery_items"] });
  }

  async function uploadFile(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }
    const { data: pub } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
    return pub.publicUrl;
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
    const nextOrder = (data?.length ?? 0);
    const { error } = await supabase.from("gallery_items").insert({
      title: file.name.replace(/\.[^.]+$/, ""),
      image_url: url,
      display_order: nextOrder,
      is_active: true,
    });
    if (error) return toast.error(error.message);
    toast.success("Uploaded");
    invalidate();
  }

  async function save(g: Partial<GalleryItem>) {
    if (!g.title?.trim() || !g.image_url?.trim())
      return toast.error("Title and image required.");
    const payload = {
      title: g.title.trim(),
      category: g.category ?? null,
      image_url: g.image_url.trim(),
      description: g.description ?? null,
      display_order: g.display_order ?? 0,
      is_active: g.is_active ?? true,
    };
    const { error } = g.id
      ? await supabase.from("gallery_items").update(payload).eq("id", g.id)
      : await supabase.from("gallery_items").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    invalidate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function swap(a: GalleryItem, b: GalleryItem) {
    const { error } = await supabase.from("gallery_items").upsert([
      { ...a, display_order: b.display_order },
      { ...b, display_order: a.display_order },
    ]);
    if (error) return toast.error(error.message);
    invalidate();
  }

  const items = data ?? [];

  return (
    <div>
      <SectionHead
        title="Gallery"
        subtitle="Upload, edit and reorder gallery images."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Quick upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  quickUpload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              onClick={() =>
                setEditing({ display_order: items.length, is_active: true })
              }
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            >
              <Plus className="h-4 w-4" /> New
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
              src={g.image_url}
              alt={g.title}
              className="h-14 w-20 flex-none rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{g.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {g.category ?? "—"} · order {g.display_order}
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
          title={editing.id ? "Edit gallery item" : "New gallery item"}
          onClose={() => setEditing(null)}
          onSave={() => save(editing)}
        >
          <Field label="Title">
            <input
              className={inp}
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
          </Field>
          <Field label="Category">
            <input
              className={inp}
              value={editing.category ?? ""}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            />
          </Field>
          <Field label="Image" full>
            <div className="flex items-center gap-3">
              {editing.image_url && (
                <img
                  src={editing.image_url}
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
            label="Active"
          />
        </Modal>
      )}
    </div>
  );
}



/* -------------------- shared UI -------------------- */
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
