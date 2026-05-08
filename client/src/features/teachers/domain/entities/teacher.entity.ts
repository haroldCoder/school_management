export interface TeacherEntity {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    specialization?: string;
    employeeNumber?: string;
    hireDate?: Date;
    status: "active" | "inactive" | "on_leave";
    idUser?: string;
}
