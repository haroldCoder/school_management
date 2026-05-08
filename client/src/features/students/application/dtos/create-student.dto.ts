export interface CreateStudentDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    enrollmentNumber: string;
    status: "active" | "inactive" | "graduated";
    password: string;
}