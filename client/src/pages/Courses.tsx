import { useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit2, Trash2, Loader2, Eye, ClipboardList, X } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface CourseFormData {
  name: string;
  code: string;
  description: string;
  credits: string;
  teacherId: string;
  academicYear: string;
  semester: "1" | "2";
  maxStudents: string;
  status: "active" | "inactive" | "archived";
}

interface QuizQuestion {
  content: string;
  questionType: "multiple_choice" | "short_answer" | "essay" | "true_false";
  correctAnswer: string;
  points: number;
}

interface QuizFormData {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

const defaultQuestion = (): QuizQuestion => ({
  content: "",
  questionType: "short_answer",
  correctAnswer: "",
  points: 1,
});

export default function Courses() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Course dialog state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    name: "",
    code: "",
    description: "",
    credits: "",
    teacherId: "",
    academicYear: new Date().getFullYear().toString(),
    semester: "1",
    maxStudents: "",
    status: "active",
  });

  // Quiz dialog state
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [quizStep, setQuizStep] = useState<1 | 2>(1);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState<QuizFormData>({
    title: "",
    description: "",
    questions: [defaultQuestion()],
  });

  const utils = trpc.useUtils();
  const { data: courses, isLoading } = trpc.courses.list.useQuery({ limit: 100 });
  const { data: teachers } = trpc.teachers.list.useQuery({ limit: 100 });

  const createMutation = trpc.courses.create.useMutation({
    onSuccess: () => {
      utils.courses.list.invalidate();
      toast.success("Curso creado exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear curso");
    },
  });

  const updateMutation = trpc.courses.update.useMutation({
    onSuccess: () => {
      utils.courses.list.invalidate();
      toast.success("Curso actualizado exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar curso");
    },
  });

  const deleteMutation = trpc.courses.delete.useMutation({
    onSuccess: () => {
      utils.courses.list.invalidate();
      toast.success("Curso eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar curso");
    },
  });

  const createQuestionMutation = trpc.questions.create.useMutation();

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      credits: "",
      teacherId: "",
      academicYear: new Date().getFullYear().toString(),
      semester: "1",
      maxStudents: "",
      status: "active",
    });
    setEditingId(null);
  };

  const resetQuizForm = () => {
    setQuizForm({ title: "", description: "", questions: [defaultQuestion()] });
    setQuizStep(1);
    setSelectedCourse(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      code: formData.code,
      description: formData.description || undefined,
      credits: formData.credits ? parseInt(formData.credits) : undefined,
      teacherId: formData.teacherId ? parseInt(formData.teacherId) : undefined,
      academicYear: formData.academicYear,
      semester: formData.semester,
      maxStudents: formData.maxStudents ? parseInt(formData.maxStudents) : undefined,
      status: formData.status,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description || "",
      credits: course.credits?.toString() || "",
      teacherId: course.teacherId?.toString() || "",
      academicYear: course.academicYear,
      semester: course.semester,
      maxStudents: course.maxStudents?.toString() || "",
      status: course.status,
    });
    setEditingId(course.id);
    setOpen(true);
  };

  // ── Quiz handlers ──────────────────────────────────────────────────

  const handleRowClick = (course: any, e: React.MouseEvent) => {
    // Don't open quiz dialog when clicking action buttons
    if ((e.target as HTMLElement).closest("button")) return;

    if (isAdmin || isTeacher) {
      setSelectedCourse(course);
      setQuizForm({ title: "", description: "", questions: [defaultQuestion()] });
      setQuizStep(1);
      setQuizOpen(true);
    } else {
      // Students go straight to detail
      setLocation(`/course-detail?id=${course.id}`);
    }
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
      questions: [...prev.questions, defaultQuestion()],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuizForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
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
        await createQuestionMutation.mutateAsync({
          courseId: selectedCourse.id,
          title: `[${quizForm.title}] ${q.content.slice(0, 60)}`,
          description: quizForm.description || undefined,
          questionType: q.questionType,
          content: q.content,
          correctAnswer: q.correctAnswer || undefined,
          points: q.points,
        });
      }
      utils.questions.list.invalidate({ courseId: selectedCourse.id });
      toast.success(`Quiz "${quizForm.title}" creado con ${validQuestions.length} pregunta(s)`);
      setQuizOpen(false);
      resetQuizForm();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar el quiz");
    } finally {
      setIsSavingQuiz(false);
    }
  };

  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "user"; // teachers have role "user"

  const questionTypeLabel: Record<QuizQuestion["questionType"], string> = {
    multiple_choice: "Opción Múltiple",
    short_answer: "Respuesta Corta",
    essay: "Ensayo",
    true_false: "Verdadero / Falso",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("courses.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin || isTeacher
              ? "Haz clic en un curso para agregar un quiz"
              : "Administre la información de los cursos"}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                {t("courses.addCourse")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? t("courses.editCourse") : t("courses.addCourse")}</DialogTitle>
                <DialogDescription>
                  Complete los datos del curso. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("courses.name")} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">{t("courses.code")} *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">{t("courses.description")}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="credits">{t("courses.credits")}</Label>
                    <Input
                      id="credits"
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="teacherId">{t("courses.teacher")}</Label>
                    <Select
                      value={formData.teacherId}
                      onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                    >
                      <SelectTrigger id="teacherId">
                        <SelectValue placeholder="Seleccionar profesor" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers?.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="academicYear">{t("courses.academicYear")} *</Label>
                    <Input
                      id="academicYear"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester">{t("courses.semester")} *</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value: any) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger id="semester">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="maxStudents">{t("courses.maxStudents")}</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">{t("courses.status")}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("common.active")}</SelectItem>
                      <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
                      <SelectItem value="archived">{t("common.archived")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {t("common.save")}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    {t("common.cancel")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ── Quiz Dialog ───────────────────────────────────────────────── */}
      <Dialog
        open={quizOpen}
        onOpenChange={(v) => {
          setQuizOpen(v);
          if (!v) resetQuizForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              {quizStep === 1
                ? `Nuevo Quiz — ${selectedCourse?.name}`
                : `Preguntas del Quiz`}
            </DialogTitle>
            <DialogDescription>
              {quizStep === 1
                ? "Define el título y descripción del quiz."
                : `${quizForm.title} · Agrega las preguntas y respuestas correctas.`}
            </DialogDescription>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${quizStep === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              1
            </span>
            <span className={quizStep === 1 ? "font-medium text-foreground" : ""}>Información</span>
            <div className="flex-1 h-px bg-border" />
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${quizStep === 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              2
            </span>
            <span className={quizStep === 2 ? "font-medium text-foreground" : ""}>Preguntas</span>
          </div>

          {/* ── Step 1: Quiz info ── */}
          {quizStep === 1 && (
            <form onSubmit={handleQuizNext} className="space-y-4 flex-1">
              <div>
                <Label htmlFor="quiz-title">Título del Quiz *</Label>
                <Input
                  id="quiz-title"
                  placeholder="Ej: Examen Parcial Unidad 1"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quiz-desc">Descripción (opcional)</Label>
                <Textarea
                  id="quiz-desc"
                  placeholder="Instrucciones generales del quiz..."
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Siguiente — Agregar Preguntas →
                </Button>
                <Button type="button" variant="outline" onClick={() => setQuizOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* ── Step 2: Questions ── */}
          {quizStep === 2 && (
            <form onSubmit={handleSaveQuiz} className="flex flex-col flex-1 min-h-0 gap-4">
              <ScrollArea className="flex-1 pr-2" style={{ maxHeight: "55vh" }}>
                <div className="space-y-4">
                  {quizForm.questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="border border-border rounded-lg p-4 space-y-3 relative bg-card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Pregunta {idx + 1}
                        </span>
                        {quizForm.questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`q-content-${idx}`}>Pregunta *</Label>
                        <Textarea
                          id={`q-content-${idx}`}
                          placeholder="Escribe aquí la pregunta..."
                          value={q.content}
                          onChange={(e) => handleQuestionChange(idx, "content", e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`q-type-${idx}`}>Tipo</Label>
                          <Select
                            value={q.questionType}
                            onValueChange={(v) =>
                              handleQuestionChange(idx, "questionType", v as QuizQuestion["questionType"])
                            }
                          >
                            <SelectTrigger id={`q-type-${idx}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(
                                Object.entries(questionTypeLabel) as [
                                  QuizQuestion["questionType"],
                                  string,
                                ][]
                              ).map(([val, label]) => (
                                <SelectItem key={val} value={val}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`q-pts-${idx}`}>Puntos</Label>
                          <Input
                            id={`q-pts-${idx}`}
                            type="number"
                            min={1}
                            value={q.points}
                            onChange={(e) =>
                              handleQuestionChange(idx, "points", parseInt(e.target.value) || 1)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`q-answer-${idx}`}>Respuesta Correcta</Label>
                        <Input
                          id={`q-answer-${idx}`}
                          placeholder="Respuesta esperada o clave de corrección..."
                          value={q.correctAnswer}
                          onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-dashed"
                onClick={handleAddQuestion}
              >
                <Plus className="w-4 h-4" />
                Agregar Pregunta
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuizStep(1)}
                  disabled={isSavingQuiz}
                >
                  ← Atrás
                </Button>
                <Button type="submit" className="flex-1" disabled={isSavingQuiz}>
                  {isSavingQuiz ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-4 h-4 mr-2" />
                      Guardar Quiz ({quizForm.questions.filter((q) => q.content.trim()).length} preg.)
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Courses Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Listado de Cursos</CardTitle>
          <CardDescription>Total: {courses?.length || 0} cursos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50">
                    <TableHead>{t("courses.code")}</TableHead>
                    <TableHead>{t("courses.name")}</TableHead>
                    <TableHead>{t("courses.teacher")}</TableHead>
                    <TableHead>{t("courses.academicYear")}</TableHead>
                    <TableHead>{t("courses.semester")}</TableHead>
                    <TableHead>{t("courses.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow
                      key={course.id}
                      className={`border-b border-border/30 transition-colors ${isAdmin || isTeacher
                          ? "hover:bg-primary/5 cursor-pointer"
                          : "hover:bg-muted/50"
                        }`}
                      onClick={(e) => handleRowClick(course, e)}
                    >
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {course.name}
                          {(isAdmin || isTeacher) && (
                            <ClipboardList className="w-3.5 h-3.5 text-muted-foreground/50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {course.teacherId ? "Asignado" : "-"}
                      </TableCell>
                      <TableCell>{course.academicYear}</TableCell>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.status === "active"
                              ? "bg-green-100 text-green-800"
                              : course.status === "inactive"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {course.status === "active"
                            ? t("common.active")
                            : course.status === "inactive"
                              ? t("common.inactive")
                              : t("common.archived")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/course-detail?id=${course.id}`)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </Button>
                          {isAdmin && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(course)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm(t("common.confirmDelete"))) {
                                    deleteMutation.mutate({ id: course.id });
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t("courses.noCourses")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
