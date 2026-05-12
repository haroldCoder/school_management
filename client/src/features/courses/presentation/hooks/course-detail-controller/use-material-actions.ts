import { validateMaterialUpload } from "@courses/application/validators";
import { createFilePreview } from "@courses/infrastructure/files";
import { useMaterialMutations } from "../use-material-mutations";
import { useMaterialForm } from "../use-material-form";

export function useMaterialActions(courseId: number) {
    const { uploadMaterial, deleteMaterial } = useMaterialMutations(courseId);
    const { materialForm, setMaterialForm } = useMaterialForm();

    const handleUploadMaterial = async () => {
        if (!validateMaterialUpload(materialForm)) return;

        const { fileUrl, fileType } = await createFilePreview(materialForm.file);

        await uploadMaterial.mutateAsync({
            courseId,
            title: materialForm.title,
            description: materialForm.description || undefined,
            fileUrl,
            fileKey: `materials/${courseId}/${Date.now()}`,
            fileType,
            fileSize: materialForm.file.size,
        });

        setMaterialForm({
            title: "",
            description: "",
            file: null,
        });
    };

    const handleDeleteMaterial = (id: number) => {
        if (confirm("¿Está seguro de que desea eliminar este material?")) {
            deleteMaterial.mutate({ id });
        }
    };

    return {
        materialForm,
        setMaterialForm,
        handleUploadMaterial,
        handleDeleteMaterial,
        isUploadMaterialPending: uploadMaterial.isPending,
    };
}