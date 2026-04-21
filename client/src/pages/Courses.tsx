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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

export default function Courses() {
  const { t } = useI18n();
  const { user } = useAuth();
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

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("courses.title")}</h1>
          <p className="text-muted-foreground mt-1">Administre la información de los cursos</p>
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
                    {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} className="border-b border-border/30 hover:bg-muted/50">
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell className="text-muted-foreground">{course.teacherId ? "Asignado" : "-"}</TableCell>
                      <TableCell>{course.academicYear}</TableCell>
                      <TableCell>{course.semester}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            course.status === "active"
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
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
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
                          </div>
                        </TableCell>
                      )}
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
