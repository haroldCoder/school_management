import { useI18n } from "@common/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReportsController } from "../hooks";
import { ReportCard, GeneralInfoCard } from "../components";

export const ReportsScreen = () => {
  const { t } = useI18n();
  const {
    students,
    teachers,
    courses,
    grades,
    studentsLoading,
    teachersLoading,
    gradesLoading,
    exportStudentsCSV,
    exportTeachersCSV,
    exportGradesCSV,
  } = useReportsController();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("reports.title")}</h1>
        <p className="text-muted-foreground mt-1">
          Genere y exporte reportes de estudiantes, profesores y calificaciones
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <ReportCard
          title="Listado de Estudiantes"
          description="Exporte la lista completa de estudiantes registrados"
          count={students?.length || 0}
          loading={studentsLoading}
          onExportCSV={exportStudentsCSV}
        />

        <ReportCard
          title="Listado de Profesores"
          description="Exporte la lista completa de profesores registrados"
          count={teachers?.length || 0}
          loading={teachersLoading}
          onExportCSV={exportTeachersCSV}
        />

        <ReportCard
          title="Calificaciones"
          description="Exporte todas las calificaciones registradas"
          count={grades?.length || 0}
          loading={gradesLoading}
          onExportCSV={exportGradesCSV}
        />

        <GeneralInfoCard
          studentsCount={students?.length || 0}
          teachersCount={teachers?.length || 0}
          coursesCount={courses?.length || 0}
          gradesCount={grades?.length || 0}
        />
      </div>

      {/* Info Section */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardHeader>
          <CardTitle>Información sobre Reportes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • Los reportes se exportan en formato CSV, que puede ser abierto en Excel, Google Sheets o cualquier
            editor de hojas de cálculo.
          </p>
          <p>• Los datos exportados incluyen solo los registros activos en el sistema.</p>
          <p>• Los reportes se generan en tiempo real con los datos más actualizados.</p>
          <p>• Para reportes personalizados, contacte al administrador del sistema.</p>
        </CardContent>
      </Card>
    </div>
  );
};
