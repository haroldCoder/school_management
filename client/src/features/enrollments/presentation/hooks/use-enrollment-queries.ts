import { trpc } from "@common/utils";

export function useEnrollmentQueries() {
  const { data: enrollments, isLoading: enrollmentsLoading } = trpc.enrollments.list.useQuery({ limit: 100 });
  const { data: students, isLoading: studentsLoading } = trpc.students.list.useQuery({ limit: 100 });
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery({ limit: 100 });

  return {
    enrollments,
    students,
    courses,
    isLoading: enrollmentsLoading || studentsLoading || coursesLoading,
  };
}
