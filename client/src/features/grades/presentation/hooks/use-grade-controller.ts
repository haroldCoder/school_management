import { useState } from "react";
import { useGradeQueries } from "./use-grade-queries";
import { useGradeMutations } from "./use-grade-mutations";
import { GradeFormDTO } from "../../application/dtos";
import { useAuth } from "@common/hooks";
import { getStudentName, getCourseName } from "@common/utils";

export function useGradeController() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<GradeFormDTO>({
    enrollmentId: "",
    studentId: "",
    courseId: "",
    grade: "",
    gradeType: "final",
  });

  const { grades, enrollments, students, courses, isLoading } = useGradeQueries();
  const { createMutation, updateMutation, deleteMutation } = useGradeMutations();

  const resetForm = () => {
    setFormData({
      enrollmentId: "",
      studentId: "",
      courseId: "",
      grade: "",
      gradeType: "final",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      enrollmentId: parseInt(formData.enrollmentId),
      studentId: parseInt(formData.studentId),
      courseId: parseInt(formData.courseId),
      grade: parseFloat(formData.grade),
      gradeType: formData.gradeType,
    };

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        grade: payload.grade,
        gradeType: payload.gradeType
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpen(false);
    resetForm();
  };

  const handleEdit = (grade: any) => {
    setFormData({
      enrollmentId: grade.enrollmentId.toString(),
      studentId: grade.studentId.toString(),
      courseId: grade.courseId.toString(),
      grade: grade.grade.toString(),
      gradeType: grade.gradeType,
    });
    setEditingId(grade.id);
    setOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return {
    grades,
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
    getStudentName: (id: number) => getStudentName(id, students || []),
    getCourseName: (id: number) => getCourseName(id, courses || []),
    isAdmin,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
