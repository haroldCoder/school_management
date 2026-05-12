export interface StudentAnswerEntity {
  id: number;
  questionId: number;
  studentId: number;
  courseId: number;
  answer: string;
  isCorrect: number | null;
  pointsEarned: number | null;
  feedback: string | null;
  submittedAt: Date;
  studentName?: string;
}
