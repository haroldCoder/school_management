import { useStudentsQuery, useTeachersQuery, useCoursesQuery, useGradesQuery } from "@common/hooks";

export function useReportsQueries() {
  const { data: students, isLoading: studentsLoading } = useStudentsQuery({ limit: 1000 });
  const { data: teachers, isLoading: teachersLoading } = useTeachersQuery({ limit: 1000 });
  const { data: courses, isLoading: coursesLoading } = useCoursesQuery({ limit: 1000 });
  const { data: grades, isLoading: gradesLoading } = useGradesQuery({ limit: 1000 });

  return {
    students,
    teachers,
    courses,
    grades,
    isLoading: studentsLoading || teachersLoading || coursesLoading || gradesLoading,
    studentsLoading,
    teachersLoading,
    coursesLoading,
    gradesLoading,
  };
}
