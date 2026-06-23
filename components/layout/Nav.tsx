"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/constants/nav";
import MobileNav from "./MobileNav";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: () => window.innerHeight,
      end: "max",
      onToggle: (self) => setScrolled(self.isActive),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 hidden h-96 items-center px-48 transition-colors duration-300 md:flex",
          scrolled ? "bg-ink border-b-[0.5px] border-white/10" : "bg-transparent"
        )}
      >
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wider text-white"
        >
          CREATIVE STUDIO
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-48">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b pb-8 font-sans text-[13px] text-white",
                  isActive ? "border-white" : "border-transparent"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="rounded-none border border-white px-24 py-8 font-sans text-[13px] text-white"
        >
          Start a project →
        </Link>
      </header>

      <MobileNav scrolled={scrolled} />
    </>
  );
}
