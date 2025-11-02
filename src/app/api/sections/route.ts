import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const label = searchParams.get("label") || undefined;
  const tag = searchParams.get("tag") || undefined;

  const where: any = {};
  if (label) where.label = label;
  if (tag) where.tags = { array_contains: tag };

  const items = await prisma.sectionImage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
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