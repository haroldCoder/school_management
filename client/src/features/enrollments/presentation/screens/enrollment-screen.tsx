import { useEnrollmentController } from "../hooks";
import { EnrollmentForm, EnrollmentTable } from "../components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useI18n } from "@common/hooks";

export const EnrollmentScreen = () => {
  const { t } = useI18n();
  const {
    enrollments,
    students,
    courses,
    isLoading,
    open,
    setOpen,
    editingId,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    getStudentName,
    getCourseName,
    isAdmin,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useEnrollmentController();

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

              <EnrollmentForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                students={students}
                courses={courses}
                isPending={createMutation.isPending || updateMutation.isPending}
              />
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
            <EnrollmentTable
              enrollments={enrollments}
              isAdmin={isAdmin}
              getStudentName={getStudentName}
              getCourseName={getCourseName}
              handleEdit={handleEdit}
              handleDelete={(id) => {
                if (confirm(t("common.confirmDelete"))) {
                  deleteMutation.mutate({ id });
                }
              }}
              deletePending={deleteMutation.isPending}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">{t("enrollments.noEnrollments")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
