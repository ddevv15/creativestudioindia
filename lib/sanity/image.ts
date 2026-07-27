import createImageUrlBuilder, {
  type SanityImageSource,
} from "@sanity/image-url";

import { client } from "./client";

const builder = createImageUrlBuilder(client);

// --- DEMO SHIM (temporary) ---------------------------------------------------
// Demo images (see lib/demoData.ts) carry a plain local URL under `_demoUrl`
// instead of a Sanity asset ref. When we see one, return a passthrough builder
// so components that call urlFor(img).width().height().url() keep working
// against a local /public image. Delete this block when Sanity is wired up.
type DemoImage = { _demoUrl: string };

function isDemoImage(source: unknown): source is DemoImage {
  return typeof source === "object" && source !== null && "_demoUrl" in source;
}

function demoBuilder(url: string) {
  const stub = {
    width: () => stub,
    height: () => stub,
    fit: () => stub,
    url: () => url,
  };
  return stub as unknown as ReturnType<typeof builder.image>;
}
// --- END DEMO SHIM -----------------------------------------------------------

export function urlFor(source: SanityImageSource) {
  if (isDemoImage(source)) return demoBuilder(source._demoUrl);
  return builder.image(source);
}
