import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { SiteSettings } from "@/types/sanity";

/**
 * Who you'd actually work with (spec 0002, homepage): the principal's
 * portrait on the left and his bio on the right, both from siteSettings.
 */
export default function StudioBlock({
  principalPhoto,
  principalBio,
}: Pick<SiteSettings, "principalPhoto" | "principalBio">) {
  const photoUrl = principalPhoto?.asset?.url;

  return (
    <section data-reveal className="grid grid-cols-12 gap-x-[10px] gap-y-48 px-gutter py-64 lg:py-96">
      {photoUrl && (
        <figure className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden bg-linen">
            <Image
              src={photoUrl}
              alt="Jignesh Patel, principal designer"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="caption-mono mt-8">Jignesh Patel, principal designer</figcaption>
        </figure>
      )}

      <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-7">
        <p className="caption-mono">Studio</p>
        <h2 className="mt-16 text-[32px] leading-[1.18] tracking-[-0.01em] text-ink md:text-[40px]">
          35 years of design. One principle.
        </h2>
        {principalBio?.length > 0 && (
          <div className="mt-24 max-w-[56ch] text-[16px] leading-[1.6] text-ink [&>p+p]:mt-16">
            <PortableText value={principalBio.slice(0, 2)} />
          </div>
        )}
        <Link
          href="/about"
          className="mt-32 inline-block text-[15px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone"
        >
          Meet the studio →
        </Link>
      </div>
    </section>
  );
}
