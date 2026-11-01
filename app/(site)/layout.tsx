import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { getFeaturedProjects } from "@/lib/content";
import type { FeatureImage } from "@/types";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The menu's image panel and its Projects row (spec 0002).
  const featured = await getFeaturedProjects();
  const features: FeatureImage[] = featured.map((project) => ({
    title: project.title,
    href: `/projects/${project.slug}`,
    location: project.location,
    image: project.coverImage,
  }));

  return (
    <>
      <Nav features={features} />
      {/*
        Everything the open menu covers. Nav marks this inert while the menu is
        open, so focus can't wander behind it. #top is the footer's "Back to
        top" target.
      */}
      <div id="site-content">
        <span id="top" />
        {children}
        <Footer />
        <WhatsAppButton />
      </div>
      <ScrollReveal />
    </>
  );
}
