import { trpc } from "@common/utils";

export function useReportsQueries() {
  const { data: students, isLoading: studentsLoading } = trpc.students.list.useQuery({ limit: 1000 });
  const { data: teachers, isLoading: teachersLoading } = trpc.teachers.list.useQuery({ limit: 1000 });
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery({ limit: 1000 });
  const { data: grades, isLoading: gradesLoading } = trpc.grades.list.useQuery({ limit: 1000 });

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
