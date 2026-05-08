import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "@common/contexts";
import { useAuth } from "@common/hooks";
import { SchoolDashboardLayout } from "@/components/SchoolDashboardLayout";
import Dashboard from "@/pages/dashboard";
import Students from "@/pages/students";
import Teachers from "@/pages/teachers";
import Courses from "@/pages/Courses";
import Enrollments from "@/pages/Enrollments";
import Grades from "@/pages/Grades";
import Reports from "@/pages/Reports";
import CourseDetail from "@/pages/CourseDetail";
import Home from "@/pages/home";
import Settings from "@/pages/Settings";
import Auth from "@/pages/auth";
import { Loader2 } from "lucide-react";
import { useLocation, Route, Switch } from "wouter";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/auth");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SchoolDashboardLayout>
      <Component />
    </SchoolDashboardLayout>
  );
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/auth");
    }
    // Redirect students away from admin-only pages
    if (!loading && isAuthenticated && user?.role === "user") {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role === "user") {
    return null;
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
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/students">
        <AdminRoute component={Students} />
      </Route>
      <Route path="/teachers">
        <ProtectedRoute component={Teachers} />
      </Route>
      <Route path="/courses">
        <ProtectedRoute component={Courses} />
      </Route>
      <Route path="/enrollments">
        <AdminRoute component={Enrollments} />
      </Route>
      <Route path="/grades">
        <ProtectedRoute component={Grades} />
      </Route>
      <Route path="/reports">
        <ProtectedRoute component={Reports} />
      </Route>
      <Route path="/course-detail">
        <ProtectedRoute component={CourseDetail} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      <Route path="/auth" component={Auth} />
      <Route path="/404" component={NotFound} />
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
