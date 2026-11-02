import SketchesGallery from "@/components/SketchesGallery";
import { SKETCHES_ARE_SAMPLES } from "@/constants/site";
import { getAllSketches } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sketches | Creative Studio India",
  description:
    "Hand-drawn architectural sketches from Creative Studio India — where every building begins.",
});

export default async function SketchesPage() {
  const sketches = await getAllSketches();

  return (
    <>
      {/* data-nav-overlay: charcoal hero — short, so Nav measures this element
          rather than assuming a full viewport. Must also stay listed in
          OVERLAY_HERO_ROUTES in constants/nav.ts.

          pt-nav-80 keeps the transparent nav from overlapping the label: the bar
          is see-through here, but its logo and links still occupy that space. */}
      <section data-nav-overlay className="bg-charcoal px-gutter pb-[80px] pt-nav-80">
        <h1 className="display-headline text-[52px] text-offwhite">
          Design begins by hand.
        </h1>

        <p className="mt-24 max-w-[60ch] font-sans text-[16px] leading-[1.6] text-offwhite/80">
          Every building we have designed started as a sketch. This is where
          ideas become architecture.
        </p>

        {SKETCHES_ARE_SAMPLES && (
          <p className="caption-mono mt-16 !text-offwhite/80">
            Draft: these are sample images. The studio&rsquo;s own sketches are on their way.
          </p>
        )}
      </section>

      <SketchesGallery sketches={sketches} />
    </>
  );
}
