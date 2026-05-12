import { trpc } from "@common/utils";
import { StudentAnswerMapper } from "@common/presentation";

export function useAnswersQuery({ questionId, enabled = true }: { questionId: number; enabled?: boolean }) {
  const { data, isLoading } = trpc.questions.getAnswers.useQuery(
    { questionId },
    { enabled: enabled && !!questionId }
  );

  return {
    answers: data ? StudentAnswerMapper.toEntityList(data) : [],
    answersLoading: isLoading,
  };
}
