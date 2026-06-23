"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { urlFor } from "@/lib/sanity/image";
import type { Sketch } from "@/types/sanity";

type SketchesStripProps = {
  sketches: Sketch[];
};

export default function SketchesStrip({ sketches }: SketchesStripProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const tween = gsap.from(headerRef.current, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !stripRef.current) return;

    drag.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: stripRef.current.scrollLeft,
    };
    stripRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !stripRef.current) return;

    const delta = e.pageX - drag.current.startX;
    stripRef.current.scrollLeft = drag.current.scrollLeft - delta;
  };

  const stopDragging = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !stripRef.current) return;

    drag.current.active = false;
    stripRef.current.releasePointerCapture(e.pointerId);
  };

  return (
    <section ref={sectionRef} className="bg-charcoal py-96">
      <div
        ref={headerRef}
        className="flex flex-col gap-16 px-24 md:flex-row md:items-end md:justify-between md:px-48"
      >
        <div>
          <p className="section-label !text-white/70">04 / Process</p>
          <h2 className="display-headline mt-16 text-[40px] text-white">
            Design begins by hand.
          </h2>
          <p className="mt-16 font-sans text-base text-white/55">
            Every project starts as a sketch.
          </p>
        </div>

        <Link
          href="/sketches"
          className="font-sans text-[13px] text-white underline-offset-4 hover:underline"
        >
          View all sketches →
        </Link>
      </div>

      <div
        ref={stripRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        className="mt-48 cursor-grab overflow-x-auto whitespace-nowrap px-24 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden md:px-48"
      >
        {sketches.map((sketch, index) => (
          <div
            key={sketch._id}
            className={`inline-block w-[220px] align-top md:w-[280px] ${index > 0 ? "ml-24" : ""}`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={urlFor(sketch.image).width(560).url()}
                alt={sketch.title}
                fill
                draggable={false}
                sizes="(min-width: 768px) 280px, 220px"
                className="object-contain"
              />
            </div>

            <p className="mt-16 font-sans text-[12px] text-white/60">
              {sketch.title}
              {sketch.year ? ` — ${sketch.year}` : ""}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
