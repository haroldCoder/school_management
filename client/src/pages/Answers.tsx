import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AnswerFormData {
  questionId: number;
  answer: string;
}

export default function Answers() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [formData, setFormData] = useState<AnswerFormData>({
    questionId: 0,
    answer: "",
  });

  const utils = trpc.useUtils();
  const { data: enrollments } = trpc.enrollments.byStudent.useQuery(
    { studentId: user?.id || 0 },
    { enabled: !!user?.id }
  );
  const { data: courses } = trpc.courses.list.useQuery({ limit: 100 });
  const { data: questions, isLoading } = courseId
    ? trpc.questions.list.useQuery({ courseId, limit: 100 })
    : { data: [], isLoading: false };

  const submitMutation = trpc.answers.submit.useMutation({
    onSuccess: () => {
      if (courseId) {
        utils.questions.list.invalidate({ courseId });
      }
      toast.success("Respuesta enviada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar respuesta");
    },
  });

  const resetForm = () => {
    setFormData({
      questionId: 0,
      answer: "",
    });
    setSelectedQuestion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.answer.trim()) {
      toast.error("Debe escribir una respuesta");
      return;
    }

    if (!selectedQuestion || !courseId || !user?.id) {
      toast.error("Datos incompletos");
      return;
    }

    await submitMutation.mutateAsync({
      questionId: selectedQuestion.id,
      studentId: user.id,
      courseId,
      answer: formData.answer,
    });
  };

  const handleAnswerQuestion = (question: any): void => {
    setSelectedQuestion(question);
    setFormData({
      questionId: question.id,
      answer: "",
    });
    setOpen(true);
  };

  const userCourseIds = enrollments?.map((e) => e.courseId) || [];
  const userCourses = courses?.filter((c) => userCourseIds.includes(c.id)) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mis Respuestas</h1>
        <p className="text-gray-600">Responde las preguntas de tus cursos</p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label>Seleccionar Curso</Label>
          <select
            value={courseId || ""}
            onChange={(e) => setCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Seleccionar curso --</option>
            {userCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!courseId ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Selecciona un curso para ver sus preguntas</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{question.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {question.points} pts
                      </span>
                    </div>
                    {question.description && <p className="text-sm text-gray-600 mb-2">{question.description}</p>}
                    <p className="text-gray-700 mb-4">{question.content}</p>

                    <Dialog open={open && selectedQuestion?.id === question.id} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="gap-2"
                          onClick={() => handleAnswerQuestion(question)}
                        >
                          <Send className="w-4 h-4" />
                          Responder
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Responder Pregunta</DialogTitle>
                          <DialogDescription>{question.title}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="answer">Tu Respuesta</Label>
                            <Textarea
                              id="answer"
                              value={formData.answer}
                              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                              placeholder="Escribe tu respuesta aquí"
                              rows={6}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={submitMutation.isPending}
                            className="w-full"
                          >
                            {submitMutation.isPending ? (
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
}
