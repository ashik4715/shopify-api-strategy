import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const option =
      ["wordpress", "custom", "undecided"].includes(body.option) ? body.option : "undecided";

    if (name.length < 2 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
    }

    await db.insert(inquiries).values({
      name,
      email,
      phone: phone || null,
      option,
      message: message || null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
