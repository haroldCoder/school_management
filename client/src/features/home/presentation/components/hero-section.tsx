import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";

export const HeroSection = () => {
    return (
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
    );
};
