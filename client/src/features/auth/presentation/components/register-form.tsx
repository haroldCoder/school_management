import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface RegisterFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
}

export const RegisterForm = ({ onSubmit, isSubmitting }: RegisterFormProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>
                    Completa el formulario para registrarte en el sistema.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
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
    );
};
