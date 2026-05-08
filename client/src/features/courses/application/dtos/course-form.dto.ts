export interface CourseFormDTO {
  name: string;
  code: string;
  description: string;
  credits: string;
  academicYear: string;
  semester: "1" | "2";
  maxStudents: string;
  status: "active" | "inactive" | "archived";
}
