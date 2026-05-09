import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useI18n } from "@common/hooks";
import { GradeFormDTO } from "../../application/dtos";

interface GradeFormProps {
  formData: GradeFormDTO;
  setFormData: (data: GradeFormDTO) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  enrollments?: any[];
  isPending: boolean;
  getStudentName: (id: number) => string;
  getCourseName: (id: number) => string;
}

export const GradeForm = ({
  formData,
  setFormData,
  handleSubmit,
  onCancel,
  enrollments,
  isPending,
  getStudentName,
  getCourseName,
}: GradeFormProps) => {
  const { t } = useI18n();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="enrollmentId">{t("grades.student")} *</Label>
        <Select
          value={formData.enrollmentId}
          onValueChange={(value) => {
            const enrollment = enrollments?.find((e) => e.id === parseInt(value));
            if (enrollment) {
              setFormData({
                ...formData,
                enrollmentId: value,
                studentId: enrollment.studentId.toString(),
                courseId: enrollment.courseId.toString(),
              });
            }
          }}
        >
          <SelectTrigger id="enrollmentId">
            <SelectValue placeholder="Seleccionar alumno" />
          </SelectTrigger>
          <SelectContent>
            {enrollments?.map((enrollment) => (
              <SelectItem key={enrollment.id} value={enrollment.id.toString()}>
                {getStudentName(enrollment.studentId)} - {getCourseName(enrollment.courseId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grade">{t("grades.grade")} *</Label>
          <Input
            id="grade"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="gradeType">{t("grades.gradeType")} *</Label>
          <Select
            value={formData.gradeType}
            onValueChange={(value: any) => setFormData({ ...formData, gradeType: value })}
          >
            <SelectTrigger id="gradeType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="midterm">{t("grades.midterm")}</SelectItem>
              <SelectItem value="final">{t("grades.final")}</SelectItem>
              <SelectItem value="assignment">{t("grades.assignment")}</SelectItem>
              <SelectItem value="participation">{t("grades.participation")}</SelectItem>
              <SelectItem value="project">{t("grades.project")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {t("common.save")}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
};
