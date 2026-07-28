import { demoSketches } from "@/lib/demoData";
import type { Sketch } from "@/types/sanity";

/** GROQ: *[_type == "sketch"] | order(order asc) with relatedProject->{ slug } */
export async function getAllSketches(): Promise<Sketch[]> {
  return [...demoSketches];
}
