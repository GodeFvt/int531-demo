'use client';

import { Button } from '@/components/ui/button';
import { Student } from '@/db/schema';
import { FC } from 'react';
import StudentCard from './student-card';

type StudentListProps = {
  students: Student[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onRefresh?: () => void;
  onUpdate?: (updated: Student) => void;
};

const StudentList: FC<StudentListProps> = ({
  students,
  loading,
  onDelete,
  onRefresh,
  onUpdate,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">รายชื่อนักศึกษา</h2>
      <Button
        onClick={onRefresh}
        disabled={loading}
        variant="outline"
      >
        {loading ? 'กำลังโหลด...' : 'อัปเดต'}
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.length > 0 ? (
        students.map((s) => (
          <StudentCard
            key={s.id}
            id={s.id}
            name={s.name}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground p-8 border rounded-lg">
          {loading
            ? 'กำลังโหลดรายชื่อ...'
            : 'ยังไม่มีนักศึกษา — เพิ่มคนแรกได้เลย'}
        </p>
      )}
    </div>
  </div>
);

export default StudentList;
