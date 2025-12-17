import { withMetrics } from '@/lib/withMetrics';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const rate = parseInt(searchParams.get('rate') || '100', 10);

  // rate = percentage chance of returning 500 error (0-100)
  const shouldError = Math.random() * 100 < rate;

  if (shouldError) {
    return NextResponse.json(
      { error: 'Internal Server Error (Mocked)' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: 'Request succeeded' });
};

export const GET = (req: NextRequest) =>
  withMetrics(() => handler(req), '/api/mock-error')(req);

export const POST = (req: NextRequest) =>
  withMetrics(() => handler(req), '/api/mock-error')(req);
