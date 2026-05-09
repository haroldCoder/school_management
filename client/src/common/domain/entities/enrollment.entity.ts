import { StudentEntity } from "./student.entity";

export interface EnrollmentEntity {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string | Date;
  status: "enrolled" | "completed" | "dropped" | "pending" | null;
  student?: StudentEntity;
}
