import JsonLd from "@/components/JsonLd";
import HeroScrollExpand from "@/components/sections/HeroScrollExpand";
import CredentialBar from "@/components/sections/CredentialBar";
import ProjectsCarousel from "@/components/sections/ProjectsCarousel";
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
        heroMedia={siteSettings.heroMedia}
        heroImages={siteSettings.heroImages}
      />
      <ProjectsCarousel projects={featuredProjects} />

      {/*
        The sheet. Everything after the carousel slides up over its pinned
        stage: the negative margin overlaps the carousel's last viewport of
        track, which it keeps empty for exactly this. z-10 puts the sheet above
        the stage; the shadow is the stage's edge as the sheet passes over it.
        No overlap below lg or with reduced motion, where the carousel does
        not pin.
      */}
      <div className="relative z-10 lg:-mt-[100dvh] lg:shadow-[0_-24px_60px_rgba(0,0,0,0.35)] motion-reduce:lg:mt-0">
        <CredentialBar />
        <FounderBlock
          principalPhoto={siteSettings.principalPhoto}
          principalBio={siteSettings.principalBio}
        />
        <SketchesStrip sketches={sketches} />
        <ServicesOverview />
        <ContactCTA />
      </div>
    </>
  );
}
