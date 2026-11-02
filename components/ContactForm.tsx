"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INQUIRY_PROJECT_TYPES } from "@/constants/categories";
import { SITE } from "@/constants/site";

type Status = "idle" | "submitting" | "success" | "error" | "unavailable";

const LABEL = "text-[12px] uppercase tracking-[0.04em] text-ink";
// Ruled, not boxed: one hairline under each field that darkens to ink on focus.
const FIELD =
  "mt-8 h-[44px] rounded-none border-0 border-b border-ink/25 bg-transparent px-0 text-[15px] text-ink shadow-none transition-colors placeholder:text-stone focus-visible:border-ink focus-visible:ring-0";
const LINK =
  "underline decoration-1 underline-offset-4 transition-colors duration-200 hover:text-stone";

/** The channels, inline, for the moments the form itself can't deliver. */
function DirectLinks() {
  return (
    <span className="flex flex-wrap gap-x-24 gap-y-8">
      <a href={`https://wa.me/${SITE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={LINK}>
        WhatsApp
      </a>
      <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className={LINK}>
        {SITE.phone}
      </a>
      <a href={`mailto:${SITE.email}`} className={LINK}>
        {SITE.email}
      </a>
    </span>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  // Set when the phone-or-email rule fails, so both fields announce themselves as invalid.
  const [needsReplyRoute, setNeedsReplyRoute] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!phone.trim() && !email.trim()) {
      setError("Please add a phone number or an email address so the studio can reply.");
      setStatus("error");
      setNeedsReplyRoute(true);
      document.getElementById("phone")?.focus();
      return;
    }

    setNeedsReplyRoute(false);
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, phone, email, projectType, message }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
          code?: string;
        } | null;
        if (data?.code === "not_configured") {
          setStatus("unavailable");
          return;
        }
        throw new Error(data?.error ?? "Your enquiry couldn't be sent.");
      }

      setStatus("success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Your enquiry couldn't be sent.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="border-t border-ink pt-24">
        <p className="text-[32px] leading-[1.18] tracking-[-0.01em] text-ink md:text-[40px]">Thank you.</p>
        <p className="mt-16 max-w-[44ch] text-[15px] leading-[1.55] text-ink">
          Your enquiry has reached the studio, and they&rsquo;ll be in touch. To talk sooner:
        </p>
        <div className="mt-16 text-[15px] text-ink">
          <DirectLinks />
        </div>
      </div>
    );
  }

  if (status === "unavailable") {
    return (
      <div role="status" className="border-t border-ink pt-24">
        <p className="text-[32px] leading-[1.18] tracking-[-0.01em] text-ink md:text-[40px]">
          Online enquiries aren&rsquo;t connected yet.
        </p>
        <p className="mt-16 max-w-[44ch] text-[15px] leading-[1.55] text-ink">
          Your message wasn&rsquo;t sent. Please reach the studio directly instead:
        </p>
        <div className="mt-16 text-[15px] text-ink">
          <DirectLinks />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-[10px] gap-y-24 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={LABEL}>
            Full name
          </label>
          <Input id="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={FIELD} />
        </div>

        <div>
          <label htmlFor="phone" className={LABEL}>
            Phone
          </label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-describedby="reply-hint"
            aria-invalid={needsReplyRoute || undefined}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={FIELD}
          />
        </div>

        <div>
          <label htmlFor="email" className={LABEL}>
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-describedby="reply-hint"
            aria-invalid={needsReplyRoute || undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={FIELD}
          />
        </div>

        <p id="reply-hint" className="-mt-16 text-[13px] text-stone sm:col-span-2">
          A phone number or an email, whichever suits you.
        </p>

        <div>
          <label htmlFor="company" className={LABEL}>
            Company <span className="normal-case tracking-normal text-stone">(optional)</span>
          </label>
          <Input id="company" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} className={FIELD} />
        </div>

        <div>
          <label htmlFor="projectType" className={LABEL}>
            Project type <span className="normal-case tracking-normal text-stone">(optional)</span>
          </label>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger id="projectType" className={FIELD}>
              <SelectValue placeholder="Choose one" />
            </SelectTrigger>
            <SelectContent className="border-ink shadow-none">
              {INQUIRY_PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="min-h-[40px] text-[15px] focus:bg-linen">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={LABEL}>
            About the project
          </label>
          <Textarea
            id="message"
            required
            rows={5}
            placeholder="The site, the brief, and the people it is for."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${FIELD} h-auto min-h-[140px] resize-none py-8`}
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-24 text-[13px] text-red">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-32 h-[44px] rounded-none bg-ink px-16 text-[13px] font-medium text-offwhite transition-[background-color,transform] hover:bg-charcoal active:scale-[0.97] disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send enquiry →"}
      </Button>
    </form>
  );
}
