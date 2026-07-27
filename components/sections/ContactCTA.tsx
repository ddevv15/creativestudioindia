"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/constants/site";

export default function ContactCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headlineTween = gsap.from(headlineRef.current, {
      y: 32,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });

    const buttonsTween = gsap.from(buttonsRef.current, {
      y: 32,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });

    return () => {
      headlineTween.scrollTrigger?.kill();
      headlineTween.kill();
      buttonsTween.scrollTrigger?.kill();
      buttonsTween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink px-24 py-64 md:px-48 md:py-96">
      <div className="mx-auto max-w-[640px] text-center">
        <p className="section-label !text-white/40">06 / Contact</p>

        <h2
          ref={headlineRef}
          className="display-headline mt-16 text-[36px] text-white md:text-[52px]"
        >
          Have a project in mind?
        </h2>

        <p className="mt-16 font-sans text-[17px] text-white/60">
          Let&apos;s talk about what you want to build.
        </p>

        <div
          ref={buttonsRef}
          className="mt-32 flex flex-col items-center justify-center gap-16 md:flex-row"
        >
          <Link
            href="/contact"
            className="flex h-48 items-center justify-center bg-white px-32 font-sans text-[13px] text-ink transition-colors hover:bg-white/90"
          >
            Start a project →
          </Link>

          <a
            href={`tel:${SITE.phone}`}
            className="flex h-48 items-center justify-center border border-white px-32 font-sans text-[13px] text-white transition-colors hover:bg-white/10"
          >
            Call us →
          </a>
        </div>
      </div>
    </section>
  );
}
