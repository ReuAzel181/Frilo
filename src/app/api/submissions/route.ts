import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/models/Submission';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const submissions = await Submission.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}