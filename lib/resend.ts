import { Resend } from "resend";
import { SITE } from "@/constants/site";

export type Inquiry = {
  name: string;
  company?: string;
  phone: string;
  projectType: string;
  message: string;
};

/**
 * Server-only. RESEND_API_KEY must never reach a client component.
 *
 * The sender needs a domain verified in Resend. Until the studio's domain is
 * verified, RESEND_FROM_EMAIL is unset and this falls back to Resend's shared
 * onboarding sender, which only delivers to the account owner's address.
 */
const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ?? "Creative Studio India <onboarding@resend.dev>";

function formatBody(inquiry: Inquiry) {
  return [
    `Name: ${inquiry.name}`,
    `Company: ${inquiry.company?.trim() || "—"}`,
    `Phone: ${inquiry.phone}`,
    `Project type: ${inquiry.projectType}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");
}

export async function sendInquiry(inquiry: Inquiry) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: FROM_ADDRESS,
    to: SITE.email,
    // No replyTo: spec 21's form collects a phone number, not an email address.
    subject: `New project inquiry from ${inquiry.name}`,
    text: formatBody(inquiry),
  });
}
