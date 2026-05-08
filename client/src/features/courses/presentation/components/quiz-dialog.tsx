import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardList } from "lucide-react";
import { QuizFormDTO, QuizQuestionDTO } from "../../application/dtos";
import { CourseEntity } from "../../domain/entities";
import { StepIndicator } from "./step-indicator";
import { StepQuizInfo } from "./step-quiz-info";
import { StepQuestions } from "./step-questions";

interface QuizDialogProps {
  quizOpen: boolean;
  setQuizOpen: (open: boolean) => void;
  selectedCourse: CourseEntity | null;
  quizStep: 1 | 2;
  setQuizStep: (step: 1 | 2) => void;
  isSavingQuiz: boolean;
  quizForm: QuizFormDTO;
  setQuizForm: (form: QuizFormDTO) => void;
  handleQuizNext: (e: React.FormEvent) => void;
  handleAddQuestion: () => void;
  handleRemoveQuestion: (index: number) => void;
  handleQuestionChange: (index: number, field: keyof QuizQuestionDTO, value: any) => void;
  handleSaveQuiz: (e: React.FormEvent) => void;
}

const questionTypeLabel: Record<QuizQuestionDTO["questionType"], string> = {
  multiple_choice: "Opción Múltiple",
  short_answer: "Respuesta Corta",
  essay: "Ensayo",
  true_false: "Verdadero / Falso",
};

export const QuizDialog = ({
  quizOpen,
  setQuizOpen,
  selectedCourse,
  quizStep,
  setQuizStep,
  isSavingQuiz,
  quizForm,
  setQuizForm,
  handleQuizNext,
  handleAddQuestion,
  handleRemoveQuestion,
  handleQuestionChange,
  handleSaveQuiz,
}: QuizDialogProps) => {
  return (
    <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            {quizStep === 1 ? `Nuevo Quiz — ${selectedCourse?.name}` : `Preguntas del Quiz`}
          </DialogTitle>
          <DialogDescription>
            {quizStep === 1
              ? "Define el título y descripción del quiz."
              : `${quizForm.title} · Agrega las preguntas y respuestas correctas.`}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <StepIndicator quizStep={quizStep} />

        {/* Step 1: Quiz info */}
        {quizStep === 1 && (
          <StepQuizInfo quizForm={quizForm} setQuizForm={setQuizForm} handleQuizNext={handleQuizNext} setQuizOpen={setQuizOpen} />
        )}

        {/* Step 2: Questions */}
        {quizStep === 2 && (
          <StepQuestions
            quizForm={quizForm}
            questionTypeLabel={questionTypeLabel}
            handleSaveQuiz={handleSaveQuiz}
            setQuizStep={setQuizStep}
            isSavingQuiz={isSavingQuiz}
            handleRemoveQuestion={handleRemoveQuestion}
            handleQuestionChange={handleQuestionChange}
            handleAddQuestion={handleAddQuestion}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
