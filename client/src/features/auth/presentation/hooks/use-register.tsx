import { toast } from "sonner";
import { useAuth } from "@common/hooks";
import { useLocation } from "wouter";
import { useState } from "react";
import { RegisterUserDto } from "@auth/application/dtos";

export function useRegister() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const [, setLocation] = useLocation();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: RegisterUserDto = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            username: formData.get("username") as string,
            password: formData.get("password") as string,
        };

        setIsSubmitting(true);

        try {
            await register(data);
            toast.success("¡Usuario registrado exitosamente!");
            setLocation("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Error al registrar el usuario");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        handleRegister,
        isSubmitting,
    };
}