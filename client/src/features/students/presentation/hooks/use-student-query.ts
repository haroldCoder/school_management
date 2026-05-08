import { trpc } from "@common/utils";

export function useStudentQuery() {
    const {
        data: students,
        isLoading,
    } = trpc.students.list.useQuery({
        limit: 100,
    });

    return {
        students,
        isLoading,
    };
}