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

interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  enrollmentNumber: string;
  status: "active" | "inactive" | "graduated";
}

export default function Students() {
  const { t } = useI18n();
  const { user } = useAuth();
  console.log(user);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    enrollmentNumber: "",
    status: "active",
  });

  const utils = trpc.useUtils();
  const { data: students, isLoading } = trpc.students.list.useQuery({ limit: 100 });
  const createMutation = trpc.students.create.useMutation({
    onSuccess: () => {
      utils.students.list.invalidate();
      toast.success("Alumno creado exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al crear alumno";
      if (errorMessage.includes("Duplicate entry") || errorMessage.includes("UNIQUE")) {
        if (errorMessage.includes("email")) {
          toast.error("Este email ya está registrado");
        } else if (errorMessage.includes("enrollmentNumber")) {
          toast.error("Este número de matrícula ya existe");
        } else {
          toast.error("Este registro ya existe en el sistema");
        }
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const updateMutation = trpc.students.update.useMutation({
    onSuccess: () => {
      utils.students.list.invalidate();
      toast.success("Alumno actualizado exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error al actualizar alumno";
      if (errorMessage.includes("Duplicate entry") || errorMessage.includes("UNIQUE")) {
        if (errorMessage.includes("email")) {
          toast.error("Este email ya esta registrado");
        } else if (errorMessage.includes("enrollmentNumber")) {
          toast.error("Este numero de matricula ya existe");
        } else {
          toast.error("Este registro ya existe en el sistema");
        }
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const deleteMutation = trpc.students.delete.useMutation({
    onSuccess: () => {
      utils.students.list.invalidate();
      toast.success("Alumno eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar alumno");
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      enrollmentNumber: "",
      status: "active",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      address: formData.address || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      zipCode: formData.zipCode || undefined,
      enrollmentNumber: formData.enrollmentNumber || undefined,
      status: formData.status,
    };

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, ...payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const handleEdit = (student: any) => {
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email || "",
      phone: student.phone || "",
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "",
      address: student.address || "",
      city: student.city || "",
      state: student.state || "",
      zipCode: student.zipCode || "",
      enrollmentNumber: student.enrollmentNumber || "",
      status: student.status,
    });
    setEditingId(student.id);
    setOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("students.title")}</h1>
          <p className="text-muted-foreground mt-1">Administre la información de los alumnos</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                {t("students.addStudent")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? t("students.editStudent") : t("students.addStudent")}</DialogTitle>
                <DialogDescription>
                  Complete los datos del alumno. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t("students.firstName")} *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("students.lastName")} *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">{t("students.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t("students.phone")}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">{t("students.dateOfBirth")}</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="enrollmentNumber">{t("students.enrollmentNumber")}</Label>
                    <Input
                      id="enrollmentNumber"
                      value={formData.enrollmentNumber}
                      onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">{t("students.address")}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">{t("students.city")}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">{t("students.state")}</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">{t("students.zipCode")}</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">{t("students.status")}</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("common.active")}</SelectItem>
                      <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
                      <SelectItem value="graduated">Graduado</SelectItem>
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

      {/* Students Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Listado de Alumnos</CardTitle>
          <CardDescription>Total: {students?.length || 0} alumnos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50">
                    <TableHead>{t("students.firstName")}</TableHead>
                    <TableHead>{t("students.lastName")}</TableHead>
                    <TableHead>{t("students.email")}</TableHead>
                    <TableHead>{t("students.enrollmentNumber")}</TableHead>
                    <TableHead>{t("students.status")}</TableHead>
                    {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="border-b border-border/30 hover:bg-muted/50">
                      <TableCell className="font-medium">{student.firstName}</TableCell>
                      <TableCell>{student.lastName}</TableCell>
                      <TableCell className="text-muted-foreground">{student.email || "-"}</TableCell>
                      <TableCell>{student.enrollmentNumber || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${student.status === "active"
                            ? "bg-green-100 text-green-800"
                            : student.status === "inactive"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {student.status === "active"
                            ? t("common.active")
                            : student.status === "inactive"
                              ? t("common.inactive")
                              : "Graduado"}
                        </span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(student)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm(t("common.confirmDelete"))) {
                                  deleteMutation.mutate({ id: student.id });
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
            <div className="text-center py-8 text-muted-foreground">{t("students.noStudents")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
