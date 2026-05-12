import { trpc } from "@common/utils";
import { StudentAnswerMapper } from "@common/presentation";

export function useStudentAnswersQuery({ studentId, courseId, enabled = true }: { studentId: number; courseId: number; enabled?: boolean }) {
  const { data, isLoading } = trpc.answers.getByStudent.useQuery(
    { studentId, courseId },
    { enabled: enabled && !!studentId && !!courseId }
  );

  return {
    studentAnswers: data ? StudentAnswerMapper.toEntityList(data) : [],
    studentAnswersLoading: isLoading,
  };
}
