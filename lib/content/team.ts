import { sanityFetch } from "@/lib/sanity/client";
import * as queries from "@/lib/sanity/queries";
import type { TeamMember } from "@/types/sanity";

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  return sanityFetch<TeamMember[]>({ query: queries.getAllTeamMembers });
}
