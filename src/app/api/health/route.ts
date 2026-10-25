import { NextResponse } from "next/server";
import { readInquiries } from "@/lib/inquiries-json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const inquiries = await readInquiries();
    return NextResponse.json({ ok: true, count: inquiries.length });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
