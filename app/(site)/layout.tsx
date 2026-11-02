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
      {/* First focusable element on every page: jumps keyboard users past the header. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-16 focus:z-[100] focus:bg-ink focus:px-16 focus:py-8 focus:text-[13px] focus:text-offwhite"
      >
        Skip to content
      </a>
      <Nav features={features} />
      {/*
        Everything the open menu covers. Nav marks this inert while the menu is
        open, so focus can't wander behind it. #top is the footer's "Back to
        top" target.
      */}
      <div id="site-content">
        <span id="top" />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
      <ScrollReveal />
    </>
  );
}
