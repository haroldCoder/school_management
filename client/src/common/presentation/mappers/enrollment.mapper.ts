import { EnrollmentEntity } from "../../domain/entities";

export class EnrollmentMapper {
  static toEntity(data: any): EnrollmentEntity {
    return {
      id: data.id,
      studentId: data.studentId,
      courseId: data.courseId,
      enrollmentDate: data.enrollmentDate,
      status: data.status,
      student: data.student ? {
        id: data.student.id,
        firstName: data.student.firstName,
        lastName: data.student.lastName,
        email: data.student.email,
        enrollmentNumber: data.student.enrollmentNumber,
        status: data.student.status,
        dateOfBirth: data.student.dateOfBirth,
        address: data.student.address,
        phone: data.student.phone,
        city: data.student.city,
      } : undefined,
    };
  }

  static toEntityList(data: any[]): EnrollmentEntity[] {
    if (!data) return [];
    return data.map((item) => this.toEntity(item));
  }
}
