import { NextResponse } from "next/server";
import { sendInquiry, type Inquiry } from "@/lib/resend";

/** Deliberately loose: something@something.something. Resend rejects the rest. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Partial<Inquiry>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, company, phone, email, projectType, message } = body;

  if (!name?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Please add your name and a message." },
      { status: 400 },
    );
  }

  if (!phone?.trim() && !email?.trim()) {
    return NextResponse.json(
      { error: "Please add a phone number or an email address so the studio can reply." },
      { status: 400 },
    );
  }

  if (email?.trim() && !EMAIL_PATTERN.test(email.trim())) {
    return NextResponse.json(
      { error: "That email address doesn't look right. Please check it." },
      { status: 400 },
    );
  }

  const inquiry: Inquiry = {
    name: name.trim(),
    company: company?.trim(),
    phone: phone?.trim() || undefined,
    email: email?.trim() || undefined,
    projectType: projectType?.trim() || "Not specified",
    message: message.trim(),
  };

  // With no RESEND_API_KEY there is nothing to send through. Local dev logs the
  // inquiry and reports success so the form can be worked on; a deployed build
  // must never tell a visitor their message arrived when it didn't, so it
  // answers 503 and the form points them to WhatsApp, phone and email instead.
  // Setting the env var switches this to a real send, no code change.
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[demo] contact inquiry received", inquiry);
      return NextResponse.json({ ok: true, demo: true });
    }
    return NextResponse.json(
      { error: "Online enquiries aren't connected yet.", code: "not_configured" },
      { status: 503 },
    );
  }

  try {
    const { error } = await sendInquiry(inquiry);

    if (error) {
      console.error("Resend rejected the inquiry:", error);
      return NextResponse.json(
        { error: "Could not send your inquiry." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected error sending inquiry:", error);
    return NextResponse.json(
      { error: "Could not send your inquiry." },
      { status: 500 },
    );
  }
}
