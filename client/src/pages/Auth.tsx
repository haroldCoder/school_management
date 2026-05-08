import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@common/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
    const [, setLocation] = useLocation();
    const { login, register, isAuthenticated, loading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated && !loading) {
        setLocation("/dashboard");
        return null;
    }

    useEffect(() => {
        console.log(isAuthenticated, loading);
    }, [isAuthenticated, loading]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        setIsSubmitting(true);
        try {
            await login({ username, password });
            toast.success("¡Bienvenido de nuevo!");
            setLocation("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Error al iniciar sesión");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;

        setIsSubmitting(true);
        try {
            await register({ username, password, firstName, lastName, email });
            toast.success("Cuenta creada exitosamente");
            setLocation("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Error al registrarse");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <Card>
                            <CardHeader>
                                <CardTitle>Bienvenido</CardTitle>
                                <CardDescription>
                                    Ingresa tus credenciales para acceder al sistema.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleLogin}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-username">Usuario</Label>
                                        <Input id="login-username" name="username" placeholder="Nombre de usuario" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Contraseña</Label>
                                        <Input id="login-password" name="password" type="password" required />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Iniciar Sesión
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card>
                            <CardHeader>
                                <CardTitle>Crear Cuenta</CardTitle>
                                <CardDescription>
                                    Completa el formulario para registrarte en el sistema.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleRegister}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-name">Nombre</Label>
                                        <Input id="reg-name" name="firstName" placeholder="Ej: Juan" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-name">Apellido</Label>
                                        <Input id="reg-name" name="lastName" placeholder="Ej: Pérez" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">Correo Electrónico</Label>
                                        <Input id="reg-email" name="email" type="email" placeholder="juan@ejemplo.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-username">Nombre de Usuario</Label>
                                        <Input id="reg-username" name="username" placeholder="usuario123" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password">Contraseña</Label>
                                        <Input id="reg-password" name="password" type="password" required />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Registrarse
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
