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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GradeFormData {
  enrollmentId: string;
  studentId: string;
  courseId: string;
  grade: string;
  gradeType: "midterm" | "final" | "assignment" | "participation" | "project";
}

export default function Grades() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<GradeFormData>({
    enrollmentId: "",
    studentId: "",
    courseId: "",
    grade: "",
    gradeType: "final",
  });

  const utils = trpc.useUtils();
  const { data: grades, isLoading } = trpc.grades.list.useQuery({ limit: 100 });
  const { data: enrollments } = trpc.enrollments.list.useQuery({ limit: 100 });
  const { data: students } = trpc.students.list.useQuery({ limit: 100 });
  const { data: courses } = trpc.courses.list.useQuery({ limit: 100 });

  const createMutation = trpc.grades.create.useMutation({
    onSuccess: () => {
      utils.grades.list.invalidate();
      toast.success("Calificación creada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear calificación");
    },
  });

  const updateMutation = trpc.grades.update.useMutation({
    onSuccess: () => {
      utils.grades.list.invalidate();
      toast.success("Calificación actualizada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar calificación");
    },
  });

  const deleteMutation = trpc.grades.delete.useMutation({
    onSuccess: () => {
      utils.grades.list.invalidate();
      toast.success("Calificación eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar calificación");
    },
  });

  const resetForm = () => {
    setFormData({
      enrollmentId: "",
      studentId: "",
      courseId: "",
      grade: "",
      gradeType: "final",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      enrollmentId: parseInt(formData.enrollmentId),
      studentId: parseInt(formData.studentId),
      courseId: parseInt(formData.courseId),
      grade: parseFloat(formData.grade),
      gradeType: formData.gradeType,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, grade: payload.grade, gradeType: payload.gradeType });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleEdit = (grade: any) => {
    setFormData({
      enrollmentId: grade.enrollmentId.toString(),
      studentId: grade.studentId.toString(),
      courseId: grade.courseId.toString(),
      grade: grade.grade,
      gradeType: grade.gradeType,
    });
    setEditingId(grade.id);
    setOpen(true);
  };

  const getStudentName = (studentId: number) => {
    const student = students?.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "-";
  };

  const getCourseName = (courseId: number) => {
    const course = courses?.find((c) => c.id === courseId);
    return course ? course.code : "-";
  };

  const getGradeTypeLabel = (type: string | null) => {
    switch (type) {
      case "midterm":
        return t("grades.midterm");
      case "final":
        return t("grades.final");
      case "assignment":
        return t("grades.assignment");
      case "participation":
        return t("grades.participation");
      case "project":
        return t("grades.project");
      default:
        return type;
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("grades.title")}</h1>
          <p className="text-muted-foreground mt-1">Registre y administre las calificaciones de los alumnos</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                {t("grades.addGrade")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? t("grades.editGrade") : t("grades.addGrade")}</DialogTitle>
                <DialogDescription>
                  Ingrese los datos de la calificación del alumno.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="enrollmentId">{t("grades.student")} *</Label>
                  <Select
                    value={formData.enrollmentId}
                    onValueChange={(value) => {
                      const enrollment = enrollments?.find((e) => e.id === parseInt(value));
                      if (enrollment) {
                        setFormData({
                          ...formData,
                          enrollmentId: value,
                          studentId: enrollment.studentId.toString(),
                          courseId: enrollment.courseId.toString(),
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="enrollmentId">
                      <SelectValue placeholder="Seleccionar alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {enrollments?.map((enrollment) => (
                        <SelectItem key={enrollment.id} value={enrollment.id.toString()}>
                          {getStudentName(enrollment.studentId)} - {getCourseName(enrollment.courseId)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">{t("grades.grade")} *</Label>
                    <Input
                      id="grade"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="gradeType">{t("grades.gradeType")} *</Label>
                    <Select
                      value={formData.gradeType}
                      onValueChange={(value: any) => setFormData({ ...formData, gradeType: value })}
                    >
                      <SelectTrigger id="gradeType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">{t("grades.midterm")}</SelectItem>
                        <SelectItem value="final">{t("grades.final")}</SelectItem>
                        <SelectItem value="assignment">{t("grades.assignment")}</SelectItem>
                        <SelectItem value="participation">{t("grades.participation")}</SelectItem>
                        <SelectItem value="project">{t("grades.project")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

      {/* Grades Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Listado de Calificaciones</CardTitle>
          <CardDescription>Total: {grades?.length || 0} calificaciones</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : grades && grades.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50">
                    <TableHead>{t("grades.student")}</TableHead>
                    <TableHead>{t("grades.course")}</TableHead>
                    <TableHead>{t("grades.grade")}</TableHead>
                    <TableHead>{t("grades.gradeType")}</TableHead>
                    <TableHead>{t("grades.recordedDate")}</TableHead>
                    {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id} className="border-b border-border/30 hover:bg-muted/50">
                      <TableCell className="font-medium">{getStudentName(grade.studentId)}</TableCell>
                      <TableCell>{getCourseName(grade.courseId)}</TableCell>
                      <TableCell className="font-semibold">{grade.grade}</TableCell>
                      <TableCell>{getGradeTypeLabel(grade.gradeType)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(grade.recordedDate).toLocaleDateString("es-ES")}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(grade)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm(t("common.confirmDelete"))) {
                                  deleteMutation.mutate({ id: grade.id });
                                }
                              }}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t("grades.noGrades")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
