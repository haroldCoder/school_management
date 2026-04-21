import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { SchoolDashboardLayout } from "@/components/SchoolDashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Teachers from "@/pages/Teachers";
import Courses from "@/pages/Courses";
import Enrollments from "@/pages/Enrollments";
import Grades from "@/pages/Grades";
import Reports from "@/pages/Reports";
import Home from "@/pages/Home";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Home />;
  }

  return (
    <SchoolDashboardLayout>
      <Component />
    </SchoolDashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path={"/students"} component={() => <ProtectedRoute component={Students} />} />
      <Route path={"/teachers"} component={() => <ProtectedRoute component={Teachers} />} />
      <Route path={"/courses"} component={() => <ProtectedRoute component={Courses} />} />
      <Route path={"/enrollments"} component={() => <ProtectedRoute component={Enrollments} />} />
      <Route path={"/grades"} component={() => <ProtectedRoute component={Grades} />} />
      <Route path={"/reports"} component={() => <ProtectedRoute component={Reports} />} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
