import Link from "next/link";
import { NAV_ITEMS } from "@/constants/nav";
import { SITE } from "@/constants/site";

// Touch screens get taller rows: stacked links 25px apart cannot each own a
// 44px target, so the tight drawing-board spacing stays for mouse users only.
const LINK = "hit-area [@media(pointer:coarse)]:py-[12px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone";

/**
 * Light footer (spec 0002). A rule split at the menu column, the wordmark on
 * the left, link columns, and "Back to top" on the right.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-gutter pb-24 pt-96 font-sans text-[13px] leading-[1.6] text-ink md:pt-128">
      <div className="grid grid-cols-1 gap-y-48 lg:grid-cols-[calc(var(--menu-x)-var(--gutter))_1fr]">
        <div className="border-t border-ink/20 pt-32 lg:mr-[10px]">
          <Link
            href="/"
            className="inline-block text-[28px] font-medium uppercase leading-[1.05] tracking-[0.02em]"
          >
            Creative
            <br />
            Studio
            <br />
            India
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-24 gap-y-48 border-t border-ink/20 pt-32 md:grid-cols-4">
          <nav aria-label="Footer" className="flex flex-col items-start gap-4">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={LINK}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-4">
            <a href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              LinkedIn
            </a>
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
              Instagram
            </a>
            <a
              href={`https://wa.me/${SITE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              WhatsApp
            </a>
          </div>

          <div className="flex flex-col items-start gap-4">
            <p className="max-w-[240px] text-stone">{SITE.address}</p>
            <a href={`tel:${SITE.phone}`} className={LINK}>
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className={LINK}>
              {SITE.email}
            </a>
          </div>

          <div className="md:text-right">
            <a href="#top" className={LINK}>
              Back to top ↑
            </a>
          </div>
        </div>
      </div>

      <p className="mt-64 border-t border-ink/10 pt-16 text-[12px] text-stone">
        Creative Studio India © {year}. All rights reserved.
      </p>
    </footer>
  );
}
