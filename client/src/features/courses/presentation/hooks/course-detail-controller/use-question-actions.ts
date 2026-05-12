import { FormEvent } from "react";
import { useQuestionMutations } from "../use-question-mutations";
import { QuestionEntity } from "@/common/domain";
import { validateQuestion } from "@/features/courses/application/validators";
import { useQuestionForm } from "../use-question-form";

export function useQuestionActions({ courseId }: { courseId: number }) {
    const { deleteQuestionMutation, createQuestionMutation } = useQuestionMutations({ courseId });
    const { questionForm, setQuestionForm } = useQuestionForm();

    const handleDeleteQuestion = (id: number) => {
        if (confirm("¿Está seguro de que desea eliminar esta pregunta?")) {
            deleteQuestionMutation.mutate({ id });
        }
    };

    const handleCreateQuestion = async (e: FormEvent, actionCallback: () => void) => {
        e.preventDefault();

        if (!validateQuestion(questionForm as QuestionEntity)) return;

        await createQuestionMutation.mutateAsync({
            courseId,
            ...questionForm,
        });

        actionCallback();
        setQuestionForm({
            title: "",
            description: "",
            questionType: "short_answer",
            content: "",
            correctAnswer: "",
            points: 1,
        });
    };

    return {
        handleDeleteQuestion,
        handleCreateQuestion,
        setQuestionForm,
        questionForm,
        isCreateQuestionLoading: createQuestionMutation.isPending,
        isDeleteQuestionLoading: deleteQuestionMutation.isPending,
    };
}