import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/constants/site";
import { localBusinessSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact | Creative Studio India",
  description:
    "Start a conversation with Creative Studio India — architecture and 3D visualization in Ahmedabad.",
});

const LINK =
  "underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone";

/**
 * Contact, form first (direction in .impeccable/surfaces): the enquiry form in
 * columns 1 to 7, and the direct channels as ruled rows in 9 to 11, pinned
 * under the header so a way to talk is always in view while writing. Columns
 * 9 to 11 keep every link clear of the WhatsApp button's corner.
 */
export default function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`;
  // Keyless Google Maps embed — no API key needed for the q/output=embed form.
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;

  // One number serves both WhatsApp and calls, so it is shown once with both actions.
  const channels: { label: string; value: string; actions: { label: string; href: string; external?: boolean }[] }[] = [
    {
      label: "Phone and WhatsApp",
      value: SITE.phone,
      actions: [
        { label: "Start a chat →", href: `https://wa.me/${SITE.whatsappNumber}`, external: true },
        { label: "Call the studio →", href: `tel:${SITE.phone.replace(/\s/g, "")}` },
      ],
    },
    { label: "Email", value: SITE.email, actions: [{ label: "Write an email →", href: `mailto:${SITE.email}` }] },
    { label: "Studio", value: SITE.address, actions: [{ label: "Directions →", href: mapsUrl, external: true }] },
  ];

  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      <section className="px-gutter pb-64 pt-nav lg:pb-96">
        <h1 className="mt-32 text-[64px] font-normal leading-none tracking-[-0.03em] text-ink md:mt-48 md:text-[112px] lg:text-[136px]">
          Contact
        </h1>

        <div className="mt-48 grid grid-cols-12 gap-x-[10px] gap-y-64 md:mt-64">
          <div className="col-span-12 md:col-span-7">
            <ContactForm />
          </div>

          <aside aria-label="Reach the studio directly" className="col-span-12 md:col-span-4 md:col-start-9 lg:col-span-3">
            <ul className="md:sticky md:top-[calc(var(--nav-h)+24px)]">
              {channels.map((channel) => (
                <li key={channel.label} className="border-t border-ink/20 py-16 last:border-b">
                  <p className="caption-mono">{channel.label}</p>
                  <p className="mt-4 text-[15px] leading-[1.55] text-ink">{channel.value}</p>
                  <div className="mt-4 flex flex-wrap gap-x-24">
                    {channel.actions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={`inline-flex min-h-[44px] items-center text-[13px] text-ink ${LINK}`}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section aria-label="Map" className="px-gutter pb-64 lg:pb-96">
        {/* Linen until the lazy-loaded map paints, never an empty white box. */}
        <div className="border border-ink/15 bg-linen">
          <iframe
            title="Creative Studio India on Google Maps"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            // Greyscale until hovered, so Google's red pin and blue chrome don't
            // compete with the page's one red mark (an error) or its photographs.
            className="block aspect-[4/3] w-full border-0 grayscale transition-[filter] duration-500 hover:grayscale-0 md:aspect-[16/5]"
          />
        </div>
      </section>
    </>
  );
}
