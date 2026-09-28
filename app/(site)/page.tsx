import JsonLd from "@/components/JsonLd";
import HeroScrollExpand from "@/components/sections/HeroScrollExpand";
import CredentialBar from "@/components/sections/CredentialBar";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import FounderBlock from "@/components/sections/FounderBlock";
import SketchesStrip from "@/components/sections/SketchesStrip";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ContactCTA from "@/components/sections/ContactCTA";
import {
  getAllSketches,
  getFeaturedProjects,
  getSiteSettings,
} from "@/lib/content";
import { localBusinessSchema, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Creative Studio India | Architecture & 3D Visualization, Ahmedabad",
  description:
    "Ahmedabad-based architecture and planning studio led by principal designer Jignesh Patel — 35 years and 700+ projects across residential, commercial, institutional, and mixed-use design.",
});

export default async function HomePage() {
  const [siteSettings, featuredProjects, sketches] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getAllSketches(),
  ]);

  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      <HeroScrollExpand
        heroHeadline={siteSettings.heroHeadline}
        heroMedia={siteSettings.heroMedia}
      />
      <CredentialBar />
      <FeaturedProjects projects={featuredProjects} />
      <FounderBlock
        principalPhoto={siteSettings.principalPhoto}
        principalBio={siteSettings.principalBio}
      />
      <SketchesStrip sketches={sketches} />
      <ServicesOverview />
      <ContactCTA />
    </>
  );
}
