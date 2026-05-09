import { CourseEntity } from "../../domain/entities";

export class CourseDbEntity {
    static toList(entities: any[]): CourseEntity[] {
        return entities.map(entity => this.toEntity(entity));
    }

    static toEntity(entity: any): CourseEntity {
        return {
            id: entity.id,
            name: entity.name,
            code: entity.code,
            description: entity.description,
            credits: entity.credits,
            teacherId: entity.teacherId,
            academicYear: entity.academicYear,
            semester: entity.semester,
            maxStudents: entity.maxStudents,
            status: entity.status,
        };
    }
}