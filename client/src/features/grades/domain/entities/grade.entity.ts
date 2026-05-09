export interface GradeEntity {
  id: number;
  enrollmentId: number;
  studentId: number;
  courseId: number;
  grade: number;
  gradeType: "midterm" | "final" | "assignment" | "participation" | "project";
  recordedDate: string | Date;
}
