import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'NEXTAUTH_SECRET is not set' }, { status: 500 });
  }
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const { submissionId } = await req.json();
  const userId = token.sub;

  if (!submissionId || !userId) {
    return NextResponse.json({ error: 'Missing submissionId or userId' }, { status: 400 });
  }

  try {
    const submission = await Submission.findById(submissionId);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const userIndex = submission.favorites.indexOf(userId);

    if (userIndex > -1) {
      // User has already favorited, so unfavorite
      submission.favorites.splice(userIndex, 1);
    } else {
      // User has not favorited, so favorite
      submission.favorites.push(userId);
    }

    await submission.save();

    return NextResponse.json({ message: 'Favorite status updated' }, { status: 200 });
  } catch (error) {
    console.error('Error updating favorite status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}