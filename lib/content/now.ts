import { demoNowItems } from "@/lib/demoData";
import type { Now } from "@/types/sanity";

/** GROQ: *[_type == "now"] | order(date desc) */
export async function getAllNowItems(): Promise<Now[]> {
  return [...demoNowItems].sort((a, b) => b.date.localeCompare(a.date));
}
