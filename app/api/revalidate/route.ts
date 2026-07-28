import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

type RevalidatePayload = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const body = (await request.json()) as RevalidatePayload;

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
