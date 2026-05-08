export interface EnrollmentEntity {
  id: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string | Date;
  status: "enrolled" | "completed" | "dropped" | "pending";
}
