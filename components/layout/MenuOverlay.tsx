"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MENU_ITEMS } from "@/constants/nav";
import { SITE } from "@/constants/site";
import SanityImage from "@/components/SanityImage";
import type { FeatureImage, MenuItem, NavItem } from "@/types";

/*
 * The reference sequence (spec 0002), kept in order but overlapped so the menu
 * is readable in about half the time. The reference waits for each stage to
 * finish, so its last row lands at about 1s, which felt laggy here.
 *   0–300ms    the panel drops in from above (strong ease-out)
 *   150–450ms  a cover wipes off the image panel to the right (ease-in-out)
 *   350ms on   the caption, then each row, slide 10px in (300ms, 40ms apart)
 * Closing only lifts the panel back up. Rows don't animate out.
 */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const DROP = 0.3;
const WIPE = 0.3;
const WIPE_DELAY = 0.15;
const ROWS_DELAY = 0.35;
const STAGGER = 0.04;

function isInternal(href: string) {
  return href.startsWith("/");
}

function MenuLink({
  item,
  onNavigate,
  className,
}: {
  item: NavItem;
  onNavigate: () => void;
  className: string;
}) {
  if (isInternal(item.href)) {
    return (
      <Link href={item.href} onClick={onNavigate} className={className}>
        {item.label}
      </Link>
    );
  }
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {item.label}
    </a>
  );
}

export default function MenuOverlay({
  open,
  onClose,
  feature,
  projectLinks,
}: {
  open: boolean;
  onClose: () => void;
  /** The image panel's project. Rotates per open, chosen by Nav. */
  feature?: FeatureImage;
  /** Featured project titles, shown as the Projects row's secondaries. */
  projectLinks: NavItem[];
}) {
  const reduce = useReducedMotion();

  const rows: MenuItem[] = MENU_ITEMS.map((item) =>
    item.href === "/projects" ? { ...item, sub: projectLinks } : item
  );

  // Each stage enters after the drop and the wipe have finished. With reduced
  // motion everything simply fades: no travel, no wipe.
  const stage = (index: number) =>
    reduce
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.2 },
        }
      : {
          initial: { opacity: 0, transform: "translateX(-10px)" },
          animate: { opacity: 1, transform: "translateX(0px)" },
          transition: {
            duration: 0.3,
            ease: EASE_OUT,
            delay: ROWS_DELAY + index * STAGGER,
          },
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={reduce ? { opacity: 0 } : { transform: "translateY(-100%)" }}
          animate={reduce ? { opacity: 1 } : { transform: "translateY(0%)" }}
          exit={reduce ? { opacity: 0 } : { transform: "translateY(-100%)" }}
          transition={{ duration: reduce ? 0.2 : DROP, ease: EASE_OUT }}
          className="fixed inset-0 z-[55] flex bg-offwhite"
        >
          {feature && (
            <div className="relative hidden h-full w-[var(--menu-x)] shrink-0 overflow-hidden bg-stone lg:block">
              <SanityImage
                source={feature.image}
                alt=""
                fill
                sizes="max(27vw, 320px)"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent" />

              <motion.div
                {...stage(0)}
                className="absolute inset-x-gutter bottom-[88px] text-offwhite"
              >
                {feature.location && (
                  <p className="font-mono text-[12px] leading-[1.3] text-offwhite/80">
                    {feature.location}
                  </p>
                )}
                {feature.href ? (
                  <Link
                    href={feature.href}
                    onClick={onClose}
                    className="mt-4 block text-[17px] uppercase leading-[1.3]"
                  >
                    {feature.title}
                  </Link>
                ) : (
                  <p className="mt-4 text-[17px] uppercase leading-[1.3]">{feature.title}</p>
                )}
              </motion.div>

              {/* The cover that wipes off to reveal the photograph. */}
              {!reduce && (
                <motion.div
                  aria-hidden="true"
                  initial={{ transform: "translateX(0%)" }}
                  animate={{ transform: "translateX(100%)" }}
                  transition={{ duration: WIPE, ease: EASE_IN_OUT, delay: WIPE_DELAY }}
                  className="absolute inset-0 bg-offwhite"
                />
              )}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-gutter pb-24 pt-nav md:pl-[calc(var(--menu-x)+10px)] lg:pl-[10px]">
            {/* Below lg the image panel is gone, so the featured project sits at
                the top of the sheet instead of leaving it empty. */}
            {feature && (
              <motion.figure {...stage(0)} className="mt-24 lg:hidden">
                <div className="relative aspect-[16/9] max-h-[32svh] w-full overflow-hidden bg-linen">
                  <SanityImage
                    source={feature.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 70vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-8">
                  {feature.location && <span className="caption-mono block">{feature.location}</span>}
                  {feature.href ? (
                    <Link href={feature.href} onClick={onClose} className="hit-area mt-4 inline-block text-[15px] uppercase leading-[1.3] text-ink">
                      {feature.title}
                    </Link>
                  ) : (
                    <span className="mt-4 block text-[15px] uppercase leading-[1.3] text-ink">{feature.title}</span>
                  )}
                </figcaption>
              </motion.figure>
            )}
            <nav aria-label="Menu" className="mt-auto pt-48">
              <ul>
                {rows.map((row, index) => (
                  <motion.li
                    key={row.href}
                    {...stage(index + 1)}
                    className="flex flex-wrap items-baseline gap-x-16 gap-y-4 py-[9px] text-[20px] leading-[1.35] md:text-[22px]"
                  >
                    <MenuLink
                      item={row}
                      onNavigate={onClose}
                      className="flex min-h-[44px] items-center text-ink underline decoration-1 underline-offset-[7px] transition-colors duration-200 hover:text-stone"
                    />
                    {row.sub && (
                      // Small uppercase labels with space between them, not a
                      // comma run-on: the project names arrive in mixed case.
                      <span className="flex flex-wrap gap-x-16 gap-y-8 text-[13px] uppercase leading-[1.5] tracking-[0.04em] text-stone">
                        {row.sub.map((sub) => (
                          <MenuLink
                            key={sub.href}
                            item={sub}
                            onNavigate={onClose}
                            className="hit-area transition-colors duration-200 hover:text-ink"
                          />
                        ))}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              {...stage(rows.length + 1)}
              className="mt-32 grid grid-cols-1 gap-16 font-sans text-[13px] text-ink md:grid-cols-[2fr_1fr] md:gap-[10px]"
            >
              <p className="border-t border-ink/20 pt-16 text-stone">
                Ahmedabad, India · {SITE.phone}
              </p>
              <div className="flex gap-16 border-t border-ink/20 pt-16 md:justify-end">
                <a href={SITE.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-stone">
                  LinkedIn
                </a>
                <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-stone">
                  Instagram
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
