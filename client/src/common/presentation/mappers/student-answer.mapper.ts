import { StudentAnswerEntity } from "../../domain/entities";

export class StudentAnswerMapper {
  static toEntity(data: any): StudentAnswerEntity {
    return {
      id: data.id,
      questionId: data.questionId,
      studentId: data.studentId,
      courseId: data.courseId,
      answer: data.answer,
      isCorrect: data.isCorrect,
      pointsEarned: data.pointsEarned,
      feedback: data.feedback,
      submittedAt: new Date(data.submittedAt),
      studentName: data.studentName,
    };
  }

  static toEntityList(data: any[]): StudentAnswerEntity[] {
    return data.map(this.toEntity);
  }
}
