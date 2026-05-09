import { useStudents } from "../hooks";
import { StudentForm, StudentTable } from "../components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const StudentsScreen = () => {
  const {
    t,
    studentsData,
    isLoading,
    open,
    setOpen,
    editingId,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    deleteStudent,
    createStudent,
    updateStudent,
    isAdmin
  } = useStudents();

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

              <StudentForm
                t={t}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                isPending={createStudent.isPending || updateStudent.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Students Table */}
      <StudentTable
        t={t}
        students={studentsData}
        isLoading={isLoading}
        isAdmin={isAdmin}
        handleEdit={handleEdit}
        deleteMutation={deleteStudent}
      />
    </div>
  );
};
