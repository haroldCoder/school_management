import { QuestionEntity } from "@/common/domain";
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
import { Plus, Loader2, Trash2, Send, Eye } from "lucide-react";
import { AnswersList } from "./answers-list";
import { QuestionFormEntity } from "../../entities";

interface QuestionsTabProps {
  studentAnswers?: any[];
  isAdmin: boolean;
  openQuestionDialog: boolean;
  setOpenQuestionDialog: (value: boolean) => void;
  handleCreateQuestion: (event: React.FormEvent<HTMLFormElement>) => void;
  questionForm: QuestionFormEntity;
  setQuestionForm: (value: QuestionFormEntity) => void;
  isCreateQuestionLoading: boolean;
  isQuestionsLoading: boolean;
  questions: QuestionEntity[];
  handleDeleteQuestion: (questionId: number) => void;
  handleViewAnswers: (question: QuestionEntity) => void;
  isDeleteQuestionLoading: boolean;
  openAnswerDialog: boolean;
  setOpenAnswerDialog: (value: boolean) => void;
  openAnswersListDialog: boolean;
  setOpenAnswersListDialog: (value: boolean) => void;
  selectedQuestion: QuestionEntity | null;
  handleAnswerQuestion: (question: QuestionEntity) => void;
  handleSubmitAnswer: (event: React.FormEvent<HTMLFormElement>) => void;
  answerForm: any;
  setAnswerForm: (value: any) => void;
  isSubmitAnswerLoading: boolean;
  isUpdateAnswerLoading: boolean;
  answers: any[];
  answersLoading: boolean;
  handleGradeAnswer: (questionId: number, gradeData: any) => void;
}

export const QuestionsTab = ({
  studentAnswers,
  isAdmin,
  openQuestionDialog,
  setOpenQuestionDialog,
  questionForm,
  handleCreateQuestion,
  setQuestionForm,
  isCreateQuestionLoading,
  isQuestionsLoading,
  questions,
  handleDeleteQuestion,
  handleViewAnswers,
  isDeleteQuestionLoading,
  openAnswerDialog,
  setOpenAnswerDialog,
  openAnswersListDialog,
  setOpenAnswersListDialog,
  selectedQuestion,
  handleAnswerQuestion,
  handleSubmitAnswer,
  answerForm,
  setAnswerForm,
  isSubmitAnswerLoading,
  isUpdateAnswerLoading,
  answers,
  answersLoading,
  handleGradeAnswer,
}: QuestionsTabProps) => {
  const getStudentAnswer = (questionId: number) => {
    return studentAnswers?.find((a) => a.questionId === questionId);
  };
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
                <Button type="submit" disabled={isCreateQuestionLoading} className="w-full">
                  {isCreateQuestionLoading ? (
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

      {isQuestionsLoading ? (
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
                          onClick={() => handleViewAnswers(question)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Respuestas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={isDeleteQuestionLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {getStudentAnswer(question.id) ? (
                          <div className="p-4 border rounded-md bg-gray-50 space-y-2">
                            <p className="text-sm font-semibold text-gray-600 italic">Ya has respondido esta pregunta:</p>
                            <div className="p-2 bg-white border rounded text-gray-700">
                              {getStudentAnswer(question.id).answer}
                            </div>
                            {getStudentAnswer(question.id).isCorrect !== null && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm">
                                  <span className="font-semibold">Resultado:</span>{" "}
                                  {getStudentAnswer(question.id).isCorrect === 1 ? (
                                    <span className="text-green-600 font-bold">Correcto</span>
                                  ) : (
                                    <span className="text-red-600 font-bold">Incorrecto</span>
                                  )}
                                  {" - "}
                                  {getStudentAnswer(question.id).pointsEarned} puntos
                                </p>
                                {getStudentAnswer(question.id).feedback && (
                                  <p className="text-sm">
                                    <span className="font-semibold">Retroalimentación:</span>{" "}
                                    {getStudentAnswer(question.id).feedback}
                                  </p>
                                )}
                              </div>
                            )}
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
                                <Button type="submit" disabled={isSubmitAnswerLoading} className="w-full">
                                  {isSubmitAnswerLoading ? (
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

      <Dialog open={openAnswersListDialog} onOpenChange={setOpenAnswersListDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Respuestas: {selectedQuestion?.title}</DialogTitle>
          </DialogHeader>
          <AnswersList
            answers={answers}
            loading={answersLoading}
            onGrade={handleGradeAnswer}
            isGrading={isUpdateAnswerLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
