import { trpc } from "@common/utils";

export interface CoursesQueryParams {
  limit?: number;
  offset?: number;
}

export function useCoursesQuery(params?: CoursesQueryParams) {
  const defaultParams = { limit: 100, ...params };
  return trpc.courses.list.useQuery(defaultParams);
}
