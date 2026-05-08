import { trpc } from "@common/utils";
import { toast } from "sonner";
import { resolveStudentError } from "../../application/errors";

export function useStudentMutations(options?:
    { onSuccess?: () => void, onError?: (error: any) => void }) {
    const utils = trpc.useUtils();

    const createStudent =
        trpc.students.create.useMutation({
            onSuccess: () => {
                utils.students.list.invalidate();
                toast.success("Alumno creado exitosamente");
                options?.onSuccess?.();
            },
            onError: (error: any) => {
                toast.error(resolveStudentError(error));
            },
        });

    const updateStudent = trpc.students.update.useMutation({
        onSuccess: () => {
            utils.students.list.invalidate();
            toast.success("Alumno actualizado exitosamente");
            options?.onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(resolveStudentError(error));
        },
    });

    const deleteStudent = trpc.students.delete.useMutation({
        onSuccess: () => {
            utils.students.list.invalidate();
            toast.success("Alumno eliminado exitosamente");
        },
        onError: (error) => {
            toast.error(error.message || "Error al eliminar alumno");
        },
    });

    return {
        createStudent,
        updateStudent,
        deleteStudent
    };
}