import { useState } from "react";

export function useQuestionForm() {
    const [questionForm, setQuestionForm] = useState({
        title: "",
        description: "",
        questionType: "short_answer" as "multiple_choice" | "short_answer" | "essay" | "true_false",
        content: "",
        correctAnswer: "",
        points: 1,
    });

    return {
        questionForm,
        setQuestionForm
    }
}