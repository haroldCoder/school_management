import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useI18n } from "@common/hooks";
import { getGradeColor } from "@common/utils";
import { getGradeTypeLabel } from "../utils";

interface GradeTableProps {
  grades?: any[];
  isAdmin: boolean;
  getStudentName: (id: number) => string;
  getCourseName: (id: number) => string;
  handleEdit: (grade: any) => void;
  handleDelete: (id: number) => void;
  deletePending: boolean;
}

export const GradeTable = ({
  grades,
  isAdmin,
  getStudentName,
  getCourseName,
  handleEdit,
  handleDelete,
  deletePending,
}: GradeTableProps) => {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50">
            <TableHead>{t("grades.student")}</TableHead>
            <TableHead>{t("grades.course")}</TableHead>
            <TableHead>{t("grades.grade")}</TableHead>
            <TableHead>{t("grades.gradeType")}</TableHead>
            <TableHead>{t("grades.recordedDate")}</TableHead>
            {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades?.map((grade) => (
            <TableRow key={grade.id} className="border-b border-border/30 hover:bg-muted/50">
              <TableCell className="font-medium">{getStudentName(grade.studentId)}</TableCell>
              <TableCell>{getCourseName(grade.courseId)}</TableCell>
              <TableCell className={getGradeColor(grade.grade) + " font-semibold"}>
                {Number(grade.grade).toFixed(1)}
              </TableCell>
              <TableCell>{getGradeTypeLabel(grade.gradeType, t)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(grade.recordedDate).toLocaleDateString("es-ES")}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(grade)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(grade.id)}
                      disabled={deletePending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
