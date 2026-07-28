"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
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

export default function TeamCard({ member }: TeamCardProps) {
  // No portrait photography exists yet, so demo members resolve to an empty
  // URL and fall back to a typographic block. When real photos land in Sanity
  // the Image branch takes over with no code change here.
  const src = urlFor(member.photo).width(600).height(600).fit("crop").url();

  return (
    <div>
      {src ? (
        <motion.div
          initial={{ filter: "grayscale(100%)" }}
          whileHover={{ filter: "grayscale(0%)" }}
          transition={{ duration: 0.3 }}
          className="relative aspect-square overflow-hidden"
        >
          <Image
            src={src}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ color: "#5F5E5A" }}
          whileHover={{ color: "#C0391B" }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
          className="flex aspect-square items-center justify-center bg-linen"
        >
          <span className="display-headline text-[40px]">
            {initials(member.name)}
          </span>
        </motion.div>
      )}

      <p className="mt-16 font-sans text-[14px] font-medium text-ink">
        {member.name}
      </p>
      <p className="mt-4 font-sans text-[12px] text-stone">{member.role}</p>
    </div>
  );
}
