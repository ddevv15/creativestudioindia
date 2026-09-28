/**
 * Contact details and the studio's own description of itself, taken from
 * CREATIVE STUDIO_Portfolio.pdf (page 2) rather than invented. Anything below
 * that is still a placeholder says so.
 */
export const SITE = {
  name: "Creative Studio India",
  description:
    "Creative Studio India — Ahmedabad-based architecture and planning studio led by principal designer Jignesh Patel, with 35 years of practice and 700+ projects.",
  ogImage: "/og-image.jpg",
  address: "1306 Times Square I, Thaltej, Ahmedabad 380059, Gujarat, India",
  // Portfolio prints this unspaced as +91 7878456764; grouped here the way
  // Indian mobile numbers are normally read. whatsappNumber must stay digits
  // only — wa.me rejects spaces and punctuation.
  phone: "+91 78784 56764",
  whatsappNumber: "917878456764",
  email: "mail@creativestudioindia.com",
  // PLACEHOLDER. The portfolio links both as the text "Creative Studio" with
  // no handle visible, so the actual profile URLs are still unknown. These
  // resolve to the site roots and must be corrected before launch.
  instagramUrl: "https://instagram.com/",
  linkedinUrl: "https://linkedin.com/",
} as const;
