import {
  updateSiteSettingsServerFn,
  saveServiceServerFn,
  deleteServiceServerFn,
  saveCategoryServerFn,
  deleteCategoryServerFn,
  saveGalleryItemServerFn,
  deleteGalleryItemServerFn,
  saveTestimonialServerFn,
  deleteTestimonialServerFn,
  saveVideoTestimonialServerFn,
  deleteVideoTestimonialServerFn,
  updateEnquiryStatusServerFn,
  updateEnquiryNotesServerFn,
  deleteEnquiryServerFn,
  uploadStorageFileServerFn,
} from "./server-functions";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("elite_admin_token") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function cleanErrorMessage(raw: any, fallback = "Operation failed. Please try again."): string {
  if (!raw) return fallback;
  const msg = typeof raw === "string" ? raw : raw.message || String(raw);
  if (
    msg.includes("<!doctype") ||
    msg.includes("<!DOCTYPE") ||
    msg.includes("<html") ||
    msg.includes("This page didn't load") ||
    msg.includes("Something went wrong on our end")
  ) {
    return "Server communication error. Changes may need to be re-submitted.";
  }
  return msg;
}

async function postApi<T = any>(endpoint: string, body: any): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(cleanErrorMessage(text, `Server error (${res.status})`));
  }

  const json = await res.json();
  if (json.success === false) {
    throw new Error(cleanErrorMessage(json.error, "Operation was not successful"));
  }
  return json as T;
}

async function deleteApi<T = any>(endpoint: string, body: any): Promise<T> {
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(cleanErrorMessage(text, `Server error (${res.status})`));
  }

  const json = await res.json();
  if (json.success === false) {
    throw new Error(cleanErrorMessage(json.error, "Delete failed"));
  }
  return json as T;
}

/* ==================== SITE SETTINGS ==================== */
export async function adminSaveSiteSettings(data: Record<string, any>) {
  try {
    return await postApi("/api/admin/site-settings", data);
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const { id, updated_at, ...rest } = data;
    const res = await updateSiteSettingsServerFn({ data: rest });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== SERVICES ==================== */
export async function adminSaveService(service: Record<string, any>) {
  try {
    return await postApi("/api/admin/services", service);
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await saveServiceServerFn({ data: service });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminDeleteService(id: string) {
  try {
    return await deleteApi("/api/admin/services", { id });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await deleteServiceServerFn({ data: { id } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== CATEGORIES ==================== */
export async function adminSaveCategory(category: Record<string, any>) {
  try {
    return await postApi("/api/admin/categories", category);
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await saveCategoryServerFn({ data: category });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminDeleteCategory(id: string) {
  try {
    return await deleteApi("/api/admin/categories", { id });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await deleteCategoryServerFn({ data: { id } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== GALLERY ==================== */
export async function adminSaveGalleryItem(item: Record<string, any>) {
  try {
    return await postApi("/api/admin/gallery", item);
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await saveGalleryItemServerFn({ data: item });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminDeleteGalleryItem(id: string) {
  try {
    return await deleteApi("/api/admin/gallery", { id });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await deleteGalleryItemServerFn({ data: { id } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== TESTIMONIALS ==================== */
export async function adminSaveTestimonial(testimonial: Record<string, any>) {
  try {
    return await postApi("/api/admin/testimonials", testimonial);
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await saveTestimonialServerFn({ data: testimonial });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminDeleteTestimonial(id: string) {
  try {
    return await deleteApi("/api/admin/testimonials", { id });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await deleteTestimonialServerFn({ data: { id } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== VIDEO TESTIMONIALS ==================== */
export async function adminSaveVideoTestimonial(video: Record<string, any>) {
  try {
    return await postApi("/api/admin/video-testimonials", video);
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await saveVideoTestimonialServerFn({ data: video });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminDeleteVideoTestimonial(id: string) {
  try {
    return await deleteApi("/api/admin/video-testimonials", { id });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await deleteVideoTestimonialServerFn({ data: { id } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== ENQUIRIES ==================== */
export async function adminUpdateEnquiryStatus(id: string, status: string) {
  try {
    return await postApi("/api/admin/enquiries/status", { id, status });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await updateEnquiryStatusServerFn({ data: { id, status } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminUpdateEnquiryNotes(id: string, admin_notes: string) {
  try {
    return await postApi("/api/admin/enquiries/notes", { id, admin_notes });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await updateEnquiryNotesServerFn({ data: { id, admin_notes } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

export async function adminDeleteEnquiry(id: string) {
  try {
    return await deleteApi("/api/admin/enquiries", { id });
  } catch (apiErr) {
    console.warn("[admin-api] Direct REST failed, falling back to serverFn:", apiErr);
    const res = await deleteEnquiryServerFn({ data: { id } });
    if ((res as any)?.success === false) {
      throw new Error(cleanErrorMessage((res as any)?.error));
    }
    return res;
  }
}

/* ==================== UPLOAD TO POSTGRESQL STORAGE ==================== */
export async function adminUploadFile(file: File, bucket = "general"): Promise<string> {
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

  const payload = {
    bucket,
    filename: file.name,
    mimeType,
    base64Data,
  };

  try {
    const res = await postApi<{ success: boolean; publicUrl: string }>("/api/admin/upload", payload);
    if (res?.publicUrl) return res.publicUrl;
  } catch (apiErr) {
    console.warn("[admin-api] Direct upload failed, falling back to serverFn:", apiErr);
  }

  const res = await uploadStorageFileServerFn({ data: payload });
  if (!res?.publicUrl) {
    throw new Error("Failed to save image to PostgreSQL storage.");
  }
  return res.publicUrl;
}
