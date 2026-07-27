"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

type Service = {
  number: string;
  name: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    number: "01",
    name: "Architecture",
    description:
      "Commercial, residential, and mixed-use design from concept to completion.",
  },
  {
    number: "02",
    name: "3D Visualization",
    description:
      "Photorealistic renders and walkthroughs that bring designs to life before they are built.",
  },
  {
    number: "03",
    name: "CAD & Documentation",
    description:
      "Precise technical drawings and construction documentation for every project stage.",
  },
];

export default function ServicesOverview() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".service-card");
    if (!cards?.length) return;

    const tween = gsap.from(cards, {
      y: 32,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 80%",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="bg-offwhite px-24 py-96 md:px-48">
      <p className="section-label">05 / Services</p>

      <h2 className="display-headline mt-16 text-[40px] text-ink">
        What we do.
      </h2>

      <div
        ref={gridRef}
        className="mt-48 grid grid-cols-1 gap-32 md:grid-cols-3"
      >
        {SERVICES.map((service) => (
          <div
            key={service.number}
            className="service-card border-t-[0.5px] border-stone/20 pt-24"
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.07em] text-stone">
              {service.number}
            </p>
            <h3 className="mt-16 font-sans text-[18px] font-medium text-ink">
              {service.name}
            </h3>
            <p className="mt-8 font-sans text-[14px] leading-[1.6] text-stone">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <Link
        href="/services"
        className="mt-48 block text-center font-sans text-[13px] text-ink underline-offset-4 hover:underline"
      >
        Explore our services →
      </Link>
    </section>
  );
}
