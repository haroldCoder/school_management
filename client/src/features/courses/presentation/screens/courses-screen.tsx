import { CourseForm, CourseTable, QuizDialog } from "../components";
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
import { useI18n } from "@common/hooks";
import { useCourse } from "../hooks";
import { CourseDbEntity } from "../mappers";

export const CoursesScreen = () => {
  const { t } = useI18n();
  const {
    coursesData,
    isLoading,
    open,
    setOpen,
    editingId,
    formData,
    setFormData,
    resetForm,
    handleSubmit,
    handleEdit,
    handleRowClick,
    isAdmin,
    user,
    createCourse,
    updateCourse,
    deleteCourse,
    quiz,
    setLocation,
  } = useCourse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {!isAdmin ? "Mis Cursos" : t("courses.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {!isAdmin
              ? "Cursos en los que estás matriculado"
              : isAdmin
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

              <CourseForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
                isPending={createCourse.isPending || updateCourse.isPending}
                user={user}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Quiz Dialog */}
      <QuizDialog
        quizOpen={quiz.quizOpen}
        setQuizOpen={quiz.setQuizOpen}
        selectedCourse={quiz.selectedCourse}
        quizStep={quiz.quizStep}
        setQuizStep={quiz.setQuizStep}
        isSavingQuiz={quiz.isSavingQuiz}
        quizForm={quiz.quizForm}
        setQuizForm={quiz.setQuizForm}
        handleQuizNext={quiz.handleQuizNext}
        handleAddQuestion={quiz.handleAddQuestion}
        handleRemoveQuestion={quiz.handleRemoveQuestion}
        handleQuestionChange={quiz.handleQuestionChange}
        handleSaveQuiz={quiz.handleSaveQuiz}
      />

      {/* Courses Table */}
      <CourseTable
        courses={CourseDbEntity.toList(coursesData ?? [])}
        isLoading={isLoading}
        isAdmin={isAdmin}
        handleEdit={handleEdit}
        deleteMutation={deleteCourse}
        handleRowClick={handleRowClick}
        onViewDetail={(id) => setLocation(`/course-detail?id=${id}`)}
      />
    </div>
  );
};
