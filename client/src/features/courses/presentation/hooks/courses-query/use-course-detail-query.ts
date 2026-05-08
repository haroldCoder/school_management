import { trpc } from "@common/utils";

export function useCourseDetailQuery({ courseId }: { courseId: number }) {
    const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
        { id: courseId },
        { enabled: !!courseId }
    );

    return {
        course,
        courseLoading,
    };
}