"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type LightboxProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string | null;
  alt: string;
  caption?: string;
};

/**
 * Shared full-screen image viewer for the project gallery (spec 17) and the
 * sketches wall (spec 20). Closes on backdrop click, Escape, or the ✕ button —
 * the first two come free with Radix.
 *
 * `text-offwhite` on the content is load-bearing: DialogContent's built-in close
 * button inherits its colour, and without it the ✕ renders ink on the ink overlay.
 */
export default function Lightbox({
  open,
  onOpenChange,
  src,
  alt,
  caption,
}: LightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-ink/90"
        className="flex max-w-none items-center justify-center border-0 bg-transparent p-24 text-offwhite shadow-none"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>

        {src && (
          <figure className="flex flex-col items-center gap-16">
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="max-h-[90vh] w-auto object-contain"
            />

            {caption && (
              <figcaption className="font-mono text-[12px] text-offwhite/80">
                {caption}
              </figcaption>
            )}
          </figure>
        )}
      </DialogContent>
    </Dialog>
  );
}
