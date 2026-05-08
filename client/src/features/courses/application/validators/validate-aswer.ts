import { toast } from "sonner";

export type validateAnswerDTO = {
    answer: string
    selectedQuestion: any
    studentId: number | null
}

export const validateAnswer = (dto: validateAnswerDTO): dto is validateAnswerDTO => {
    const { answer, selectedQuestion, studentId } = dto;

    if (!answer?.trim() || !selectedQuestion || !studentId) {
        toast.error("Datos incompletos");
        return false;
    }

    return true;
}