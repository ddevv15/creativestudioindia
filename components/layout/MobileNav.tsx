"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants/nav";

/** `solid` is owned by Nav — true unless the route has a dark hero to sit over. */
export default function MobileNav({
  solid,
  cloaked = false,
}: {
  solid: boolean;
  /** `cloaked` is owned by Nav — true while a route hides the bar entirely. */
  cloaked?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <header
        // Cloaked means unreachable, not just invisible. Never cloak while the
        // overlay is open, or the close button would vanish from under someone.
        inert={(cloaked && !open) || undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex h-nav items-center justify-between px-24 transition-[background-color,opacity,transform] duration-300",
          solid || open ? "bg-ink border-b-[0.5px] border-white/10" : "bg-transparent",
          cloaked && !open && "pointer-events-none -translate-y-full opacity-0"
        )}
      >
        <Link
          href="/"
          onClick={close}
          className="font-sans text-sm font-medium tracking-wider text-white"
        >
          CREATIVE STUDIO
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="text-white"
        >
          {open ? (
            <X size={18} strokeWidth={1.5} />
          ) : (
            <Menu size={18} strokeWidth={1.5} />
          )}
        </button>
      </header>

      <div
        className={cn(
          // pt-nav clears the bar above, which stays visible over the overlay.
          "fixed inset-0 z-40 flex flex-col bg-ink pt-nav transition-transform duration-300 ease-in-out",
          open ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav className="flex flex-col px-32">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="flex min-h-[44px] items-center border-b-[0.5px] border-white/[0.07] font-sans text-lg text-white/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          onClick={close}
          className="px-32 pt-32 font-sans text-lg font-medium text-white"
        >
          Start a project →
        </Link>
      </div>
    </div>
  );
}
