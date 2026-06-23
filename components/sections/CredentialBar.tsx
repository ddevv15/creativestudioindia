"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CREDENTIALS = [
  "25+ Years",
  "Ahmedabad",
  "Architecture",
  "3D Visualization",
  "Bungalows",
  "Residential",
  "Commercial",
  "Mixed-Use",
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
