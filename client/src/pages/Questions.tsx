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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface QuestionFormData {
  courseId: number;
  title: string;
  description: string;
  questionType: "multiple_choice" | "short_answer" | "essay" | "true_false";
  content: string;
  correctAnswer: string;
  points: number;
}

export default function Questions() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    courseId: 0,
    title: "",
    description: "",
    questionType: "short_answer",
    content: "",
    correctAnswer: "",
    points: 1,
  });

  const utils = trpc.useUtils();
  const { data: courses } = trpc.courses.list.useQuery({ limit: 100 });
  const { data: questions, isLoading } = courseId
    ? trpc.questions.list.useQuery({ courseId, limit: 100 })
    : { data: [], isLoading: false };

  const createMutation = trpc.questions.create.useMutation({
    onSuccess: () => {
      if (courseId) {
        utils.questions.list.invalidate({ courseId });
      }
      toast.success("Pregunta creada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear pregunta");
    },
  });

  const updateMutation = trpc.questions.update.useMutation({
    onSuccess: () => {
      if (courseId) {
        utils.questions.list.invalidate({ courseId });
      }
      toast.success("Pregunta actualizada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar pregunta");
    },
  });

  const deleteMutation = trpc.questions.delete.useMutation({
    onSuccess: () => {
      if (courseId) {
        utils.questions.list.invalidate({ courseId });
      }
      toast.success("Pregunta eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar pregunta");
    },
  });

  const resetForm = () => {
    setFormData({
      courseId: 0,
      title: "",
      description: "",
      questionType: "short_answer",
      content: "",
      correctAnswer: "",
      points: 1,
    });
    setSelectedQuestion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Título y contenido son requeridos");
      return;
    }

    if (!courseId) {
      toast.error("Debe seleccionar un curso");
      return;
    }

    if (selectedQuestion) {
      await updateMutation.mutateAsync({
        id: selectedQuestion.id,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync({
        ...formData,
        courseId,
      });
    }
  };

  const handleEdit = (question: any) => {
    setSelectedQuestion(question);
    setFormData({
      courseId: question.courseId,
      title: question.title,
      description: question.description || "",
      questionType: question.questionType,
      content: question.content,
      correctAnswer: question.correctAnswer || "",
      points: question.points,
    });
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar esta pregunta?")) {
      deleteMutation.mutate({ id });
    }
  };

  const questionTypeLabels: Record<string, string> = {
    multiple_choice: "Opción Múltiple",
    short_answer: "Respuesta Corta",
    essay: "Ensayo",
    true_false: "Verdadero/Falso",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Preguntas</h1>
        <p className="text-gray-600">Crea y gestiona preguntas para tus cursos</p>
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
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {user?.role === "admin" && courseId && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Pregunta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedQuestion ? "Editar Pregunta" : "Nueva Pregunta"}</DialogTitle>
                <DialogDescription>
                  {selectedQuestion ? "Actualiza los detalles de la pregunta" : "Crea una nueva pregunta para tu curso"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Pregunta sobre fotosíntesis"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción adicional"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Tipo de Pregunta</Label>
                    <select
                      id="type"
                      value={formData.questionType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
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
                    <Label htmlFor="points">Puntos</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">Contenido de la Pregunta</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Escribe la pregunta aquí"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="correctAnswer">Respuesta Correcta (opcional)</Label>
                  <Textarea
                    id="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    placeholder="Escribe la respuesta correcta aquí"
                    rows={2}
                  />
                </div>

                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full">
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : selectedQuestion ? (
                    "Actualizar Pregunta"
                  ) : (
                    "Crear Pregunta"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
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
                        {questionTypeLabels[question.questionType]}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{question.points} pts</span>
                    </div>
                    {question.description && <p className="text-sm text-gray-600 mb-2">{question.description}</p>}
                    <p className="text-gray-700 mb-3">{question.content}</p>
                    {question.correctAnswer && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 flex gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Respuesta Correcta</p>
                          <p className="text-sm text-green-700">{question.correctAnswer}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {user?.role === "admin" && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
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
