import React from 'react'
import { QuizFormDTO, QuizQuestionDTO } from '../../application/dtos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollAreaScrollbar } from "@/components/ui/scroll-area";
import { Plus, Loader2, ClipboardList, X } from "lucide-react";

interface StepQuestionsProps {
    quizForm: QuizFormDTO;
    questionTypeLabel: Record<QuizQuestionDTO["questionType"], string>;
    handleSaveQuiz: (e: React.FormEvent) => void;
    setQuizStep: (step: 1 | 2) => void;
    isSavingQuiz: boolean;
    handleRemoveQuestion: (index: number) => void;
    handleQuestionChange: (index: number, field: keyof QuizQuestionDTO, value: any) => void;
    handleAddQuestion: () => void;
}

export const StepQuestions = ({ quizForm, questionTypeLabel, handleSaveQuiz, setQuizStep, isSavingQuiz, handleRemoveQuestion, handleQuestionChange, handleAddQuestion }: StepQuestionsProps) => {
    return (
        <form onSubmit={handleSaveQuiz} className="flex flex-col flex-1 gap-4 overflow-auto">
            <div className="h-[50vh] min-h-0">
                <ScrollArea className="h-full pr-2 rounded-lg ">
                    <div className="space-y-4">
                        {quizForm.questions.map((q, idx) => (
                            <div
                                key={idx}
                                className="border border-border rounded-lg p-4 space-y-3 relative bg-card"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-muted-foreground">
                                        Pregunta {idx + 1}
                                    </span>
                                    {quizForm.questions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveQuestion(idx)}
                                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor={`q-content-${idx}`}>Pregunta *</Label>
                                    <Textarea
                                        id={`q-content-${idx}`}
                                        placeholder="Escribe aquí la pregunta..."
                                        value={q.content}
                                        onChange={(e) => handleQuestionChange(idx, "content", e.target.value)}
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor={`q-type-${idx}`}>Tipo</Label>
                                        <Select
                                            value={q.questionType}
                                            onValueChange={(v) =>
                                                handleQuestionChange(idx, "questionType", v as QuizQuestionDTO["questionType"])
                                            }
                                        >
                                            <SelectTrigger id={`q-type-${idx}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    Object.entries(questionTypeLabel) as [
                                                        QuizQuestionDTO["questionType"],
                                                        string,
                                                    ][]
                                                ).map(([val, label]) => (
                                                    <SelectItem key={val} value={val}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor={`q-pts-${idx}`}>Puntos</Label>
                                        <Input
                                            id={`q-pts-${idx}`}
                                            type="number"
                                            min={1}
                                            value={q.points}
                                            onChange={(e) =>
                                                handleQuestionChange(idx, "points", parseInt(e.target.value) || 1)
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor={`q-answer-${idx}`}>Respuesta Correcta</Label>
                                    <Input
                                        id={`q-answer-${idx}`}
                                        placeholder="Respuesta esperada o clave de corrección..."
                                        value={q.correctAnswer}
                                        onChange={(e) => handleQuestionChange(idx, "correctAnswer", e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <ScrollAreaScrollbar />
                </ScrollArea>
            </div>


            <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-dashed"
                onClick={handleAddQuestion}
            >
                <Plus className="w-4 h-4" />
                Agregar Pregunta
            </Button>

            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuizStep(1)}
                    disabled={isSavingQuiz}
                >
                    ← Atrás
                </Button>
                <Button type="submit" className="flex-1" disabled={isSavingQuiz}>
                    {isSavingQuiz ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <ClipboardList className="w-4 h-4 mr-2" />
                            Guardar Quiz ({quizForm.questions.filter((q) => q.content.trim()).length} preg.)
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
