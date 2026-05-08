import { trpc } from "@common/utils";

export function useCourseQuery() {
  const { data: courses, isLoading } = trpc.courses.list.useQuery({ limit: 100 });

  return {
    courses,
    isLoading,
  };
}
