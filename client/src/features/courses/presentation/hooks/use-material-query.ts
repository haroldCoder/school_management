import { trpc } from "@common/utils";

export function useMaterialQuery({ courseId }: { courseId: number }) {
    const { data: materials, isLoading: materialsLoading } = trpc.materials.list.useQuery(
        { courseId, limit: 100 },
        { enabled: !!courseId }
    );

    return {
        materials,
        materialsLoading,
    };
}