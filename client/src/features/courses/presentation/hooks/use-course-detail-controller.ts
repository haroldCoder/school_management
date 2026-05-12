import { useState, FormEvent } from "react";
import { useAuth, useI18n } from "@common/hooks";
import { useLocation } from "wouter";
import { useAnswerMutations } from "./use-answer-mutations";
import { useMaterialForm } from "./use-material-form";
import { useAnswerForm } from "./use-answer-form";
import { useCourseDetailQuery } from "./courses-query";
import { useMaterialQuery } from "./use-material-query";
import { useQuestionsQuery } from "./use-questions-query";
import { useEnrollementQuery } from "./use-enrollement-query";
import { useAnswersQuery } from "./use-answers-query";
import { useStudentAnswersQuery } from "./use-student-answers-query";
import { validateAnswer } from "../../application/validators";
import { useCourseDialogs, useMaterialActions, useQuestionActions, useSelectQuestion } from "./course-detail-controller";

export function useCourseDetailController(courseId: number) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("materials");
  const isAdmin = user?.role === "admin";

  // Dialog states
  const {
    openMaterialDialog,
    setOpenMaterialDialog,
    openQuestionDialog,
    setOpenQuestionDialog,
    openAnswerDialog,
    setOpenAnswerDialog,
    openAnswersListDialog,
    setOpenAnswersListDialog
  } = useCourseDialogs();
  const { selectedQuestion, setSelectedQuestion } = useSelectQuestion();
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
  const { answerForm, setAnswerForm } = useAnswerForm();

  // Mutations
  const { submitAnswer, updateAnswer } = useAnswerMutations(courseId);

  // Handlers
  const { handleUploadMaterial, handleDeleteMaterial, isUploadMaterialPending } = useMaterialActions(courseId);

  const createQuestionCallback = () => {
    setOpenQuestionDialog(true);
  }

  const {
    handleCreateQuestion,
    handleDeleteQuestion,
    questionForm,
    setQuestionForm,
    isCreateQuestionLoading,
    isDeleteQuestionLoading
  } = useQuestionActions({ courseId });

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
    handleCreateQuestion: (e: FormEvent) => handleCreateQuestion(e, createQuestionCallback),
    handleSubmitAnswer,
    handleDeleteMaterial,
    handleDeleteQuestion,
    handleAnswerQuestion,
    handleViewAnswers,
    handleGradeAnswer,
    openAnswersListDialog,
    setOpenAnswersListDialog,
    answers,
    answersLoading,
    studentAnswers,
    studentAnswersLoading,
    isAdmin,
    isCreateQuestionLoading,
    isDeleteQuestionLoading,
    isSubmitAnswerLoading: submitAnswer.isPending,
    isUpdateAnswerLoading: updateAnswer.isPending,
    isUploadMaterialPending,
  };
}
