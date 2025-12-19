import { db } from '@/db';
import { students } from '@/db/schema';
import { withMetrics } from '@/lib/withMetrics';
import { withDbMetrics } from '@/lib/withDbMetrics';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const runtime = 'nodejs';

const handler = async (req: NextRequest, id: string): Promise<NextResponse> => {
  if (req.method === 'GET') {
    const [student] = await withDbMetrics('select', 'students', () =>
      db.select().from(students).where(eq(students.id, id))
    );
    if (!student)
      return NextResponse.json({ error: 'ไม่พบนักศึกษา' }, { status: 404 });
    return NextResponse.json(student);
  }

  if (req.method === 'PATCH') {
    const { firstName, lastName } = await req.json();
    const [existing] = await withDbMetrics('select', 'students', () =>
      db.select().from(students).where(eq(students.id, id))
    );
    if (!existing)
      return NextResponse.json({ error: 'ไม่พบนักศึกษา' }, { status: 404 });

    const name = `${firstName.trim()} ${lastName.trim()}`.trim();
    await withDbMetrics('update', 'students', () =>
      db
        .update(students)
        .set({ name, updatedAt: sql`CURRENT_TIMESTAMP` })
        .where(eq(students.id, id))
    );

    const [updated] = await withDbMetrics('select', 'students', () =>
      db.select().from(students).where(eq(students.id, id))
    );
    return NextResponse.json(updated);
  }

  if (req.method === 'DELETE') {
    const [existing] = await withDbMetrics('select', 'students', () =>
      db.select().from(students).where(eq(students.id, id))
    );
    if (!existing)
      return NextResponse.json({ error: 'ไม่พบนักศึกษา' }, { status: 404 });

    await withDbMetrics('delete', 'students', () =>
      db.delete(students).where(eq(students.id, id))
    );
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return withMetrics(async () => handler(req, id), '/api/students/:id')(req);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return withMetrics(async () => handler(req, id), '/api/students/:id')(req);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return withMetrics(async () => handler(req, id), '/api/students/:id')(req);
}
