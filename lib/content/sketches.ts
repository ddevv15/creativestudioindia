import { sanityFetch } from "@/lib/sanity/client";
import * as queries from "@/lib/sanity/queries";
import type { Sketch } from "@/types/sanity";

export async function getAllSketches(): Promise<Sketch[]> {
  return sanityFetch<Sketch[]>({ query: queries.getAllSketches });
}
