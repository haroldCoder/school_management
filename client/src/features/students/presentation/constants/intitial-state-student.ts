import { StudentFormDataDTO } from "@students/application/dtos";

export const initialStateStudent: StudentFormDataDTO = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    enrollmentNumber: "",
    status: "active",
    password: "",
};