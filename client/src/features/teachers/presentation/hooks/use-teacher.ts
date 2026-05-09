import { useTeacherController } from "./use-teacher-controller";
import { useI18n } from "@common/hooks";

export function useTeacher() {
    const { t } = useI18n();
    const {
        teachersData,
        isLoading,
        formData,
        setFormData,
        handleSubmit,
        handleEdit,
        resetForm,
        open,
        setOpen,
        editingId,
        isAdmin,
        user,
        updateTeacher,
        deleteTeacher,
    } = useTeacherController();

    return {
        t,
        teachersData,
        isLoading,
        open,
        setOpen,
        formData,
        editingId,
        resetForm,
        setFormData,
        handleSubmit,
        handleEdit,
        isAdmin,
        user,
        updateTeacher,
        deleteTeacher,
    };
}