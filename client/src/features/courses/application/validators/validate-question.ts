import { toast } from "sonner";
import { QuestionEntity } from "../../domain/entities";

export const validateQuestion = (questionForm: QuestionEntity): questionForm is QuestionEntity => {
    if (!questionForm.title.trim() || !questionForm.content.trim()) {
        toast.error("Título y contenido son requeridos");
        return false;
    }

    if (questionForm.points <= 0) {
        toast.error("Puntos deben ser mayores a 0");
        return false;
    }

    return true;
}