import { trpc } from "@common/utils";

export function useEnrollementQuery({ courseId }: { courseId: number }) {
    const { data: enrollments } = trpc.enrollments.list.useQuery(
        { limit: 100 },
        { enabled: !!courseId }
    );

    return {
        enrollments
    };
}