'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Student } from '@/db/schema';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type StudentCardProps = {
  id: string;
  name: string;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (updated: Student) => void;
};

type UpdateFormValues = {
  firstName: string;
  lastName: string;
};

const StudentCard: FC<StudentCardProps> = ({
  id,
  name,
  onDelete,
  onUpdate,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const parts = name.split(' ');
  const defaultFirst = parts[0] ?? '';
  const defaultLast = parts.slice(1).join(' ') ?? '';

  const form = useForm<UpdateFormValues>({
    defaultValues: { firstName: defaultFirst, lastName: defaultLast },
  });

  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      await onDelete?.(id);
    } catch {
      toast.error('ลบไม่สำเร็จ');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleUpdate = async (values: UpdateFormValues) => {
    setLoadingUpdate(true);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      onUpdate?.(updated);
      toast.success('อัปเดตเรียบร้อย');
    } catch {
      toast.error('อัปเดตไม่สำเร็จ');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success(`รหัสนักศึกษา ${id} ถูกคัดลอกแล้ว`);
    } catch {
      toast.error('คัดลอกไม่สำเร็จ');
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-0">
        <div className="space-y-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription className="text-sm">ID: {id}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-2">
        <div className="flex justify-between gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
          >
            คัดลอกรหัส
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
              >
                รายละเอียด / แก้ไข
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>แก้ไขนักศึกษา</AlertDialogTitle>
              </AlertDialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleUpdate)}
                  className="space-y-4 mt-2"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ชื่อ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>นามสกุล</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>ปิด</AlertDialogCancel>
                    <Button
                      type="submit"
                      disabled={loadingUpdate}
                    >
                      {loadingUpdate ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                  </div>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                disabled={loadingDelete}
              >
                {loadingDelete ? 'กำลังลบ...' : 'ลบ'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>ลบ</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
