import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { settingsQuery } from "@/lib/queries";

export function FloatingActions() {
  const { data: settings } = useQuery(settingsQuery);
  const phone = settings?.phone ?? "+91 93640 48269";
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-[99] flex flex-col gap-3">
      <a
        href={`tel:${cleanPhone}`}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#1F1A16] text-white shadow-xl transition-transform hover:scale-110"
        aria-label="Call Us"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
