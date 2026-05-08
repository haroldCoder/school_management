import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useEnrollmentMutations() {
  const utils = trpc.useUtils();

  const createMutation = trpc.enrollments.create.useMutation({
    onSuccess: () => {
      utils.enrollments.list.invalidate();
      toast.success("Matrícula creada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear matrícula");
    },
  });

  const updateMutation = trpc.enrollments.update.useMutation({
    onSuccess: () => {
      utils.enrollments.list.invalidate();
      toast.success("Matrícula actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar matrícula");
    },
  });

  const deleteMutation = trpc.enrollments.delete.useMutation({
    onSuccess: () => {
      utils.enrollments.list.invalidate();
      toast.success("Matrícula eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar matrícula");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
