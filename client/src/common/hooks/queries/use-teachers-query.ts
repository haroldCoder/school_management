import { trpc } from "@common/utils";

export interface TeachersQueryParams {
  limit?: number;
  offset?: number;
}

export function useTeachersQuery(params?: TeachersQueryParams) {
  const defaultParams = { limit: 100, ...params };
  return trpc.teachers.list.useQuery(defaultParams);
}
