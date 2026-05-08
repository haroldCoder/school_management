import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@common/hooks";
import { toast } from "sonner";

export function useLogin() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, setLocation] = useLocation();
    const { login } = useAuth();

    const handleLogin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        setIsSubmitting(true);

        try {
            await login({
                username,
                password,
            });

            toast.success("¡Bienvenido de nuevo!");
            setLocation("/dashboard");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        handleLogin,
        isSubmitting,
    };
}