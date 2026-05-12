import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useQuizMutations() {
    const utils = trpc.useUtils();

    const createQuizMutation = () => {

    }

    return {
        createQuizMutation,
    };
}