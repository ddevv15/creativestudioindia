import { NextResponse } from "next/server";
import { sendInquiry, type Inquiry } from "@/lib/resend";

export async function POST(request: Request) {
  let body: Partial<Inquiry>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, company, phone, projectType, message } = body;

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, phone, and message are required." },
      { status: 400 },
    );
  }

  const inquiry: Inquiry = {
    name: name.trim(),
    company: company?.trim(),
    phone: phone.trim(),
    projectType: projectType?.trim() || "Not specified",
    message: message.trim(),
  };

  // Demo fallback: with no RESEND_API_KEY there is nothing to send through, so
  // the inquiry is logged server-side and the form still reaches its success
  // state. Setting the env var switches this to a real send — no code change.
  if (!process.env.RESEND_API_KEY) {
    console.info("[demo] contact inquiry received", inquiry);
    return NextResponse.json({ ok: true, demo: true });
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
