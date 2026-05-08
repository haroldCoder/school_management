import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSubmitting: boolean;
}

export const LoginForm = ({ onSubmit, isSubmitting }: LoginFormProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bienvenido</CardTitle>
                <CardDescription>
                    Ingresa tus credenciales para acceder al sistema.
                </CardDescription>
            </CardHeader>
            <form onSubmit={onSubmit}>
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
    );
};
