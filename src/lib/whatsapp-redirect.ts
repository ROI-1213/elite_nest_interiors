// Opens WhatsApp with a prefilled enquiry message directed to the sales number.
// Format: country-code + number, no spaces or symbols.
export const ENQUIRY_WHATSAPP_NUMBER = "919364048269"; // +91 93640 48269
export const FALLBACK_WA = "919364048269";             // same — used as fallback across all pages

export function redirectEnquiryToWhatsApp(fields: {
  name?: string;
  phone?: string;
  email?: string | null;
  service?: string | null;
  message?: string | null;
}) {
  const lines = [
    "Hi Elite Nest Interiors, I just submitted an enquiry on your website.",
    "",
    fields.name ? `Name: ${fields.name}` : null,
    fields.phone ? `Phone: ${fields.phone}` : null,
    fields.email ? `Email: ${fields.email}` : null,
    fields.service ? `Service: ${fields.service}` : null,
    fields.message ? `\n${fields.message}` : null,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  const url = `https://wa.me/${ENQUIRY_WHATSAPP_NUMBER}?text=${text}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
