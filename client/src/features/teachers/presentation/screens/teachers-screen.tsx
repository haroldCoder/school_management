import { TeacherForm, TeacherTable } from "../components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@common/hooks";
import { useTeacher } from "../hooks";
import { TeacherMapper } from "../mappers";

export const TeachersScreen = () => {
  const { t } = useI18n();
  const {
    teachersData,
    isLoading,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    open,
    setOpen,
    isAdmin,
    user,
    editingId,
    updateTeacher,
    deleteTeacher,
  } = useTeacher();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("teachers.title")}</h1>
          <p className="text-muted-foreground mt-1">Administre la información de los profesores</p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? t("teachers.editTeacher") : t("teachers.addTeacher")}</DialogTitle>
                <DialogDescription>
                  Complete los datos del profesor. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>

              <TeacherForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                isPending={updateTeacher.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Teachers Table */}
      <TeacherTable
        teachers={TeacherMapper.toListDbEntity(teachersData ?? [])}
        isLoading={isLoading}
        isAdmin={isAdmin}
        userId={user?.id}
        handleEdit={handleEdit}
        deleteMutation={deleteTeacher}
      />
    </div>
  );
};
