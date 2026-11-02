import { cn } from "@/lib/utils";

/**
 * Ink scrims that keep text on photographs readable (DESIGN.md: "a soft ink
 * gradient, ink at 30 to 60%, only where text sits on a photo").
 *
 * `header`: holds ink at 60% across the header's band, then fades out by
 * 200px, so the off-white header text clears 4.5:1 even over a white sky.
 * `title`: rises from the bottom at 60%, still 50% halfway up, so a banner's
 * page title (and the hero caption) clear 3:1 over bright ground.
 */
export default function ImageScrim({ edge }: { edge: "header" | "title" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0",
        edge === "header"
          ? "top-0 h-[200px] bg-gradient-to-b from-ink/60 via-ink/60 via-40% to-transparent"
          : "bottom-0 h-[55%] bg-gradient-to-t from-ink/60 via-ink/50 via-50% to-transparent"
      )}
    />
  );
}
