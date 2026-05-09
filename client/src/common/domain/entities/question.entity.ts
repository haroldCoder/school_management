export interface QuestionEntity {
    id: number;
    courseId: number;
    title: string;
    description?: string;
    questionType: "multiple_choice" | "short_answer" | "essay" | "true_false";
    content: string;
    correctAnswer?: string;
    points: number;
}