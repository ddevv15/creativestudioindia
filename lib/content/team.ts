import { demoTeamMembers } from "@/lib/demoData";
import type { TeamMember } from "@/types/sanity";

/** GROQ: *[_type == "teamMember"] | order(order asc) */
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return [...demoTeamMembers].sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER),
  );
}
