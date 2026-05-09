import { useTeachersQuery } from "@common/hooks/queries";
import { useTeacherForm } from "./use-teacher-form";
import { useTeacherMutations } from "./use-teacher-mutations";
import { useTeacherDialog } from "./use-teacher-dialog";
import { useTeacherPermissions } from "./use-teacher-permissions";
import { TeacherEntity } from "../../domain/entities";
import { FormEvent } from "react";

export function useTeacherController() {
    const query = useTeachersQuery();
    const { formData, editingId, setFormData, setEditingId, resetForm } = useTeacherForm();
    const { open, setOpen } = useTeacherDialog();
    const { isAdmin, user } = useTeacherPermissions();

    const { updateTeacher, deleteTeacher } = useTeacherMutations({
        onSuccess: () => {
            setOpen(false);
            resetForm();
        }
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            specialization: formData.specialization || undefined,
            employeeNumber: formData.employeeNumber || undefined,
            hireDate: formData.hireDate ? new Date(formData.hireDate) : undefined,
            status: formData.status,
        };

        if (editingId) {
            await updateTeacher.mutateAsync({ id: editingId, ...payload });
        }
    };

    const handleEdit = (teacher: TeacherEntity) => {
        setFormData({
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email || "",
            phone: teacher.phone || "",
            specialization: teacher.specialization || "",
            employeeNumber: teacher.employeeNumber || "",
            hireDate: teacher.hireDate ? new Date(teacher.hireDate).toISOString().split("T")[0] : "",
            status: teacher.status,
        });
        setEditingId(teacher.id);
        setOpen(true);
    };

    return {
        ...query,
        formData,
        setFormData,
        editingId,
        resetForm,
        open,
        setOpen,
        isAdmin,
        user,
        handleSubmit,
        handleEdit,
        updateTeacher,
        deleteTeacher,
    };
}
