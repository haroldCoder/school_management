import { useCourseDetailController } from "../hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { MaterialsTab } from "../components/detail/materials-tab";
import { QuestionsTab } from "../components/detail/questions-tab";
import { StudentsTab } from "../components/detail/students-tab";
import { EnrollmentMapper, QuestionMapper } from "@common/presentation";

export const CourseDetailScreen = () => {
  const courseId = parseInt(new URLSearchParams(window.location.search).get("id") || "0");
  const {
    course,
    courseLoading,
    activeTab,
    setActiveTab,
    setLocation,
    enrollments,
    isAdmin,
    materials,
    materialsLoading,
    openMaterialDialog,
    setOpenMaterialDialog,
    materialForm,
    setMaterialForm,
    handleUploadMaterial,
    uploadMaterial,
    handleDeleteMaterial,
    questions,
    questionsLoading,
    openQuestionDialog,
    setOpenQuestionDialog,
    questionForm,
    setQuestionForm,
    handleCreateQuestion,
    createQuestionMutation,
    deleteQuestionMutation,
    handleDeleteQuestion,
    openAnswerDialog,
    setOpenAnswerDialog,
    selectedQuestion,
    handleAnswerQuestion,
    answerForm,
    setAnswerForm,
    handleSubmitAnswer,
    submitAnswer,
    updateAnswer,
    handleViewAnswers,
    openAnswersListDialog,
    setOpenAnswersListDialog,
    answers,
    answersLoading,
    handleGradeAnswer,
    studentAnswers,
    studentAnswersLoading,
  } = useCourseDetailController(courseId);

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setLocation("/courses")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Cursos
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Curso no encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setLocation("/courses")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-gray-600">{course.code}</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="grades">Calificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <MaterialsTab
            isAdmin={isAdmin}
            materials={materials}
            materialsLoading={materialsLoading}
            openMaterialDialog={openMaterialDialog}
            setOpenMaterialDialog={setOpenMaterialDialog}
            materialForm={materialForm}
            setMaterialForm={setMaterialForm}
            handleUploadMaterial={handleUploadMaterial}
            uploadMaterial={uploadMaterial}
            handleDeleteMaterial={handleDeleteMaterial}
          />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionsTab
            isAdmin={isAdmin}
            questions={QuestionMapper.toEntityList(questions ?? [])}
            questionsLoading={questionsLoading}
            openQuestionDialog={openQuestionDialog}
            setOpenQuestionDialog={setOpenQuestionDialog}
            questionForm={questionForm}
            setQuestionForm={setQuestionForm}
            handleCreateQuestion={handleCreateQuestion}
            createQuestionMutation={createQuestionMutation}
            deleteQuestionMutation={deleteQuestionMutation}
            handleDeleteQuestion={handleDeleteQuestion}
            openAnswerDialog={openAnswerDialog}
            setOpenAnswerDialog={setOpenAnswerDialog}
            selectedQuestion={selectedQuestion}
            handleAnswerQuestion={handleAnswerQuestion}
            answerForm={answerForm}
            setAnswerForm={setAnswerForm}
            handleSubmitAnswer={handleSubmitAnswer}
            submitAnswer={submitAnswer}
            updateAnswer={updateAnswer}
            handleViewAnswers={handleViewAnswers}
            openAnswersListDialog={openAnswersListDialog}
            setOpenAnswersListDialog={setOpenAnswersListDialog}
            answers={answers}
            answersLoading={answersLoading}
            handleGradeAnswer={handleGradeAnswer}
            studentAnswers={studentAnswers}
          />
        </TabsContent>

        <TabsContent value="students">
          <StudentsTab enrollments={EnrollmentMapper.toEntityList(enrollments ?? [])} />
        </TabsContent>

        <TabsContent value="grades">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Calificaciones</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-600">Módulo de calificaciones en desarrollo</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
