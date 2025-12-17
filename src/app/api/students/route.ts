import { db } from '@/db';
import { students } from '@/db/schema';
import { withMetrics } from '@/lib/withMetrics';
import { withDbMetrics } from '@/lib/withDbMetrics';
import { CreateStudentSchema } from '@/schema/student';
import { asc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  if (req.method === 'GET') {
    const list = await withDbMetrics('select', 'students', () =>
      db.select().from(students).orderBy(asc(students.createdAt))
    );
    return NextResponse.json(list);
  }
  if (req.method === 'POST') {
    const json = await req.json();
    const parsed = CreateStudentSchema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 }
      );
    const data = parsed.data;
    const [existing] = await withDbMetrics('select', 'students', () =>
      db.select().from(students).where(eq(students.id, data.id))
    );
    if (existing)
      return NextResponse.json(
        { error: 'รหัสนักศึกษานี้มีอยู่แล้ว' },
        { status: 409 }
      );
    const name = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
    await withDbMetrics('insert', 'students', () =>
      db.insert(students).values({ id: data.id, name })
    );
    const [created] = await withDbMetrics('select', 'students', () =>
      db.select().from(students).where(eq(students.id, data.id))
    );
    return NextResponse.json(created, { status: 201 });
  }
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
};

export const GET = withMetrics(handler, '/api/students');
export const POST = withMetrics(handler, '/api/students');
