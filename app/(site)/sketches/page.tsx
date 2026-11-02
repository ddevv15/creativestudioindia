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
      <section data-nav-overlay className="bg-charcoal px-24 pb-[80px] pt-nav-80 md:px-48">
        <p className="section-label !text-white/40">Process</p>

        <h1 className="display-headline mt-16 text-[52px] text-white">
          Design begins by hand.
        </h1>

        <p className="mt-24 max-w-[60ch] font-sans text-[17px] leading-[1.75] text-white/60">
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
