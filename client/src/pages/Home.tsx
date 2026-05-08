import { useAuth } from "@common/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import {
  Users,
  BookOpen,
  BarChart3,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const features = [
    {
      icon: Users,
      title: "Gestión de Alumnos",
      description: "Administre información completa de estudiantes, matrículas y estados académicos.",
    },
    {
      icon: GraduationCap,
      title: "Gestión de Profesores",
      description: "Organice profesores, asignaciones de cursos y especialidades.",
    },
    {
      icon: BookOpen,
      title: "Gestión de Cursos",
      description: "Cree y administre cursos, asigne profesores y configure períodos académicos.",
    },
    {
      icon: BarChart3,
      title: "Calificaciones y Reportes",
      description: "Registre calificaciones, genere reportes y exporte datos en PDF/CSV.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-xl text-foreground">EduGest</h1>
          </div>
          <Button onClick={() => setLocation("/auth")}>
            Acceder
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Sistema Elegante de
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Gestión Escolar
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Administre eficientemente todos los aspectos de su institución educativa con una plataforma moderna,
              intuitiva y profesional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="gap-2"
            >
              Comenzar Ahora
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Conocer Más
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Características Principales</h3>
            <p className="text-muted-foreground text-lg">
              Todo lo que necesita para administrar su institución educativa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">¿Por qué elegirnos?</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Control de acceso basado en roles para administradores y usuarios",
              "Interfaz elegante y fácil de usar",
              "Reportes exportables en PDF y CSV",
              "Gestión completa de matrículas y calificaciones",
              "Seguridad y privacidad de datos garantizadas",
              "Soporte técnico disponible",
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-white">¿Listo para comenzar?</h3>
          <p className="text-blue-100 text-lg">
            Inicie sesión ahora y acceda a todas las herramientas de gestión escolar
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = getLoginUrl()}
            className="gap-2"
          >
            Iniciar Sesión
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 EduGest - Sistema de Gestión Escolar. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
