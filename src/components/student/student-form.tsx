'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateStudentInput, CreateStudentSchema } from '@/schema/student';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type StudentFormProps = { onCreated?: (data: any) => void };

const StudentForm: FC<StudentFormProps> = ({ onCreated }) => {
  const form = useForm<CreateStudentInput>({
    resolver: zodResolver(CreateStudentSchema),
    defaultValues: { id: '', firstName: '', lastName: '' },
  });

  const onSubmit = async (values: CreateStudentInput) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.status === 201) {
        const created = await res.json();
        onCreated?.(created);
        form.reset();
        toast.success('สร้างนักศึกษาเรียบร้อย');
        return;
      }
      const json = await res.json().catch(() => ({ error: 'ผิดพลาด' }));
      toast.error(json?.error || 'สร้างไม่สำเร็จ');
    } catch {
      toast.error('เกิดข้อผิดพลาดขณะสร้าง');
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>สร้างนักศึกษาใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสนักศึกษา</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="เช่น 6500000000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ชื่อจริง"
                      {...field}
                    />
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
                    <Input
                      placeholder="นามสกุล"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'กำลังสร้าง...' : 'สร้าง'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
