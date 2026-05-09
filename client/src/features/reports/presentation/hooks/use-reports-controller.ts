import { useReportsQueries } from "./use-reports-queries";
import { exportToCSVPresentation } from "../utils";
import { TeacherEntity } from "@teachers/domain/entities";
import { StudentEntity } from "@students/domain/entities";
import { GradeEntity } from "@/features/grades/domain/entities";

export function useReportsController() {
  const {
    students,
    teachers,
    courses,
    grades,
    isLoading,
    studentsLoading,
    teachersLoading,
    coursesLoading,
    gradesLoading,
  } = useReportsQueries();

  const exportStudentsCSV = () => exportToCSVPresentation<StudentEntity>(students as StudentEntity[], "estudiantes", ["firstName", "lastName", "email", "enrollmentNumber", "status", "city"]);

  const exportTeachersCSV = () => exportToCSVPresentation<TeacherEntity>(teachers as TeacherEntity[], "profesores", ["firstName", "lastName", "email", "specialization", "status"]);

  const exportGradesCSV = () => exportToCSVPresentation<GradeEntity>(grades as GradeEntity[], "calificaciones", ["studentId", "courseId", "grade", "gradeType", "recordedDate"]);

  return {
    students,
    teachers,
    courses,
    grades,
    isLoading,
    studentsLoading,
    teachersLoading,
    coursesLoading,
    gradesLoading,
    exportStudentsCSV,
    exportTeachersCSV,
    exportGradesCSV,
  };
}
