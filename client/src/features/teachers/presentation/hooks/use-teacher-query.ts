import { trpc } from "@common/utils";

export function useTeacherQuery() {
    const { data: teachers, isLoading } = trpc.teachers.list.useQuery({ limit: 100 });

    return {
        teachers,
        isLoading,
    };
}
