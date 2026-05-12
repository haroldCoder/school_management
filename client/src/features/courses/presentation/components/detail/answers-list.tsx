import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, Save } from "lucide-react";
import { StudentAnswerEntity } from "@/common/domain/entities";
import { useState } from "react";

interface AnswersListProps {
  answers: StudentAnswerEntity[];
  loading: boolean;
  onGrade: (answerId: number, gradeData: { pointsEarned: number; feedback: string; isCorrect: number }) => void;
  isGrading: boolean;
}

export const AnswersList = ({ answers, loading, onGrade, isGrading }: AnswersListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [gradeForm, setGradeForm] = useState({
    pointsEarned: 0,
    feedback: "",
    isCorrect: 1,
  });

  const handleStartEdit = (answer: StudentAnswerEntity) => {
    setEditingId(answer.id);
    setGradeForm({
      pointsEarned: answer.pointsEarned ?? 0,
      feedback: answer.feedback ?? "",
      isCorrect: answer.isCorrect ?? 1,
    });
  };

  const handleSave = (answerId: number) => {
    onGrade(answerId, gradeForm);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">No hay respuestas para esta pregunta aún.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Respuestas de Estudiantes</h3>
      {answers.map((answer) => (
        <Card key={answer.id} className={answer.isCorrect !== null ? "border-green-200 bg-green-50/30" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex justify-between items-center">
              <span>{answer.studentName}</span>
              <span className="text-xs text-gray-500">
                {new Date(answer.submittedAt).toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white border rounded-md">
              <p className="text-gray-800 whitespace-pre-wrap">{answer.answer}</p>
            </div>

            {editingId === answer.id ? (
              <div className="space-y-4 p-4 border rounded-md bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points">Puntos Obtenidos</Label>
                    <Input
                      id="points"
                      type="number"
                      value={gradeForm.pointsEarned}
                      onChange={(e) => setGradeForm({ ...gradeForm, pointsEarned: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Resultado</Label>
                    <div className="flex gap-2 mt-1">
                      <Button
                        type="button"
                        variant={gradeForm.isCorrect === 1 ? "default" : "outline"}
                        className={gradeForm.isCorrect === 1 ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => setGradeForm({ ...gradeForm, isCorrect: 1 })}
                        size="sm"
                      >
                        <Check className="w-4 h-4 mr-1" /> Correcto
                      </Button>
                      <Button
                        type="button"
                        variant={gradeForm.isCorrect === 0 ? "destructive" : "outline"}
                        onClick={() => setGradeForm({ ...gradeForm, isCorrect: 0 })}
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-1" /> Incorrecto
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback">Retroalimentación</Label>
                  <Textarea
                    id="feedback"
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                    placeholder="Escribe comentarios para el estudiante..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingId(null)} size="sm">
                    Cancelar
                  </Button>
                  <Button onClick={() => handleSave(answer.id)} disabled={isGrading} size="sm">
                    {isGrading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Guardar Calificación
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  {answer.isCorrect !== null && (
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-semibold">Calificación:</span>{" "}
                        {answer.isCorrect === 1 ? (
                          <span className="text-green-600 font-bold">Correcto</span>
                        ) : (
                          <span className="text-red-600 font-bold">Incorrecto</span>
                        )}
                        {" - "}
                        {answer.pointsEarned} puntos
                      </p>
                      {answer.feedback && (
                        <p>
                          <span className="font-semibold">Retroalimentación:</span> {answer.feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => handleStartEdit(answer)}>
                  {answer.isCorrect !== null ? "Editar Calificación" : "Calificar"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
