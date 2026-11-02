"use client";

import { motion } from "framer-motion";
import SanityImage from "@/components/SanityImage";
import type { TeamMember } from "@/types/sanity";

type TeamCardProps = {
  member: TeamMember;
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

/**
 * A 4:5 portrait, greyscale until hovered (Framer Motion owns the colour
 * reveal, per AGENTS.md), with the name and role under it.
 *
 * The schema marks photo required, but the API doesn't enforce it, so a member
 * written by a script can arrive without one. They get a linen frame with
 * initials instead of taking the page down.
 */
export default function TeamCard({ member }: TeamCardProps) {
  return (
    <figure>
      {member.photo ? (
        <motion.div
          initial={{ filter: "grayscale(100%)" }}
          whileHover={{ filter: "grayscale(0%)" }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[4/5] overflow-hidden bg-linen"
        >
          <SanityImage
            source={member.photo}
            ratio={4 / 5}
            alt={member.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[4/5] items-center justify-center bg-linen text-[32px] text-stone"
        >
          {initials(member.name)}
        </div>
      )}

      <figcaption className="mt-16">
        <p className="text-[15px] font-medium text-ink">{member.name}</p>
        <p className="mt-4 text-[13px] text-stone">{member.role}</p>
      </figcaption>
    </figure>
  );
}
