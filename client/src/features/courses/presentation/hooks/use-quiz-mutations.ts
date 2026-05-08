import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useQuizMutations() {
    const utils = trpc.useUtils();

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
        createQuestionMutation,
        utils
    };
}