import { type ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { FloatingContact } from "./floating-contact";
import { SocialMediaSection } from "./social-media-section";

export function SiteLayout({ children, transparentHeader = true }: { children: ReactNode; transparentHeader?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader transparent={transparentHeader} />
      <main className="flex-1">{children}</main>
      <SocialMediaSection />
      <SiteFooter />
      <FloatingContact />
    </div>
  );
}
