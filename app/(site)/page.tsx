import JsonLd from "@/components/JsonLd";
import HeroSlider from "@/components/sections/HeroSlider";
import HomeFeed from "@/components/sections/HomeFeed";
import ServicesStrip from "@/components/sections/ServicesStrip";
import Statement from "@/components/sections/Statement";
import StudioBlock from "@/components/sections/StudioBlock";
import { SITE } from "@/constants/site";
import { getAllProjects, getAllSketches, getSiteSettings } from "@/lib/content";
import { localBusinessSchema, pageMetadata } from "@/lib/seo";
import type { FeatureImage } from "@/types";

export const metadata = pageMetadata({
  title: "Creative Studio India | Architecture & 3D Visualization, Ahmedabad",
  description:
    "Ahmedabad-based architecture and planning studio led by principal designer Jignesh Patel — 35 years and 700+ projects across residential, commercial, institutional, and mixed-use design.",
});

export default async function HomePage() {
  const [siteSettings, projects, sketches] = await Promise.all([
    getSiteSettings(),
    getAllProjects(),
    getAllSketches(),
  ]);

  // Featured projects lead the slider. With none flagged, the first few by
  // order stand in. With no projects at all, the studio's hero image does.
  const featured = projects.filter((project) => project.featured);
  const slides: FeatureImage[] = (featured.length > 0 ? featured : projects)
    .slice(0, 5)
    .map((project) => ({
      title: project.title,
      href: `/projects/${project.slug}`,
      location: project.location,
      image: project.coverImage,
    }));
  if (slides.length === 0 && siteSettings.heroMedia) {
    slides.push({ title: SITE.name, location: "Ahmedabad, India", image: siteSettings.heroMedia });
  }

  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      <h1 className="sr-only">{SITE.name}: architecture and planning, Ahmedabad</h1>
      <HeroSlider slides={slides} />

      <Statement
        heading="Every building here begins as a sketch."
        body="Led by principal designer Jignesh Patel, the studio has spent 35 years across architecture, 3D visualization and documentation, with 700+ residential, commercial, institutional and mixed-use projects."
        facts={[
          { value: "35", label: "Years of practice" },
          { value: "700+", label: "Projects" },
          { value: "3", label: "Disciplines" },
        ]}
      />

      <HomeFeed projects={projects} sketches={sketches} />

      <StudioBlock
        principalPhoto={siteSettings.principalPhoto}
        principalBio={siteSettings.principalBio}
      />

      <ServicesStrip />

      <Statement
        heading="Have a project in mind?"
        body="Tell us about the site, the brief and the people it is for, and the studio will take it from there."
        links={[
          { label: "Start a project →", href: "/contact" },
          { label: "WhatsApp", href: `https://wa.me/${SITE.whatsappNumber}` },
        ]}
      />
    </>
  );
}
