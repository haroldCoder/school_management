import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GeneralInfoCardProps {
  studentsCount: number;
  teachersCount: number;
  coursesCount: number;
  gradesCount: number;
}

export const GeneralInfoCard = ({
  studentsCount,
  teachersCount,
  coursesCount,
  gradesCount,
}: GeneralInfoCardProps) => (
  <Card className="border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="text-lg">Información General</CardTitle>
      <CardDescription>Resumen de la institución</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Estudiantes</p>
          <p className="text-2xl font-bold text-foreground">{studentsCount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Profesores</p>
          <p className="text-2xl font-bold text-foreground">{teachersCount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Cursos</p>
          <p className="text-2xl font-bold text-foreground">{coursesCount}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Calificaciones</p>
          <p className="text-2xl font-bold text-foreground">{gradesCount}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
