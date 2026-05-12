import { useState } from "react";
import { toast } from "sonner";
import { initialQuizState, defaultQuizQuestion } from "../constants";
import { QuizFormDTO, QuizQuestionDTO } from "../../application/dtos";
import { CourseEntity } from "../../domain/entities";

export function useQuizController() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseEntity | null>(null);
  const [quizStep, setQuizStep] = useState<1 | 2>(1);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState<QuizFormDTO>(initialQuizState);

  const resetQuizForm = () => {
    setQuizForm(initialQuizState);
    setQuizStep(1);
    setSelectedCourse(null);
  };

  const handleQuizNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      toast.error("El título del quiz es requerido");
      return;
    }
    setQuizStep(2);
  };

  const handleAddQuestion = () => {
    setQuizForm((prev) => ({
      ...prev,
      questions: [...prev.questions, defaultQuizQuestion()],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestionDTO, value: any) => {
    setQuizForm((prev) => {
      const updated = [...prev.questions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const validQuestions = quizForm.questions.filter((q) => q.content.trim());
    if (validQuestions.length === 0) {
      toast.error("Agrega al menos una pregunta con contenido");
      return;
    }

    setIsSavingQuiz(true);
    try {
      for (const q of validQuestions) {
        /*await createQuestionMutation.mutateAsync({
          courseId: selectedCourse.id,
          title: `[${quizForm.title}] ${q.content.slice(0, 60)}`,
          description: quizForm.description || undefined,
          questionType: q.questionType,
          content: q.content,
          correctAnswer: q.correctAnswer || undefined,
          points: q.points,
        });*/


      }
      //utils.questions.list.invalidate({ courseId: selectedCourse.id });
      toast.success(`Quiz "${quizForm.title}" creado con ${validQuestions.length} pregunta(s)`);
      setQuizOpen(false);
      resetQuizForm();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar el quiz");
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const openQuizDialog = (course: CourseEntity) => {
    setSelectedCourse(course);
    setQuizForm(initialQuizState);
    setQuizStep(1);
    setQuizOpen(true);
  };

  return {
    quizOpen,
    setQuizOpen,
    selectedCourse,
    quizStep,
    setQuizStep,
    isSavingQuiz,
    quizForm,
    setQuizForm,
    resetQuizForm,
    handleQuizNext,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleSaveQuiz,
    openQuizDialog,
  };
}
