import { CheckCircle2 } from "lucide-react";
import { benefits } from "../constants";

export const BenefitsSection = () => {
    return (
        <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-foreground mb-4">¿Por qué elegirnos?</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <p className="text-foreground">{benefit}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
