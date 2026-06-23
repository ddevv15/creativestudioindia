"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { gsap } from "@/lib/gsap";
import type { SiteSettings } from "@/types/sanity";

type FounderBlockProps = Pick<SiteSettings, "principalPhoto" | "principalBio">;

export default function FounderBlock({
  principalPhoto,
  principalBio,
}: FounderBlockProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copyElements = copyRef.current?.children;
    if (!copyElements?.length) return;

    const photoTween = gsap.from(photoRef.current, {
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    const copyTween = gsap.from(copyElements, {
      x: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    return () => {
      photoTween.scrollTrigger?.kill();
      photoTween.kill();
      copyTween.scrollTrigger?.kill();
      copyTween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-linen">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div ref={photoRef} className="relative aspect-[4/5]">
          <Image
            src={principalPhoto.asset.url}
            alt="Jignesh Patel, principal architect"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div
          ref={copyRef}
          className="flex flex-col px-24 py-64 md:px-48 lg:justify-center lg:px-64 lg:py-0"
        >
          <p className="section-label">03 / Studio</p>

          <p className="mt-16 font-sans text-[13px] uppercase tracking-wider text-stone">
            Jignesh Patel
          </p>

          <h2 className="display-headline mt-8 text-[40px] text-ink">
            25 years of design. One principle.
          </h2>

          <div className="mt-24 font-sans text-base leading-[1.7] text-stone [&>p]:mb-16 [&>p:last-child]:mb-0">
            <PortableText value={principalBio.slice(0, 3)} />
          </div>

          <Link
            href="/about"
            className="mt-32 inline-block font-sans text-[13px] text-ink underline-offset-4 hover:underline"
          >
            Meet the studio →
          </Link>
        </div>
      </div>
    </section>
  );
}
