import { useCourseDetailController } from "../hooks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { MaterialsTab } from "../components/detail/materials-tab";
import { QuestionsTab } from "../components/detail/questions-tab";
import { StudentsTab } from "../components/detail/students-tab";

export const CourseDetailScreen = () => {
  const courseId = parseInt(new URLSearchParams(window.location.search).get("id") || "0");
  const controller = useCourseDetailController(courseId);

  if (controller.courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!controller.course) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => controller.setLocation("/courses")}>
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
        <Button variant="outline" onClick={() => controller.setLocation("/courses")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{controller.course.name}</h1>
          <p className="text-gray-600">{controller.course.code}</p>
        </div>
      </div>

      <Tabs
        value={controller.activeTab}
        onValueChange={controller.setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materiales</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          <TabsTrigger value="students">Estudiantes</TabsTrigger>
          <TabsTrigger value="grades">Calificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <MaterialsTab controller={controller} />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionsTab controller={controller} />
        </TabsContent>

        <TabsContent value="students">
          <StudentsTab controller={controller} />
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
