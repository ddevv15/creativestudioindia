import Link from "next/link";
import type { NavItem } from "@/types";

const LINK =
  "underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone";

/**
 * Two-column statement (spec 0002): a headline in the left half, body copy in
 * the right half. Optionally a row of facts under the body, and underlined
 * links.
 */
export default function Statement({
  heading,
  body,
  facts,
  links,
}: {
  heading: string;
  body: string;
  facts?: { value: string; label: string }[];
  links?: NavItem[];
}) {
  return (
    <section
      data-reveal
      className="grid grid-cols-1 gap-24 px-gutter py-64 md:grid-cols-2 md:gap-[10px] lg:py-96"
    >
      <h2 className="max-w-[16ch] text-[32px] font-normal leading-[1.18] tracking-[-0.01em] text-ink md:text-[40px]">
        {heading}
      </h2>

      <div>
        <p className="max-w-[30ch] text-[20px] leading-[1.35] text-ink md:text-[24px]">{body}</p>

        {facts && (
          <dl className="mt-48 grid max-w-[560px] grid-cols-3 gap-[10px]">
            {facts.map((fact) => (
              <div key={fact.label} className="border-t border-ink/20 pt-16">
                <dt className="caption-mono">{fact.label}</dt>
                <dd className="mt-8 text-[28px] leading-none text-ink md:text-[32px]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {links && (
          <div className="mt-32 flex flex-wrap gap-x-24 gap-y-8 text-[15px]">
            {links.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.href} href={link.href} className={LINK}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {link.label}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
