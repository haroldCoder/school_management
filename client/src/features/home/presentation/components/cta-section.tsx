import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";

export const CTASection = () => {
    return (
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
    );
};
