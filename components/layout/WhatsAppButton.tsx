"use client";

import { motion } from "framer-motion";
import { SITE } from "@/constants/site";

function WhatsAppIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="white"
      aria-hidden="true"
    >
      <path d="M12.04 2.003c-5.46 0-9.89 4.43-9.89 9.89 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.78 1.22h.004c5.46 0 9.89-4.43 9.89-9.89 0-2.64-1.03-5.12-2.9-6.99a9.82 9.82 0 0 0-6.98-2.93zm5.84 14.01c-.25.7-1.45 1.34-2 1.43-.52.08-1.18.12-1.9-.12-.44-.14-1-.32-1.72-.63-3.02-1.3-4.99-4.35-5.14-4.56-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.27-.3.6-.37.8-.37h.58c.18 0 .43-.02.66.5.27.6.91 2.13.99 2.28.08.16.13.34.03.55-.1.21-.16.34-.32.52-.16.18-.34.4-.48.54-.16.16-.33.33-.14.65.19.32.85 1.4 1.83 2.27 1.27 1.12 2.34 1.47 2.67 1.63.33.16.52.13.71-.08.2-.21.83-.96 1.04-1.29.21-.33.43-.27.71-.16.28.11 1.79.85 2.1 1.01.31.16.51.24.59.37.08.13.08.74-.17 1.44z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${SITE.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      whileHover={{ scale: 1.05 }}
      className="fixed bottom-24 right-24 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] shadow-lg"
    >
      <WhatsAppIcon />
    </motion.a>
  );
}
