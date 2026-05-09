import { useStudentsQuery } from "@common/hooks/queries";
import { useStudentForm } from "./use-student-form";
import { useStudentMutations } from "./use-student-mutations";
import { useStudentDialog } from "./use-student-dialog";
import { useStudentPermissions } from "./use-student-permissions";
import { useAuth } from "@common/hooks";
import { StudentEntity } from "../../domain/entities";
import { FormEvent } from "react";

export function useStudentController() {
    const { user } = useAuth();
    const query = useStudentsQuery();
    const { formData, editingId, setFormData, setEditingId, resetForm } = useStudentForm();
    const { updateStudent, createStudent, deleteStudent } = useStudentMutations({
        onSuccess: () => {
            setOpen(false);
            resetForm();
        }
    });
    const { open, setOpen } = useStudentDialog();
    const permissions = useStudentPermissions();
    const isAdmin = user?.role === "admin";

    const handleSubmit = async (e: FormEvent<Element>) => {
        e.preventDefault();

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
            address: formData.address || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            zipCode: formData.zipCode || undefined,
            enrollmentNumber: formData.enrollmentNumber || undefined,
            status: formData.status,
            password: formData.password
        };

        if (editingId) {
            await updateStudent.mutateAsync({ id: editingId, ...payload });
        } else {
            await createStudent.mutateAsync(payload);
        }
    };

    const handleEdit = async (student: StudentEntity) => {
        setFormData({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email || "",
            phone: student.phone || "",
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "",
            address: student.address || "",
            city: student.city || "",
            state: student.state || "",
            zipCode: student.zipCode || "",
            enrollmentNumber: student.enrollmentNumber || "",
            status: student.status,
            password: student.password || ""
        });
        setEditingId(student.id);
        setOpen(true);
    };


    return {
        ...query,
        ...permissions,
        isAdmin,
        handleSubmit,
        handleEdit,
        updateStudent,
        createStudent,
        formData,
        editingId,
        setOpen,
        open,
        setFormData,
        setEditingId,
        resetForm,
        deleteStudent
    };
}