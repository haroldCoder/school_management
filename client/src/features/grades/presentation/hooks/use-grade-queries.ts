import { trpc } from "@common/utils";

export function useGradeQueries() {
  const { data: grades, isLoading: gradesLoading } = trpc.grades.list.useQuery({ limit: 100 });
  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.enrollments.list.useQuery({ limit: 100, status: "enrolled" });
  const { data: students, isLoading: studentsLoading } = trpc.students.list.useQuery({ limit: 100, status: "active" });
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery({ limit: 100 });

  return {
    grades,
    enrollments,
    students,
    courses,
    isLoading: gradesLoading || enrollmentsLoading || studentsLoading || coursesLoading,
  };
}
