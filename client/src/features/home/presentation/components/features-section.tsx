import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { features } from "../data";

export const FeaturesSection = () => {
    return (
        <section className="py-20 px-6 bg-white/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-foreground mb-4">Características Principales</h3>
                    <p className="text-muted-foreground text-lg">
                        Todo lo que necesita para administrar su institución educativa
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
