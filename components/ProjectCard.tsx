"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import type { Project } from "@/types/sanity";

type ProjectCardProps = Omit<Project, "_id">;

export default function ProjectCard({
  title,
  slug,
  category,
  coverImage,
}: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/projects/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="project-card group block"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={urlFor(coverImage).width(900).height(600).fit("crop").url()}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform [transition-duration:400ms] [transition-timing-function:ease] md:group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/65" />

        <div className="absolute inset-x-0 bottom-0 p-16">
          <p className="relative inline-block font-sans text-[14px] font-medium text-white">
            {title}
            <motion.span
              aria-hidden="true"
              initial={{ width: "0%" }}
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute bottom-0 left-0 border-b border-white"
            />
          </p>
          <p className="mt-4 font-sans text-[11px] text-white/60">
            {category}
          </p>
        </div>
      </div>
    </Link>
  );
}
