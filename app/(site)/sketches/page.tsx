import SketchesGallery from "@/components/SketchesGallery";
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
      <section className="bg-charcoal px-24 py-[80px] md:px-48">
        <p className="section-label !text-white/40">Process</p>

        <h1 className="display-headline mt-16 text-[52px] text-white">
          Design begins by hand.
        </h1>

        <p className="mt-24 max-w-[60ch] font-sans text-[17px] leading-[1.75] text-white/60">
          Every building we have designed started as a sketch. This is where
          ideas become architecture.
        </p>
      </section>

      <SketchesGallery sketches={sketches} />
    </>
  );
}
