import { z } from 'zod';

export const CreateStudentSchema = z.object({
  id: z.string().min(1, 'กรุณาใส่รหัสนักศึกษา'),
  firstName: z.string().min(1, 'กรุณาใส่ชื่อจริง'),
  lastName: z.string().min(1, 'กรุณาใส่นามสกุล'),
});

export const UpdateStudentSchema = CreateStudentSchema.pick({
  firstName: true,
  lastName: true,
}).partial();

export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
