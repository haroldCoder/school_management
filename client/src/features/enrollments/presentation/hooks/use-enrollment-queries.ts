import { useEnrollmentsQuery, useStudentsQuery, useCoursesQuery } from "@common/hooks";

export function useEnrollmentQueries() {
  const { data: enrollments, isLoading: enrollmentsLoading } = useEnrollmentsQuery({ limit: 100 });
  const { data: students, isLoading: studentsLoading } = useStudentsQuery({ limit: 100 });
  const { data: courses, isLoading: coursesLoading } = useCoursesQuery({ limit: 100 });

  return {
    enrollments,
    students,
    courses,
    isLoading: enrollmentsLoading || studentsLoading || coursesLoading,
  };
}
