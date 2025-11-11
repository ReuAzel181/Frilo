import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  try {
    const item = await prisma.sectionImage.findUnique({ where: { id: params.id } });
    return item ? NextResponse.json(item) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    console.error("/api/sections/[id] GET", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const payload = await req.json();
    const { label, description, tags } = payload;
    const updated = await prisma.sectionImage.update({
      where: { id: params.id },
      data: {
        label: label ? String(label) : undefined,
        description: description === undefined ? undefined : description ? String(description) : null,
        tags: Array.isArray(tags) ? tags : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("/api/sections/[id] PUT", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.sectionImage.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/sections/[id] DELETE", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}