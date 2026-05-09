import { QuestionEntity } from "../../domain/entities";

export class QuestionMapper {
  static toEntity(data: any): QuestionEntity {
    return {
      id: data.id,
      courseId: data.courseId,
      title: data.title,
      description: data.description,
      questionType: data.questionType,
      content: data.content,
      correctAnswer: data.correctAnswer,
      points: data.points,
    };
  }

  static toEntityList(data: any[]): QuestionEntity[] {
    if (!data) return [];
    return data.map((item) => this.toEntity(item));
  }
}
