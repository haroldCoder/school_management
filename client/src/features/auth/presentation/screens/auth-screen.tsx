import { useLocation } from "wouter";
import { useAuth } from "@common/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { LoginForm, RegisterForm } from "../components";
import { useLogin, useRegister } from "../hooks";

export const AuthScreen = () => {
    const [, setLocation] = useLocation();
    const { isAuthenticated, loading } = useAuth();
    const { handleLogin, isSubmitting: isSubmittingLogin } = useLogin();
    const { handleRegister, isSubmitting: isSubmittingRegister } = useRegister();

    // Redirect if already authenticated
    if (isAuthenticated && !loading) {
        setLocation("/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Sistema Escolar</h1>
                    <p className="text-muted-foreground">Gestión Académica Simplificada</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register">Registrarse</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <LoginForm onSubmit={handleLogin} isSubmitting={isSubmittingLogin} />
                    </TabsContent>

                    <TabsContent value="register">
                        <RegisterForm onSubmit={handleRegister} isSubmitting={isSubmittingRegister} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
