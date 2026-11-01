import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

type RevalidatePayload = {
  _type: string;
  slug?: { current?: string };
};

/**
 * An unset or empty REVALIDATE_SECRET rejects everything. A plain `!==` let an
 * empty `x-revalidate-secret:` header match an empty env var. Both sides are
 * hashed first so timingSafeEqual always compares equal lengths, and the
 * comparison time says nothing about how much of the secret was right.
 */
function isValidSecret(provided: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !provided) return false;

  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(provided), digest(expected));
}

export async function POST(request: NextRequest) {
  if (!isValidSecret(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let body: RevalidatePayload;
  try {
    body = (await request.json()) as RevalidatePayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  switch (body._type) {
    case "project":
      revalidatePath("/projects");
      revalidatePath("/");
      // /services borrows project covers; /about uses them for process imagery.
      revalidatePath("/services");
      revalidatePath("/about");
      if (body.slug?.current) {
        revalidatePath(`/projects/${body.slug.current}`);
      }
      break;
    case "sketch":
      revalidatePath("/sketches");
      revalidatePath("/");
      revalidatePath("/about");
      break;
    case "now":
      // Drives the conditional Recognition section on /about.
      revalidatePath("/about");
      break;
    case "teamMember":
      revalidatePath("/about");
      break;
    case "siteSettings":
      revalidatePath("/");
      revalidatePath("/about");
      break;
    default:
      revalidatePath("/");
      break;
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
