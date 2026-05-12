import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useAnswerMutations(courseId: number) {
  const utils = trpc.useUtils();

  const submitAnswer = trpc.answers.submit.useMutation({
    onSuccess: () => {
      utils.questions.list.invalidate({ courseId });
      utils.answers.getByStudent.invalidate();
      toast.success("Respuesta enviada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al enviar respuesta");
    },
  });

  const updateAnswer = trpc.answers.update.useMutation({
    onSuccess: () => {
      utils.questions.getAnswers.invalidate();
      toast.success("Calificación guardada");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al guardar calificación");
    },
  });

  return {
    submitAnswer,
    updateAnswer,
  };
}
