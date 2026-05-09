import { useGradesQuery, useEnrollmentsQuery, useStudentsQuery, useCoursesQuery } from "@common/hooks";

export function useGradeQueries() {
  const { data: grades, isLoading: gradesLoading } = useGradesQuery({ limit: 100 });
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollmentsQuery({ limit: 100, status: "enrolled" });
  const { data: students, isLoading: studentsLoading } = useStudentsQuery({ limit: 100, status: "active" });
  const { data: courses, isLoading: coursesLoading } = useCoursesQuery({ limit: 100 });

  return {
    grades,
    enrollments,
    students,
    courses,
    isLoading: gradesLoading || enrollmentsLoading || studentsLoading || coursesLoading,
  };
}
