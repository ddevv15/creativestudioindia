// =============================================================================
// TEMPORARY DEMO BUILD
// -----------------------------------------------------------------------------
// This homepage is fed by lib/demoData.ts instead of Sanity so the client can
// preview the built design before the CMS is set up. To restore the real,
// Sanity-backed version, revert this file to the previous commit and follow the
// removal steps in lib/demoData.ts.
// =============================================================================

import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import CredentialBar from "@/components/sections/CredentialBar";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import FounderBlock from "@/components/sections/FounderBlock";
import SketchesStrip from "@/components/sections/SketchesStrip";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ContactCTA from "@/components/sections/ContactCTA";
import {
  demoSiteSettings,
  demoFeaturedProjects,
  demoSketches,
} from "@/lib/demoData";

export const metadata: Metadata = {
  title: "Creative Studio India | Architecture & 3D Visualization, Ahmedabad",
  description: demoSiteSettings.defaultSeo?.metaDescription,
};

export default function HomePage() {
  return (
    <>
      <Hero
        heroHeadline={demoSiteSettings.heroHeadline}
        heroMedia={demoSiteSettings.heroMedia}
      />
      <CredentialBar />
      <FeaturedProjects projects={demoFeaturedProjects} />
      <FounderBlock
        principalPhoto={demoSiteSettings.principalPhoto}
        principalBio={demoSiteSettings.principalBio}
      />
      <SketchesStrip sketches={demoSketches} />
      <ServicesOverview />
      <ContactCTA />
    </>
  );
}
