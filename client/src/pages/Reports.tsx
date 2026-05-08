import { useI18n } from "@common/hooks";
import { trpc } from "@common/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Reports() {
  const { t } = useI18n();
  const { data: students, isLoading: studentsLoading } = trpc.students.list.useQuery({ limit: 1000 });
  const { data: teachers, isLoading: teachersLoading } = trpc.teachers.list.useQuery({ limit: 1000 });
  const { data: courses, isLoading: coursesLoading } = trpc.courses.list.useQuery({ limit: 1000 });
  const { data: grades, isLoading: gradesLoading } = trpc.grades.list.useQuery({ limit: 1000 });

  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    try {
      const csv = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((header) => {
            const value = row[header];
            if (value === null || value === undefined) return "";
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return value;
          }).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Reporte ${filename} exportado exitosamente`);
    } catch (error) {
      toast.error("Error al exportar reporte");
    }
  };

  const exportStudentsCSV = () => {
    if (!students) return;
    const headers = ["firstName", "lastName", "email", "enrollmentNumber", "status", "city"];
    exportToCSV(students, "estudiantes", headers);
  };

  const exportTeachersCSV = () => {
    if (!teachers) return;
    const headers = ["firstName", "lastName", "email", "specialization", "status"];
    exportToCSV(teachers, "profesores", headers);
  };

  const exportGradesCSV = () => {
    if (!grades) return;
    const headers = ["studentId", "courseId", "grade", "gradeType", "recordedDate"];
    exportToCSV(grades, "calificaciones", headers);
  };

  const ReportCard = ({
    title,
    description,
    count,
    loading,
    onExportCSV,
  }: {
    title: string;
    description: string;
    count: number;
    loading: boolean;
    onExportCSV: () => void;
  }) => (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total de registros</p>
          <p className="text-3xl font-bold text-foreground">{loading ? "-" : count}</p>
        </div>
        <Button onClick={onExportCSV} disabled={loading || count === 0} className="w-full">
          <FileDown className="w-4 h-4 mr-2" />
          Exportar a CSV
        </Button>
      </CardContent>
    </Card>
  );

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

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Información General</CardTitle>
            <CardDescription>Resumen de la institución</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes</p>
                <p className="text-2xl font-bold text-foreground">{students?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profesores</p>
                <p className="text-2xl font-bold text-foreground">{teachers?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cursos</p>
                <p className="text-2xl font-bold text-foreground">{courses?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Calificaciones</p>
                <p className="text-2xl font-bold text-foreground">{grades?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
}
