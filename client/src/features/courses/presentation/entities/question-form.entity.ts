export interface QuestionFormEntity {
    title: string;
    description: string;
    questionType: "multiple_choice" | "short_answer" | "essay" | "true_false";
    content: string;
    correctAnswer: string;
    points: number;
}