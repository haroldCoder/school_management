import { useAuth } from "@common/hooks";
import { useLocation } from "wouter";
import { useEffect } from "react";
import {
    Navigation,
    HeroSection,
    FeaturesSection,
    BenefitsSection,
    CTASection,
    Footer
} from "../components";

export const HomeScreen = () => {
    const { isAuthenticated } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            setLocation("/dashboard");
        }
    }, [isAuthenticated, setLocation]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <Navigation setLocation={setLocation} />
            <HeroSection />
            <FeaturesSection />
            <BenefitsSection />
            <CTASection />
            <Footer />
        </div>
    )
}

