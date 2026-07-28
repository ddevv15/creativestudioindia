/**
 * Server-rendered JSON-LD. No third-party library, per spec 23.
 *
 * The payload is JSON.stringify'd from data this app constructs, and `<` is
 * escaped so a stray closing tag inside a caption cannot break out of the
 * script element.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
