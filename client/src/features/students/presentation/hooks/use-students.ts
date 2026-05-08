import { useI18n } from "@common/hooks";
import { useStudentController } from "./use-student-controller";

export function useStudents() {
  const { t } = useI18n();
  const {
    students,
    isLoading,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    resetForm,
    open,
    setOpen,
    editingId,
    setEditingId,
    isAdmin,
    updateStudent,
    deleteStudent,
    createStudent
  } = useStudentController();

  return {
    t,
    students,
    isLoading,
    open,
    setOpen,
    formData,
    editingId,
    setEditingId,
    resetForm,
    setFormData,
    handleSubmit,
    handleEdit,
    isAdmin,
    updateStudent,
    deleteStudent,
    createStudent
  };
}
