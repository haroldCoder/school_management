import { trpc } from "@common/utils";

export interface StudentsQueryParams {
  limit?: number;
  offset?: number;
  status?: "active" | "inactive" | "graduated";
}

export function useStudentsQuery(params?: StudentsQueryParams) {
  const defaultParams = { limit: 100, ...params };
  return trpc.students.list.useQuery(defaultParams);
}
