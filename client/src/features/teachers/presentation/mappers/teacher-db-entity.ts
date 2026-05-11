import { TeacherEntity } from "../../domain/entities";

export class TeacherMapper {
    static toDbEntity(teacher: any): TeacherEntity {
        return {
            id: teacher.id,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            email: teacher.email,
            phone: teacher.phone,
            specialization: teacher.specialization,
            employeeNumber: teacher.employeeNumber,
            hireDate: teacher.hireDate,
            status: teacher.status,
            idUser: teacher.idUser,
        };
    }

    static toListDbEntity(teachers: any[]): TeacherEntity[] {
        return teachers.map((teacher) => this.toDbEntity(teacher));
    }
}