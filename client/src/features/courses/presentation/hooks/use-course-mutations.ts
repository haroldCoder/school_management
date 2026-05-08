import { trpc } from "@common/utils";
import { toast } from "sonner";
import { resolveCourseError } from "../../application/errors";

export function useCourseMutations(options?: { onSuccess?: () => void }) {
  const utils = trpc.useUtils();

  const createCourse = trpc.courses.create.useMutation({
    onSuccess: () => {
      utils.courses.list.invalidate();
      toast.success("Curso creado exitosamente");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(resolveCourseError(error));
    },
  });

  const updateCourse = trpc.courses.update.useMutation({
    onSuccess: () => {
      utils.courses.list.invalidate();
      toast.success("Curso actualizado exitosamente");
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(resolveCourseError(error));
    },
  });

  const deleteCourse = trpc.courses.delete.useMutation({
    onSuccess: () => {
      utils.courses.list.invalidate();
      toast.success("Curso eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar curso");
    },
  });

  return {
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
