import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { QuizFormDTO } from '../../application/dtos'

interface StepQuizInfoProps {
    quizForm: QuizFormDTO;
    setQuizForm: (form: QuizFormDTO) => void;
    handleQuizNext: (e: React.FormEvent) => void;
    setQuizOpen: (open: boolean) => void;
}

export const StepQuizInfo = ({ quizForm, setQuizForm, handleQuizNext, setQuizOpen }: StepQuizInfoProps) => {
    return (
        <form onSubmit={handleQuizNext} className="space-y-4 flex-1">
            <div>
                <Label htmlFor="quiz-title">Título del Quiz *</Label>
                <Input
                    id="quiz-title"
                    placeholder="Ej: Examen Parcial Unidad 1"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="quiz-desc">Descripción (opcional)</Label>
                <Textarea
                    id="quiz-desc"
                    placeholder="Instrucciones generales del quiz..."
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    rows={3}
                />
            </div>
            <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                    Siguiente — Agregar Preguntas →
                </Button>
                <Button type="button" variant="outline" onClick={() => setQuizOpen(false)}>
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
