import { useCourseController } from "./use-course-controller";
import { useI18n } from "@common/hooks";

export function useCourse() {
    const { t } = useI18n();
    const {
        coursesData,
        isLoading,
        quiz,
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
        updateCourse,
        deleteCourse,
        createCourse,
        handleRowClick,
        setLocation
    } = useCourseController();

    return {
        t,
        coursesData,
        isLoading,
        quiz,
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
        updateCourse,
        deleteCourse,
        createCourse,
        handleRowClick,
        setLocation
    };
}