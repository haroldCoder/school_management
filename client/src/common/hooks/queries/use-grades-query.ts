import { trpc } from "@common/utils";

export interface GradesQueryParams {
  limit?: number;
  offset?: number;
}

export function useGradesQuery(params?: GradesQueryParams) {
  const defaultParams = { limit: 100, ...params };
  return trpc.grades.list.useQuery(defaultParams);
}
