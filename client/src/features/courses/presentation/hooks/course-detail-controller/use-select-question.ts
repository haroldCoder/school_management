import { useState } from "react";

export function useSelectQuestion() {
    const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

    return {
        selectedQuestion,
        setSelectedQuestion,
    };
}