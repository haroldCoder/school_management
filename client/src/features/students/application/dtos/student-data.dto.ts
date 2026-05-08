export interface StudentFormDataDTO {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    enrollmentNumber: string;
    status: "active" | "inactive" | "graduated";
    password: string;
}