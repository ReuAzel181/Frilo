import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const label = String(formData.get("label") || "");
    const description = String(formData.get("description") || "");
    const tagsRaw = String(formData.get("tags") || "[]");
    const tags = safeParseStringArray(tagsRaw);

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    const ext = guessExtension(file.type) ?? ".png";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    const record = await prisma.sectionImage.create({
      data: { url, label, description: description || null, tags },
    });

    return NextResponse.json({ id: record.id, url, label, description: record.description, tags: record.tags });
  } catch (err) {
    console.error("/api/upload error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

function safeParseStringArray(input: string): string[] {
  try {
    const v = JSON.parse(input);
    if (Array.isArray(v)) {
      return v.map((x) => String(x));
    }
    return [];
  } catch {
    return [];
  }
}

function guessExtension(mime: string | null): string | null {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    default:
      return null;
  }
}