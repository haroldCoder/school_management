import { useState } from "react";
import { StudentFormDataDTO } from "../../application/dtos";
import { initialStateStudent } from "../constants";

export function useStudentForm() {
    const [formData, setFormData] =
        useState<StudentFormDataDTO>(initialStateStudent);

    const [editingId, setEditingId] = useState<number | null>(null);

    const resetForm = () => {
        setEditingId(null);
        setFormData(initialStateStudent);
    };

    return {
        formData,
        setFormData,
        resetForm,
        editingId,
        setEditingId,
    };
}