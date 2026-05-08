export interface TeacherFormDataDTO {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    specialization?: string;
    employeeNumber?: string;
    hireDate: string;
    status: "active" | "inactive" | "on_leave";
}
