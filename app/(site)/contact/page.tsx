import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/constants/site";
import { localBusinessSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact | Creative Studio India",
  description:
    "Start a conversation with Creative Studio India — architecture and 3D visualization in Ahmedabad.",
});

export default function ContactPage() {
  // Keyless Google Maps embed — no API key needed for the q/output=embed form.
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;

  return (
    <section className="bg-offwhite px-24 pb-96 pt-nav-96 md:px-48">
      <JsonLd data={localBusinessSchema()} />

      <div className="grid grid-cols-1 gap-64 lg:grid-cols-2 lg:gap-96">
        <div>
          <p className="section-label">Contact</p>

          <h1 className="display-headline mt-16 text-[44px] text-ink">
            Start a conversation.
          </h1>

          <address className="mt-32 not-italic font-sans text-[15px] leading-[1.9] text-stone">
            {SITE.address}
            <br />
            <a
              href={`tel:${SITE.phone}`}
              className="underline-offset-4 hover:text-ink hover:underline"
            >
              {SITE.phone}
            </a>
            <br />
            <a
              href={`mailto:${SITE.email}`}
              className="underline-offset-4 hover:text-ink hover:underline"
            >
              {SITE.email}
            </a>
          </address>

          <a
            href={`https://wa.me/${SITE.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-24 inline-block font-sans text-[13px] text-red underline-offset-4 hover:underline"
          >
            Chat on WhatsApp →
          </a>

          <iframe
            title="Creative Studio India location"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mt-32 h-[280px] w-full rounded-none border-0"
          />
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
