import { trpc } from "@common/utils";
import { toast } from "sonner";
import { resolveTeacherError } from "../../application/errors";

export function useTeacherMutations(options?: { onSuccess?: () => void }) {
    const utils = trpc.useUtils();

    const updateTeacher = trpc.teachers.update.useMutation({
        onSuccess: () => {
            utils.teachers.list.invalidate();
            toast.success("Profesor actualizado exitosamente");
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(resolveTeacherError(error));
        },
    });

    const deleteTeacher = trpc.teachers.delete.useMutation({
        onSuccess: () => {
            utils.teachers.list.invalidate();
            toast.success("Profesor eliminado exitosamente");
        },
        onError: (error: any) => {
            toast.error(error.message || "Error al eliminar profesor");
        },
    });

    return {
        updateTeacher,
        deleteTeacher,
    };
}
