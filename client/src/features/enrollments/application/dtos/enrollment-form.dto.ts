export interface EnrollmentFormDTO {
  studentId: string;
  courseId: string;
  status: "enrolled" | "completed" | "dropped" | "pending";
}
