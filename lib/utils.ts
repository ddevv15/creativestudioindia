import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PortableTextBlock } from "@sanity/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Flattens Portable Text to a plain string — used for meta descriptions, where
 * the rich-text structure is irrelevant and only the prose matters.
 *
 * Guards with Array.isArray rather than a default parameter. A default only
 * substitutes for `undefined`, and GROQ returns `null` for a field the document
 * does not have, so `toPlainText(project.description)` threw on every project
 * without a description. That is most of them: description is optional in the
 * schema and the media ingest does not write one.
 */
export function toPlainText(
  blocks?: PortableTextBlock[] | null,
): string {
  if (!Array.isArray(blocks)) return ""
  return blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return ""
      return block.children
        .map((child) => (child as { text?: string }).text ?? "")
        .join("")
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
}

/** Truncates on a word boundary so meta descriptions never end mid-word. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(" ", max)).trimEnd()}…`
}
