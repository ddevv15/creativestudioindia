import Footer from "@/components/layout/Footer";
import Nav from "@/components/layout/Nav";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
