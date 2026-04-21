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
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EnrollmentFormData {
  studentId: string;
  courseId: string;
  status: "enrolled" | "completed" | "dropped" | "pending";
}

export default function Enrollments() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormData>({
    studentId: "",
    courseId: "",
    status: "enrolled",
  });

  const utils = trpc.useUtils();
  const { data: enrollments, isLoading } = trpc.enrollments.list.useQuery({ limit: 100 });
  const { data: students } = trpc.students.list.useQuery({ limit: 100 });
  const { data: courses } = trpc.courses.list.useQuery({ limit: 100 });

  const createMutation = trpc.enrollments.create.useMutation({
    onSuccess: () => {
      utils.enrollments.list.invalidate();
      toast.success("Matrícula creada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear matrícula");
    },
  });

  const updateMutation = trpc.enrollments.update.useMutation({
    onSuccess: () => {
      utils.enrollments.list.invalidate();
      toast.success("Matrícula actualizada exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar matrícula");
    },
  });

  const deleteMutation = trpc.enrollments.delete.useMutation({
    onSuccess: () => {
      utils.enrollments.list.invalidate();
      toast.success("Matrícula eliminada exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar matrícula");
    },
  });

  const resetForm = () => {
    setFormData({
      studentId: "",
      courseId: "",
      status: "enrolled",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      studentId: parseInt(formData.studentId),
      courseId: parseInt(formData.courseId),
      status: formData.status,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleEdit = (enrollment: any) => {
    setFormData({
      studentId: enrollment.studentId.toString(),
      courseId: enrollment.courseId.toString(),
      status: enrollment.status,
    });
    setEditingId(enrollment.id);
    setOpen(true);
  };

  const getStudentName = (studentId: number) => {
    const student = students?.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "-";
  };

  const getCourseName = (courseId: number) => {
    const course = courses?.find((c) => c.id === courseId);
    return course ? course.name : "-";
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "enrolled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "dropped":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case "enrolled":
        return t("enrollments.enrolled");
      case "completed":
        return t("enrollments.completed");
      case "dropped":
        return t("enrollments.dropped");
      case "pending":
        return t("enrollments.pending");
      default:
        return status;
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("enrollments.title")}</h1>
          <p className="text-muted-foreground mt-1">Administre las matrículas de alumnos en cursos</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                {t("enrollments.enrollStudent")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? t("enrollments.editEnrollment") : t("enrollments.enrollStudent")}
                </DialogTitle>
                <DialogDescription>
                  Seleccione el alumno, curso y estado de la matrícula.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="studentId">{t("enrollments.student")} *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                    <SelectTrigger id="studentId">
                      <SelectValue placeholder="Seleccionar alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="courseId">{t("enrollments.course")} *</Label>
                  <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                    <SelectTrigger id="courseId">
                      <SelectValue placeholder="Seleccionar curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses?.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">{t("enrollments.status")}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enrolled">{t("enrollments.enrolled")}</SelectItem>
                      <SelectItem value="completed">{t("enrollments.completed")}</SelectItem>
                      <SelectItem value="dropped">{t("enrollments.dropped")}</SelectItem>
                      <SelectItem value="pending">{t("enrollments.pending")}</SelectItem>
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

      {/* Enrollments Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Listado de Matrículas</CardTitle>
          <CardDescription>Total: {enrollments?.length || 0} matrículas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : enrollments && enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50">
                    <TableHead>{t("enrollments.student")}</TableHead>
                    <TableHead>{t("enrollments.course")}</TableHead>
                    <TableHead>{t("enrollments.enrollmentDate")}</TableHead>
                    <TableHead>{t("enrollments.status")}</TableHead>
                    {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id} className="border-b border-border/30 hover:bg-muted/50">
                      <TableCell className="font-medium">{getStudentName(enrollment.studentId)}</TableCell>
                      <TableCell>{getCourseName(enrollment.courseId)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(enrollment.enrollmentDate).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(enrollment.status)}`}>
                          {getStatusLabel(enrollment.status)}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(enrollment)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm(t("common.confirmDelete"))) {
                                  deleteMutation.mutate({ id: enrollment.id });
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
            <div className="text-center py-8 text-muted-foreground">{t("enrollments.noEnrollments")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
