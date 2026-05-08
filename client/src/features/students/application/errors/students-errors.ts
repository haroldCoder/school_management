export function resolveStudentError(error: any): string {
    const message = error?.message || "Error al crear alumno";
    if (message.includes("Duplicate entry") || message.includes("UNIQUE")) {
        if (message.includes("email")) {
            return "Este email ya está registrado";
        }

        if (message.includes("enrollmentNumber")) {
            return "Este número de matrícula ya existe";
        }
        return "Este registro ya existe en el sistema";
    }
    return message;
}