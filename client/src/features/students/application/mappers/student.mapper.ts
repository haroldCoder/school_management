import { StudentFormDataDTO } from "../dtos";
import { CreateStudentDTO } from "../dtos";

export function toCreateStudentDTO(
    form: StudentFormDataDTO
): CreateStudentDTO {
    return {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || "",
        phone: form.phone || "",
        dateOfBirth: form.dateOfBirth || "",
        enrollmentNumber: form.enrollmentNumber,
        status: form.status,
        password: form.password,
    };
}