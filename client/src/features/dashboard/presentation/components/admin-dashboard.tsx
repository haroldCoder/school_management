import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, ClipboardList } from "lucide-react";
import { StatCard } from "./stat-card";

interface AdminDashboardProps {
    t: (key: string) => string;
    stats: any;
    isLoading: boolean;
}

export const AdminDashboard = ({ t, stats, isLoading }: AdminDashboardProps) => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{t("dashboard.title")}</h1>
                <p className="text-muted-foreground mt-2">{t("dashboard.welcome")} al Sistema de Gestión Escolar</p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label={t("dashboard.totalStudents")}
                    value={stats?.studentCount ?? 0}
                    loading={isLoading}
                />
                <StatCard
                    icon={GraduationCap}
                    label={t("dashboard.totalTeachers")}
                    value={stats?.teacherCount ?? 0}
                    loading={isLoading}
                />
                <StatCard
                    icon={BookOpen}
                    label={t("dashboard.totalCourses")}
                    value={stats?.courseCount ?? 0}
                    loading={isLoading}
                />
                <StatCard
                    icon={ClipboardList}
                    label={t("dashboard.activeEnrollments")}
                    value={stats?.enrollmentCount ?? 0}
                    loading={isLoading}
                />
            </div>

            {/* Welcome Section */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                    <CardTitle>{t("dashboard.welcome")}</CardTitle>
                    <CardDescription>
                        Administre eficientemente todos los aspectos de su institución educativa desde este panel central.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Use el menú lateral para acceder a las diferentes secciones: Alumnos, Profesores, Cursos, Matrículas,
                        Calificaciones y Reportes.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
