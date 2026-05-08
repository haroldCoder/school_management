import { MaterialFormDTO } from "../dtos";
import { toast } from "sonner";

export const validateMaterialUpload = (materialForm: MaterialFormDTO): materialForm is MaterialFormDTO & { file: File } => {
    if (!materialForm.title.trim() || !materialForm.file) {
        toast.error("Título y archivo son requeridos");
        return false;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(materialForm.file.type)) {
        toast.error("Solo se permiten PDFs e imágenes");
        return false;
    }

    if (materialForm.file.size > 10 * 1024 * 1024) {
        toast.error("El archivo no puede exceder 10MB");
        return false;
    }

    return true;
}