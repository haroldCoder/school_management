import { useState, FormEvent } from "react";
import { useAuth, useI18n } from "@common/hooks";
import { useLocation } from "wouter";
import { useMaterialMutations } from "./use-material-mutations";
import { useAnswerMutations } from "./use-answer-mutations";
import { useQuizMutations } from "./use-quiz-mutations";
import { useQuestionMutations } from "./use-question-mutations";
import { useMaterialForm } from "./use-material-form";
import { useQuestionForm } from "./use-question-form";
import { useAnswerForm } from "./use-answer-form";
import { useCourseDetailQuery } from "./courses-query";
import { useMaterialQuery } from "./use-material-query";
import { useQuestionsQuery } from "./use-questions-query";
import { useEnrollementQuery } from "./use-enrollement-query";
import { useAnswersQuery } from "./use-answers-query";
import { useStudentAnswersQuery } from "./use-student-answers-query";
import { validateAnswer, validateMaterialUpload, validateQuestion } from "../../application/validators";
import { QuestionEntity } from "../../domain/entities";
import { createFilePreview } from "../../infrastructure/files";

export function useCourseDetailController(courseId: number) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("materials");
  const isAdmin = user?.role === "admin";

  // Dialog states
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
  const [openAnswersListDialog, setOpenAnswersListDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  // Queries

  const { course, courseLoading } = useCourseDetailQuery({ courseId });
  const { materials, materialsLoading } = useMaterialQuery({ courseId });
  const { questions, questionsLoading } = useQuestionsQuery({ courseId });
  const { enrollments } = useEnrollementQuery({ courseId });
  const { answers, answersLoading } = useAnswersQuery({
    questionId: selectedQuestion?.id,
    enabled: isAdmin && openAnswersListDialog
  });

  const { studentAnswers, studentAnswersLoading } = useStudentAnswersQuery({
    studentId: user?.studentId ?? 0,
    courseId,
    enabled: !!user?.studentId && !isAdmin
  });

  // Form states
  const { materialForm, setMaterialForm } = useMaterialForm();
  const { questionForm, setQuestionForm } = useQuestionForm();
  const { answerForm, setAnswerForm } = useAnswerForm();

  // Mutations
  const { uploadMaterial, deleteMaterial } = useMaterialMutations(courseId);
  const { submitAnswer, updateAnswer } = useAnswerMutations(courseId);
  const { createQuestionMutation } = useQuizMutations();
  const { deleteQuestionMutation } = useQuestionMutations({ courseId });

  // Handlers
  const handleUploadMaterial = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateMaterialUpload(materialForm)) return;

    const { fileUrl, fileType } = await createFilePreview(materialForm.file);

    await uploadMaterial.mutateAsync({
      courseId,
      title: materialForm.title,
      description: materialForm.description || undefined,
      fileUrl,
      fileKey: `materials/${courseId}/${Date.now()}-${materialForm.file.name}`,
      fileType,
      fileSize: materialForm.file.size,
    });
    setOpenMaterialDialog(false);
    setMaterialForm({ title: "", description: "", file: null });
  };

  const handleCreateQuestion = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateQuestion(questionForm as QuestionEntity)) return;

    await createQuestionMutation.mutateAsync({
      courseId,
      ...questionForm,
    });
    setOpenQuestionDialog(false);
    setQuestionForm({
      title: "",
      description: "",
      questionType: "short_answer",
      content: "",
      correctAnswer: "",
      points: 1,
    });
  };

  const handleSubmitAnswer = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validateAnswer({ answer: answerForm.answer, selectedQuestion, studentId: user.id })) return;

    await submitAnswer.mutateAsync({
      questionId: selectedQuestion.id,
      studentUserId: user.id,
      courseId,
      answer: answerForm.answer,
    });
    setOpenAnswerDialog(false);
    setAnswerForm({ answer: "" });
    setSelectedQuestion(null);
  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este material?")) {
      deleteMaterial.mutate({ id });
    }
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar esta pregunta?")) {
      deleteQuestionMutation.mutate({ id });
    }
  };

  const handleAnswerQuestion = (question: any) => {
    setSelectedQuestion(question);
    setAnswerForm({ answer: "" });
    setOpenAnswerDialog(true);
  };

  const handleViewAnswers = (question: any) => {
    setSelectedQuestion(question);
    setOpenAnswersListDialog(true);
  };

  const handleGradeAnswer = async (answerId: number, data: { pointsEarned: number; feedback: string; isCorrect: number }) => {
    await updateAnswer.mutateAsync({
      id: answerId,
      ...data,
    });
  };

  return {
    t,
    user,
    setLocation,
    activeTab,
    setActiveTab,
    course,
    courseLoading,
    materials,
    materialsLoading,
    questions,
    questionsLoading,
    enrollments,
    openMaterialDialog,
    setOpenMaterialDialog,
    openQuestionDialog,
    setOpenQuestionDialog,
    openAnswerDialog,
    setOpenAnswerDialog,
    selectedQuestion,
    materialForm,
    setMaterialForm,
    questionForm,
    setQuestionForm,
    answerForm,
    setAnswerForm,
    handleUploadMaterial,
    handleCreateQuestion,
    handleSubmitAnswer,
    handleDeleteMaterial,
    handleDeleteQuestion,
    handleAnswerQuestion,
    handleViewAnswers,
    handleGradeAnswer,
    uploadMaterial,
    createQuestionMutation,
    submitAnswer,
    updateAnswer,
    deleteQuestionMutation,
    openAnswersListDialog,
    setOpenAnswersListDialog,
    answers,
    answersLoading,
    studentAnswers,
    studentAnswersLoading,
    isAdmin,
  };
}
