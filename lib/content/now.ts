import { sanityFetch } from "@/lib/sanity/client";
import * as queries from "@/lib/sanity/queries";
import type { Now } from "@/types/sanity";

export async function getAllNowItems(): Promise<Now[]> {
  return sanityFetch<Now[]>({ query: queries.getAllNowItems });
}
