export interface QuizQuestionDTO {
  content: string;
  questionType: "multiple_choice" | "short_answer" | "essay" | "true_false";
  correctAnswer: string;
  points: number;
}

export interface QuizFormDTO {
  title: string;
  description: string;
  questions: QuizQuestionDTO[];
}
