import { register } from '@/lib/metrics';
import { NextResponse } from 'next/server';

export const GET = async () =>
  new NextResponse(await register.metrics(), {
    status: 200,
    headers: { 'Content-Type': register.contentType },
  });
