import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Trash2, Send } from "lucide-react";

import { QuestionEntity } from "@/features/courses/domain/entities";

interface QuestionsTabProps {
  isAdmin: boolean;
  questions?: QuestionEntity[];
  questionsLoading: boolean;
  openQuestionDialog: boolean;
  setOpenQuestionDialog: (value: boolean) => void;
  questionForm: {
    title: string;
    description: string;
    questionType: QuestionEntity["questionType"];
    points: number;
    content: string;
    correctAnswer: string;
  };
  setQuestionForm: (value: any) => void;
  handleCreateQuestion: (event: React.FormEvent<HTMLFormElement>) => void;
  createQuestionMutation: {
    isPending: boolean;
  };
  deleteQuestionMutation: {
    isPending: boolean;
  };
  handleDeleteQuestion: (questionId: number) => void;
  openAnswerDialog: boolean;
  setOpenAnswerDialog: (value: boolean) => void;
  selectedQuestion: QuestionEntity | null;
  handleAnswerQuestion: (question: QuestionEntity) => void;
  answerForm: {
    answer: string;
  };
  setAnswerForm: (value: any) => void;
  handleSubmitAnswer: (e: React.FormEvent<HTMLFormElement>) => void;
  submitAnswer: {
    isPending: boolean;
  };
}

export const QuestionsTab = ({
  isAdmin,
  questions,
  questionsLoading,
  openQuestionDialog,
  setOpenQuestionDialog,
  questionForm,
  setQuestionForm,
  handleCreateQuestion,
  createQuestionMutation,
  deleteQuestionMutation,
  handleDeleteQuestion,
  openAnswerDialog,
  setOpenAnswerDialog,
  selectedQuestion,
  handleAnswerQuestion,
  answerForm,
  setAnswerForm,
  handleSubmitAnswer,
  submitAnswer,
}: QuestionsTabProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preguntas</h2>
        {isAdmin && (
          <Dialog open={openQuestionDialog} onOpenChange={setOpenQuestionDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Pregunta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Pregunta</DialogTitle>
                <DialogDescription>Crea una nueva pregunta para este curso</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <Label htmlFor="q-title">Título</Label>
                  <Input
                    id="q-title"
                    value={questionForm.title}
                    onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                    placeholder="Título de la pregunta"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="q-type">Tipo</Label>
                    <select
                      id="q-type"
                      value={questionForm.questionType}
                      onChange={(e) =>
                        setQuestionForm({
                          ...questionForm,
                          questionType: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="multiple_choice">Opción Múltiple</option>
                      <option value="short_answer">Respuesta Corta</option>
                      <option value="essay">Ensayo</option>
                      <option value="true_false">Verdadero/Falso</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="q-points">Puntos</Label>
                    <Input
                      id="q-points"
                      type="number"
                      min="1"
                      value={questionForm.points}
                      onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="q-content">Contenido</Label>
                  <Textarea
                    id="q-content"
                    value={questionForm.content}
                    onChange={(e) => setQuestionForm({ ...questionForm, content: e.target.value })}
                    placeholder="Escribe la pregunta"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="q-answer">Respuesta Correcta</Label>
                  <Textarea
                    id="q-answer"
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                    placeholder="Respuesta correcta"
                    rows={2}
                  />
                </div>
                <Button type="submit" disabled={createQuestionMutation.isPending} className="w-full">
                  {createQuestionMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Pregunta"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {questionsLoading ? (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((question: any) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{question.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{question.points} pts</span>
                    </div>
                    <p className="text-gray-700 mb-3">{question.content}</p>
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={deleteQuestionMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Dialog open={openAnswerDialog && selectedQuestion?.id === question.id} onOpenChange={setOpenAnswerDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-2" onClick={() => handleAnswerQuestion(question)}>
                            <Send className="w-4 h-4" />
                            Responder
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Responder Pregunta</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmitAnswer} className="space-y-4">
                            <div>
                              <Label htmlFor="answer">Tu Respuesta</Label>
                              <Textarea
                                id="answer"
                                value={answerForm.answer}
                                onChange={(e) => setAnswerForm({ answer: e.target.value })}
                                placeholder="Escribe tu respuesta"
                                rows={6}
                              />
                            </div>
                            <Button type="submit" disabled={submitAnswer.isPending} className="w-full">
                              {submitAnswer.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Enviando...
                                </>
                              ) : (
                                "Enviar Respuesta"
                              )}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No hay preguntas en este curso</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
