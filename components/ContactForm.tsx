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

type Status = "idle" | "submitting" | "success" | "error";

const labelClass =
  "font-sans text-[11px] uppercase tracking-wider text-stone";
const fieldClass =
  "mt-8 border-stone/30 font-sans text-[14px] text-ink placeholder:text-stone/50";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, phone, projectType, message }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Could not send your inquiry.");
      }

      setStatus("success");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not send your inquiry.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-[0.5px] border-stone/30 bg-linen p-32">
        <p className="display-headline text-[28px] text-ink">Thank you.</p>
        <p className="mt-16 font-sans text-[15px] leading-[1.9] text-stone">
          Your inquiry has reached the studio. We usually reply within two
          working days.
        </p>
        <a
          href={`https://wa.me/${SITE.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-24 inline-block font-sans text-[13px] text-red underline-offset-4 hover:underline"
        >
          Or reach us directly on WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-24">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <Input
            id="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>
            Company / Organization
          </label>
          <Input
            id="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="projectType" className={labelClass}>
            Project type
          </label>
          <Select value={projectType} onValueChange={setProjectType}>
            <SelectTrigger id="projectType" className={fieldClass}>
              <SelectValue placeholder="Select a project type" />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <Textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-32 h-48 w-full bg-ink font-sans text-[13px] text-white hover:bg-ink/90"
      >
        {status === "submitting" ? "Sending…" : "Send inquiry →"}
      </Button>

      {status === "error" && (
        <p role="alert" className="mt-16 font-sans text-[13px] text-red">
          {error}
        </p>
      )}

      <a
        href={`https://wa.me/${SITE.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-24 inline-block font-sans text-[13px] text-stone underline-offset-4 hover:text-ink hover:underline"
      >
        Or reach us directly on WhatsApp →
      </a>
    </form>
  );
}
