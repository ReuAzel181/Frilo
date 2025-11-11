import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const jwtSecret = process.env.JWT_SECRET;
  const cookieToken = req.cookies.get('token')?.value;
  if (!jwtSecret || !cookieToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId: string | null = null;
  try {
    const decoded = jwt.verify(cookieToken, jwtSecret) as { id?: string };
    userId = decoded.id || null;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { submissionId } = await req.json();

  if (!submissionId || !userId) {
    return NextResponse.json({ error: 'Missing submissionId or userId' }, { status: 400 });
  }

  try {
    const existing = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { favorites: { where: { id: userId }, select: { id: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const isFavorited = existing.favorites.length > 0;

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        favorites: isFavorited
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
      },
    });

    return NextResponse.json({ message: 'Favorite status updated', favorited: !isFavorited }, { status: 200 });
  } catch (error) {
    console.error('Error updating favorite status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}