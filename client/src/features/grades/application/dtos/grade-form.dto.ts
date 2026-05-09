export interface GradeFormDTO {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  grade: string;
  gradeType: "midterm" | "final" | "assignment" | "participation" | "project";
}
