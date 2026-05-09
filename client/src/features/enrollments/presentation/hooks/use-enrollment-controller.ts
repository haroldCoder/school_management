import { useState } from "react";
import { useEnrollmentQueries } from "./use-enrollment-queries";
import { useEnrollmentMutations } from "./use-enrollment-mutations";
import { EnrollmentFormDTO } from "../../application/dtos";
import { useAuth } from "@common/hooks";
import { getCourseName, getStudentName } from "@common/utils";

export function useEnrollmentController() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormDTO>({
    studentId: "",
    courseId: "",
    status: "enrolled",
  });

  const { enrollments, students, courses, isLoading } = useEnrollmentQueries();
  const { createMutation, updateMutation, deleteMutation } = useEnrollmentMutations();

  const resetForm = () => {
    setFormData({
      studentId: "",
      courseId: "",
      status: "enrolled",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      studentId: parseInt(formData.studentId),
      courseId: parseInt(formData.courseId),
      status: formData.status,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpen(false);
    resetForm();
  };

  const handleEdit = (enrollment: any) => {
    setFormData({
      studentId: enrollment.studentId.toString(),
      courseId: enrollment.courseId.toString(),
      status: enrollment.status,
    });
    setEditingId(enrollment.id);
    setOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return {
    enrollments,
    students,
    courses,
    isLoading,
    open,
    setOpen,
    editingId,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    getStudentName: (studentId: number) => getStudentName(studentId, students!),
    getCourseName: (courseId: number) => getCourseName(courseId, courses!),
    isAdmin,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
