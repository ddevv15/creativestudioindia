import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PortableTextBlock } from "@sanity/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Flattens Portable Text to a plain string — used for meta descriptions, where
 * the rich-text structure is irrelevant and only the prose matters.
 */
export function toPlainText(blocks: PortableTextBlock[] = []): string {
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
