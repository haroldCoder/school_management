export function resolveCourseError(error: any): string {
  const message = error?.message || "Error en la operación del curso";
  if (message.includes("Duplicate entry") || message.includes("UNIQUE")) {
    if (message.includes("code")) {
      return "Este código de curso ya existe";
    }
    return "Este registro ya existe en el sistema";
  }
  return message;
}
