import { useQuery } from "@tanstack/react-query";
import { Phone, MessageCircle } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

export function FloatingContact() {
  const { data: s } = useQuery(settingsQuery);
  const wa = s?.whatsapp?.replace(/\D/g, "") || "919364048269";
  const phone = s?.phone?.replace(/\s/g, "");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full text-white shadow-luxe transition hover:scale-105"
        style={{ background: "#25D366" }}
      >
        <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ boxShadow: "0 0 0 0 rgba(37,211,102,0.55)" }} />
        <MessageCircle className="h-6 w-6" />
      </a>
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Call"
          className="grid h-12 w-12 place-items-center rounded-full text-white shadow-bronze transition hover:scale-105"
          style={{ background: "var(--gradient-bronze)" }}
        >
          <Phone className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
