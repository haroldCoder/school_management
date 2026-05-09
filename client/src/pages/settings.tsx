import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-3xl font-bold tracking-tight">Configuración</h3>
                <p className="text-muted-foreground">Administre sus preferencias de cuenta y del sistema.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-blue-600" />
                        <CardTitle>Preferencias Generales</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Las opciones de configuración estarán disponibles próximamente.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
