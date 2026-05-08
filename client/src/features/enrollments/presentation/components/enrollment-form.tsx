import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useI18n } from "@common/hooks";
import { EnrollmentFormDTO } from "../../application/dtos";

interface EnrollmentFormProps {
  formData: EnrollmentFormDTO;
  setFormData: (data: EnrollmentFormDTO) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  students?: any[];
  courses?: any[];
  isPending: boolean;
}

export const EnrollmentForm = ({
  formData,
  setFormData,
  handleSubmit,
  onCancel,
  students,
  courses,
  isPending,
}: EnrollmentFormProps) => {
  const { t } = useI18n();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="studentId">{t("enrollments.student")} *</Label>
        <Select
          required
          value={formData.studentId}
          onValueChange={(value) => setFormData({ ...formData, studentId: value })}
        >
          <SelectTrigger id="studentId">
            <SelectValue placeholder="Seleccionar alumno" />
          </SelectTrigger>
          <SelectContent>
            {students?.map((student) => (
              <SelectItem key={student.id} value={student.id.toString()}>
                {student.firstName} {student.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="courseId">{t("enrollments.course")} *</Label>
        <Select
          required
          value={formData.courseId}
          onValueChange={(value) => setFormData({ ...formData, courseId: value })}
        >
          <SelectTrigger id="courseId">
            <SelectValue placeholder="Seleccionar curso" />
          </SelectTrigger>
          <SelectContent>
            {courses?.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">{t("enrollments.status")}</Label>
        <Select
          value={formData.status}
          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enrolled">{t("enrollments.enrolled")}</SelectItem>
            <SelectItem value="completed">{t("enrollments.completed")}</SelectItem>
            <SelectItem value="dropped">{t("enrollments.dropped")}</SelectItem>
            <SelectItem value="pending">{t("enrollments.pending")}</SelectItem>
          </SelectContent>
        </Select>
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
