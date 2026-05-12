import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useQuestionMutations({ courseId }: { courseId: number }) {
    const utils = trpc.useUtils();
    const deleteQuestionMutation = trpc.questions.delete.useMutation({
        onSuccess: () => {
            utils.questions.list.invalidate({ courseId });
            toast.success("Pregunta eliminada exitosamente");
        },
        onError: (error) => {
            toast.error(error.message || "Error al eliminar pregunta");
        },
    });

    const createQuestionMutation = trpc.questions.create.useMutation({
        onSuccess: () => {
            utils.questions.list.invalidate();
            toast.success("Quiz creado exitosamente");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error al crear quiz");
        },
    });

    return {
        deleteQuestionMutation,
        createQuestionMutation
    }
}