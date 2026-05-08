import { trpc } from "@common/utils";

export function useQuestionsQuery({ courseId }: { courseId: number }) {
    const { data: questions, isLoading: questionsLoading } = trpc.questions.list.useQuery(
        { courseId, limit: 100 },
        { enabled: !!courseId }
    );

    return {
        questions,
        questionsLoading,
    };
}