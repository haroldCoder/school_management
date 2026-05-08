import { useState } from "react";

export function useAnswerForm() {
    const [answerForm, setAnswerForm] = useState({
        answer: "",
    });

    return {
        answerForm,
        setAnswerForm
    }
}