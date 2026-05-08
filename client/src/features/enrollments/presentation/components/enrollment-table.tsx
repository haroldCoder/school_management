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
import { getStatusBadge, getStatusLabel } from "../utils";

interface EnrollmentTableProps {
  enrollments?: any[];
  isAdmin: boolean;
  getStudentName: (id: number) => string;
  getCourseName: (id: number) => string;
  handleEdit: (enrollment: any) => void;
  handleDelete: (id: number) => void;
  deletePending: boolean;
}

export const EnrollmentTable = ({
  enrollments,
  isAdmin,
  getStudentName,
  getCourseName,
  handleEdit,
  handleDelete,
  deletePending,
}: EnrollmentTableProps) => {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50">
            <TableHead>{t("enrollments.student")}</TableHead>
            <TableHead>{t("enrollments.course")}</TableHead>
            <TableHead>{t("enrollments.enrollmentDate")}</TableHead>
            <TableHead>{t("enrollments.status")}</TableHead>
            {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments?.map((enrollment) => (
            <TableRow key={enrollment.id} className="border-b border-border/30 hover:bg-muted/50">
              <TableCell className="font-medium">{getStudentName(enrollment.studentId)}</TableCell>
              <TableCell>{getCourseName(enrollment.courseId)}</TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(enrollment.enrollmentDate).toLocaleDateString("es-ES")}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(enrollment.status)}`}
                >
                  {getStatusLabel(enrollment.status, t)}
                </span>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(enrollment)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(enrollment.id)}
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
