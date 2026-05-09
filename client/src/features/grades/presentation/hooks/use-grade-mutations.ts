import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useGradeMutations() {
  const utils = trpc.useUtils();

  const createMutation = trpc.grades.create.useMutation({
    onSuccess: () => {
      utils.grades.list.invalidate();
      toast.success("Calificación creada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear calificación");
    },
  });

  const updateMutation = trpc.grades.update.useMutation({
    onSuccess: () => {
      utils.grades.list.invalidate();
      toast.success("Calificación actualizada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar calificación");
    },
  });

  const deleteMutation = trpc.grades.delete.useMutation({
    onSuccess: () => {
      utils.grades.list.invalidate();
      toast.success("Calificación eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar calificación");
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
