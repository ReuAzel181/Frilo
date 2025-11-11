import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true, email: true } } },
    });
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}