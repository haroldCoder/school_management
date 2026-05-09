import { useEnrollmentController } from "./use-enrollment-controller";
import { useI18n } from "@common/hooks";

export function useEnrollment() {
    const { t } = useI18n();
    const {
        enrollmentsData,
        studentsData,
        coursesData,
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
        updateEnrollment,
        deleteEnrollment,
        createEnrollment,
        getStudentName,
        getCourseName,
    } = useEnrollmentController();

    return {
        t,
        enrollmentsData,
        studentsData,
        coursesData,
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
        updateEnrollment,
        deleteEnrollment,
        createEnrollment,
        getStudentName,
        getCourseName,
    };
}