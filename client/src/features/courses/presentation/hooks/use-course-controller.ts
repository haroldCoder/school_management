import { useState, FormEvent } from "react";
import { useCourseQuery } from "./courses-query";
import { useCourseMutations } from "./use-course-mutations";
import { useQuizController } from "./use-quiz-controller";
import { useAuth } from "@common/hooks";
import { useLocation } from "wouter";
import { initialCourseState } from "../constants";
import { CourseFormDTO } from "../../application/dtos";
import { CourseEntity } from "../../domain/entities";

export function useCourseController() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CourseFormDTO>(initialCourseState);

  const query = useCourseQuery();
  const quiz = useQuizController();

  const resetForm = () => {
    setFormData(initialCourseState);
    setEditingId(null);
  };

  const mutations = useCourseMutations({
    onSuccess: () => {
      setOpen(false);
      resetForm();
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      description: formData.description || undefined,
      credits: formData.credits ? parseInt(formData.credits) : undefined,
      academicYear: formData.academicYear,
      semester: formData.semester,
      maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
      status: formData.status,
    };

    if (editingId) {
      await mutations.updateCourse.mutateAsync({ id: editingId, ...payload });
    } else {
      await mutations.createCourse.mutateAsync(payload);
    }
  };

  const handleEdit = (course: CourseEntity) => {
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description || "",
      credits: course.credits?.toString() || "",
      academicYear: course.academicYear,
      semester: course.semester,
      maxStudents: course.maxStudents?.toString() || "",
      status: course.status,
    });
    setEditingId(course.id);
    setOpen(true);
  };

  const handleRowClick = (course: CourseEntity, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    if (isAdmin) {
      quiz.openQuizDialog(course);
    } else {
      setLocation(`/course-detail?id=${course.id}`);
    }
  };

  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "user";

  return {
    ...query,
    ...mutations,
    quiz,
    user,
    open,
    setOpen,
    editingId,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleRowClick,
    isAdmin,
    isStudent,
    setLocation,
  };
}
