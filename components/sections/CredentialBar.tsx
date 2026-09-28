"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Both numbers are the studio's own, from the portfolio profile (page 2):
// "With 35 years of experience... With 700+ projects".
//
// The trailing entries are disciplines, and they name the same six categories
// the work is filed under. Deliberately not derived from PROJECT_CATEGORIES:
// this is marketing copy about what the studio does, and the order and wording
// are chosen to read well aloud, not to mirror a filter UI.
const CREDENTIALS = [
  "35 Years",
  "700+ Projects",
  "Ahmedabad",
  "Architecture",
  "3D Visualization",
  "Commercial",
  "Mixed-Use",
  "Residential",
  "Institutional",
  "Private Residences",
  "Weekend Villas",
];

export default function CredentialBar() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.from(stripRef.current, {
      opacity: 0,
      y: 16,
      duration: 0.6,
      scrollTrigger: {
        trigger: stripRef.current,
        start: "top 90%",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={stripRef} className="bg-linen py-[14px]">
      <div className="flex items-center gap-16 overflow-x-auto whitespace-nowrap px-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center md:overflow-visible md:px-48">
        {CREDENTIALS.map((item, index) => (
          <Fragment key={item}>
            <span className="font-sans text-xs font-medium uppercase tracking-wider text-stone">
              {item}
            </span>
            {index < CREDENTIALS.length - 1 && (
              <span aria-hidden="true" className="text-stone">
                ·
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
