import { useGradeController } from "../hooks";
import { GradeForm, GradeTable } from "../components";
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

export const GradeScreen = () => {
  const { t } = useI18n();
  const {
    grades,
    enrollments,
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
  } = useGradeController();

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

              <GradeForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                enrollments={enrollments}
                isPending={createMutation.isPending || updateMutation.isPending}
                getStudentName={getStudentName}
                getCourseName={getCourseName}
              />
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
            <GradeTable
              grades={grades}
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
            <div className="text-center py-8 text-muted-foreground">{t("grades.noGrades")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
