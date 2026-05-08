export function resolveTeacherError(error: any): string {
    const message = error?.message || "Error en la operación del profesor";
    if (message.includes("Duplicate entry") || message.includes("UNIQUE")) {
        if (message.includes("email")) {
            return "Este email ya está registrado";
        }
        if (message.includes("employeeNumber")) {
            return "Este número de empleado ya existe";
        }
        return "Este registro ya existe en el sistema";
    }
    return message;
}
