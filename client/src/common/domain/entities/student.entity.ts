export interface StudentEntity {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    enrollmentNumber?: string;
    status: "active" | "inactive" | "graduated";
    password?: string;
}
