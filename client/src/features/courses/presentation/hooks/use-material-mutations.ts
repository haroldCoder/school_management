import { trpc } from "@common/utils";
import { toast } from "sonner";

export function useMaterialMutations(courseId: number) {
  const utils = trpc.useUtils();

  const uploadMaterial = trpc.materials.create.useMutation({
    onSuccess: () => {
      utils.materials.list.invalidate({ courseId });
      toast.success("Material subido exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al subir material");
    },
  });

  const deleteMaterial = trpc.materials.delete.useMutation({
    onSuccess: () => {
      utils.materials.list.invalidate({ courseId });
      toast.success("Material eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar material");
    },
  });

  return {
    uploadMaterial,
    deleteMaterial,
  };
}
