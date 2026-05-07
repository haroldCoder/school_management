import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  BarChart3,
  Menu,
  X,
  LogOut,
  Settings,
  FileText,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SchoolDashboardLayoutProps {
  children: React.ReactNode;
}

export function SchoolDashboardLayout({ children }: SchoolDashboardLayoutProps) {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "user";

  const allNavigationItems = [
    { label: t("navigation.dashboard"), path: "/dashboard", icon: LayoutDashboard, roles: ["admin", "user"] },
    { label: t("navigation.students"), path: "/students", icon: Users, roles: ["admin"] },
    { label: t("navigation.teachers"), path: "/teachers", icon: GraduationCap, roles: ["admin", "user"] },
    { label: isStudent ? "Mis Cursos" : t("navigation.courses"), path: "/courses", icon: BookOpen, roles: ["admin", "user"] },
    { label: t("navigation.enrollments"), path: "/enrollments", icon: ClipboardList, roles: ["admin"] },
    { label: isStudent ? "Mis Calificaciones" : t("navigation.grades"), path: "/grades", icon: BarChart3, roles: ["admin", "user"] },
    { label: isStudent ? "Mis Reportes" : t("navigation.reports"), path: "/reports", icon: BarChart3, roles: ["admin", "user"] },
  ];

  const navigationItems = allNavigationItems.filter(
    (item) => item.roles.includes(user?.role ?? "")
  );

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border/50 shadow-sm transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">EduGest</h1>
                <p className="text-xs text-muted-foreground">Sistema Escolar</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2 px-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{user?.username || "Usuario"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role === "admin" ? "Administrador" : "Alumno"}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  {t("common.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("common.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex-1" />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
