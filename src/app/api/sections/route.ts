import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const label = searchParams.get("label") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const where: any = {};
    if (label) where.label = label;
    if (tag) where.tags = { has: tag };

    const items = await prisma.sectionImage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error("/api/sections GET", e);
    // Gracefully degrade to an empty array so the UI can still render.
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { url, label, description, tags } = payload;
    const created = await prisma.sectionImage.create({
      data: {
        url: String(url),
        label: String(label),
        description: description ? String(description) : null,
        tags: Array.isArray(tags) ? tags : [],
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("/api/sections POST", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}