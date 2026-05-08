import { useState } from "react";
import { TeacherFormDataDTO } from "../../application/dtos";
import { initialStateTeacher } from "../constants";

export function useTeacherForm() {
    const [formData, setFormData] = useState<TeacherFormDataDTO>(initialStateTeacher);
    const [editingId, setEditingId] = useState<number | null>(null);

    const resetForm = () => {
        setFormData(initialStateTeacher);
        setEditingId(null);
    };

    return {
        formData,
        setFormData,
        editingId,
        setEditingId,
        resetForm,
    };
}
