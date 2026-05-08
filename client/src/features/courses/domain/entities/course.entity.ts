export interface CourseEntity {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits?: number;
  academicYear: string;
  semester: "1" | "2";
  maxStudents?: number;
  status: "active" | "inactive" | "archived";
  teacherId?: number;
}
