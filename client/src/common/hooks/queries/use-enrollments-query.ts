import { trpc } from "@common/utils";

export interface EnrollmentsQueryParams {
  limit?: number;
  offset?: number;
  status?: "enrolled" | "dropped";
}

export function useEnrollmentsQuery(params?: EnrollmentsQueryParams) {
  const defaultParams = { limit: 100, ...params };
  return trpc.enrollments.list.useQuery(defaultParams);
}
