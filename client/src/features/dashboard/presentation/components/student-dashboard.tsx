import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, BarChart3 } from "lucide-react";
import { StatCard } from "./stat-card";

interface StudentDashboardProps {
    user: any;
    stats: any;
    isLoading: boolean;
}

export const StudentDashboard = ({ user, stats, isLoading }: StudentDashboardProps) => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    ¡Bienvenido, {user?.username || "Alumno"}!
                </h1>
                <p className="text-muted-foreground mt-2">
                    Tu panel de alumno — consulta tus cursos y calificaciones
                </p>
            </div>

            {/* Student Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={BookOpen}
                    label="Mis Cursos"
                    value={stats?.courseCount ?? 0}
                    loading={isLoading}
                />
                <StatCard
                    icon={ClipboardList}
                    label="Mis Matrículas"
                    value={stats?.enrollmentCount ?? 0}
                    loading={isLoading}
                />
                <StatCard
                    icon={BarChart3}
                    label="Mis Calificaciones"
                    value={(stats as any)?.gradeCount ?? 0}
                    loading={isLoading}
                />
            </div>

            {/* Info Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500/5 to-indigo-500/10">
                <CardHeader>
                    <CardTitle>Tu Espacio Académico</CardTitle>
                    <CardDescription>
                        Desde aquí puedes consultar toda tu información académica.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Usa el menú lateral para acceder a: <strong>Mis Cursos</strong>, <strong>Mis Calificaciones</strong>,
                        <strong> Mis Reportes</strong> y <strong>Mis Respuestas</strong>.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
