import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CourseFormDTO } from "../../application/dtos";
import { FormEvent } from "react";

interface CourseFormProps {
  formData: CourseFormDTO;
  setFormData: (data: CourseFormDTO) => void;
  handleSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
  user: any;
}

export const CourseForm = ({
  formData,
  setFormData,
  handleSubmit,
  onCancel,
  isPending,
  user,
}: CourseFormProps) => {
  const { t } = useI18n();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t("courses.name")} *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="code">{t("courses.code")} *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">{t("courses.description")}</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="credits">{t("courses.credits")}</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
          />
        </div>
        <div>
          <Label>{t("courses.teacher")}</Label>
          <div className="p-2 border rounded bg-muted/30 text-muted-foreground text-sm">
            {user?.firstName} {user?.lastName} (Asignación automática)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="academicYear">{t("courses.academicYear")} *</Label>
          <Input
            id="academicYear"
            value={formData.academicYear}
            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="semester">{t("courses.semester")} *</Label>
          <Select
            value={formData.semester}
            onValueChange={(value: any) => setFormData({ ...formData, semester: value })}
          >
            <SelectTrigger id="semester">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxStudents">{t("courses.maxStudents")}</Label>
          <Input
            id="maxStudents"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">{t("courses.status")}</Label>
        <Select
          value={formData.status}
          onValueChange={(value: any) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
            <SelectItem value="archived">{t("common.archived")}</SelectItem>
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
