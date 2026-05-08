import { useState } from "react";
import { useI18n } from "@common/hooks";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@common/hooks";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Download,
  Trash2,
  Loader2,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Edit2,
  Send,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface CourseDetailParams {
  courseId: string;
}

export default function CourseDetail() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("materials");
  const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [openAnswerDialog, setOpenAnswerDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  // Get courseId from URL params
  const courseId = parseInt(new URLSearchParams(window.location.search).get("id") || "0");

  const utils = trpc.useUtils();

  // Queries
  const { data: course, isLoading: courseLoading } = trpc.courses.getById.useQuery(
    { id: courseId },
    { enabled: !!courseId }
  );

  const { data: materials, isLoading: materialsLoading } = trpc.materials.list.useQuery(
    { courseId, limit: 100 },
    { enabled: !!courseId }
  );

  const { data: questions, isLoading: questionsLoading } = trpc.questions.list.useQuery(
    { courseId, limit: 100 },
    { enabled: !!courseId }
  );

  const { data: enrollments } = trpc.enrollments.list.useQuery(
    { limit: 100 },
    { enabled: !!courseId }
  );

  // Material form state
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    title: "",
    description: "",
    questionType: "short_answer" as "multiple_choice" | "short_answer" | "essay" | "true_false",
    content: "",
    correctAnswer: "",
    points: 1,
  });

  // Answer form state
  const [answerForm, setAnswerForm] = useState({
    answer: "",
  });

  // Mutations
  const uploadMaterialMutation = trpc.materials.create.useMutation({
    onSuccess: () => {
      utils.materials.list.invalidate({ courseId });
      toast.success("Material subido exitosamente");
      setOpenMaterialDialog(false);
      setMaterialForm({ title: "", description: "", file: null });
    },
    onError: (error) => {
      toast.error(error.message || "Error al subir material");
    },
  });

  const deleteMaterialMutation = trpc.materials.delete.useMutation({
    onSuccess: () => {
      utils.materials.list.invalidate({ courseId });
      toast.success("Material eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar material");
    },
  });

  const createQuestionMutation = trpc.questions.create.useMutation({
    onSuccess: () => {
      utils.questions.list.invalidate({ courseId });
      toast.success("Pregunta creada exitosamente");
      setOpenQuestionDialog(false);
      setQuestionForm({
        title: "",
        description: "",
        questionType: "short_answer",
        content: "",
        correctAnswer: "",
        points: 1,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear pregunta");
    },
  });

  const deleteQuestionMutation = trpc.questions.delete.useMutation({
    onSuccess: () => {
      utils.questions.list.invalidate({ courseId });
      toast.success("Pregunta eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar pregunta");
    },
  });

  const submitAnswerMutation = trpc.answers.submit.useMutation({
    onSuccess: () => {
      utils.questions.list.invalidate({ courseId });
      toast.success("Respuesta enviada exitosamente");
      setOpenAnswerDialog(false);
      setAnswerForm({ answer: "" });
      setSelectedQuestion(null);
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar respuesta");
    },
  });

  // Handlers
  const handleUploadMaterial = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!materialForm.title.trim() || !materialForm.file) {
      toast.error("Título y archivo son requeridos");
      return;
    }

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(materialForm.file.type)) {
      toast.error("Solo se permiten PDFs e imágenes");
      return;
    }

    if (materialForm.file.size > 10 * 1024 * 1024) {
      toast.error("El archivo no puede exceder 10MB");
      return;
    }

    const fileUrl = URL.createObjectURL(materialForm.file);
    const fileType = materialForm.file.type.startsWith("image") ? "image" : "pdf";

    await uploadMaterialMutation.mutateAsync({
      courseId,
      title: materialForm.title,
      description: materialForm.description || undefined,
      fileUrl,
      fileKey: `materials/${courseId}/${Date.now()}-${materialForm.file.name}`,
      fileType,
      fileSize: materialForm.file.size,
    });
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionForm.title.trim() || !questionForm.content.trim()) {
      toast.error("Título y contenido son requeridos");
      return;
    }

    await createQuestionMutation.mutateAsync({
      courseId,
      ...questionForm,
    });
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerForm.answer.trim() || !selectedQuestion || !user?.id) {
      toast.error("Datos incompletos");
      return;
    }

    await submitAnswerMutation.mutateAsync({
      questionId: selectedQuestion.id,
      studentId: user.id,
      courseId,
      answer: answerForm.answer,
    });
  };

  const handleDeleteMaterial = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este material?")) {
      deleteMaterialMutation.mutate({ id });
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

  const getFileIcon = (fileType: string) => {
    return fileType === "pdf" ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setLocation("/courses")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Cursos
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Curso no encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setLocation("/courses")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-gray-600">{course.code}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="grades">Calificaciones</TabsTrigger>
        </TabsList>

        {/* MATERIALS TAB */}
        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Materiales del Curso</h2>
            {user?.role === "admin" && (
              <Dialog open={openMaterialDialog} onOpenChange={setOpenMaterialDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Subir Material
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Subir Nuevo Material</DialogTitle>
                    <DialogDescription>Sube un PDF o imagen para este curso</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadMaterial} className="space-y-4">
                    <div>
                      <Label htmlFor="material-title">Título</Label>
                      <Input
                        id="material-title"
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                        placeholder="Ej: Capítulo 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-desc">Descripción</Label>
                      <Input
                        id="material-desc"
                        value={materialForm.description}
                        onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                        placeholder="Descripción opcional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="material-file">Archivo</Label>
                      <Input
                        id="material-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.gif"
                        onChange={(e) =>
                          setMaterialForm({ ...materialForm, file: e.target.files?.[0] || null })
                        }
                      />
                    </div>
                    <Button type="submit" disabled={uploadMaterialMutation.isPending} className="w-full">
                      {uploadMaterialMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        "Subir Material"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {materialsLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : materials && materials.length > 0 ? (
            <div className="space-y-3">
              {materials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(material.fileType)}
                        <div className="flex-1">
                          <p className="font-medium">{material.title}</p>
                          {material.description && <p className="text-sm text-gray-600">{material.description}</p>}
                          <p className="text-xs text-gray-500">{formatFileSize(material.fileSize || 0)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Descargar
                          </Button>
                        </a>
                        {user?.role === "admin" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMaterial(material.id)}
                            disabled={deleteMaterialMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
                <p className="text-center text-gray-600">No hay materiales en este curso</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* QUESTIONS TAB */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Preguntas</h2>
            {user?.role === "admin" && (
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
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{question.title}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{question.points} pts</span>
                        </div>
                        <p className="text-gray-700 mb-3">{question.content}</p>
                        {user?.role === "admin" ? (
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
                                <Button type="submit" disabled={submitAnswerMutation.isPending} className="w-full">
                                  {submitAnswerMutation.isPending ? (
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
        </TabsContent>

        {/* STUDENTS TAB */}
        <TabsContent value="students" className="space-y-4">
          <h2 className="text-2xl font-bold">Estudiantes Inscritos</h2>
          {enrollments && enrollments.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Número de Matrícula</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>Estudiante {enrollment.studentId}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${enrollment.status === "enrolled"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}>
                            {enrollment.status === "enrolled" ? "Inscrito" : enrollment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">No hay estudiantes inscritos en este curso</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* GRADES TAB */}
        <TabsContent value="grades" className="space-y-4">
          <h2 className="text-2xl font-bold">Calificaciones</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Módulo de calificaciones en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
