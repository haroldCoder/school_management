import { TeacherEntity } from "../../domain/entities";

export class TeacherMapper {
    static toDbEntity(teacher: any): TeacherEntity {
        return {
            id: teacher.id,
            firstName: teacher.first_name,
            lastName: teacher.last_name,
            email: teacher.email,
            phone: teacher.phone,
            specialization: teacher.specialization,
            employeeNumber: teacher.employee_number,
            hireDate: teacher.hire_date,
            status: teacher.status,
            idUser: teacher.id_user,
        };
    }

    static toListDbEntity(teachers: any[]): TeacherEntity[] {
        return teachers.map((teacher) => this.toDbEntity(teacher));
    }
}