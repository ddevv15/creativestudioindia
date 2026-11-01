import Link from "next/link";
import { SERVICES } from "@/constants/services";

/**
 * The three disciplines in a row (spec 0002, homepage), so someone who came
 * for renders or drawings sees the studio does those too.
 */
export default function ServicesStrip() {
  return (
    <section data-reveal className="grid grid-cols-12 gap-x-[10px] gap-y-32 px-gutter py-64 lg:py-96">
      <div className="col-span-12 lg:col-span-3">
        <p className="caption-mono">Services</p>
        <h2 className="mt-16 text-[28px] leading-[1.2] text-ink md:text-[32px]">What we do</h2>
      </div>

      {SERVICES.map((service) => (
        <div key={service.number} className="col-span-12 border-t border-ink/20 pt-16 md:col-span-4 lg:col-span-3">
          <p className="caption-mono">{service.number}</p>
          <h3 className="mt-24 text-[20px] leading-[1.25] text-ink md:text-[22px]">{service.name}</h3>
          <p className="mt-8 max-w-[34ch] text-[15px] leading-[1.5] text-stone">{service.description}</p>
        </div>
      ))}

      <div className="col-span-12 lg:col-start-4">
        <Link
          href="/services"
          className="text-[15px] underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone"
        >
          All services →
        </Link>
      </div>
    </section>
  );
}
