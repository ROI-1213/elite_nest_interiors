import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

export function FloatingContact() {
  const { data: s } = useQuery(settingsQuery);
  const phone = s?.phone?.replace(/\s/g, "") || "+919364048269";

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-7 md:right-7">
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
