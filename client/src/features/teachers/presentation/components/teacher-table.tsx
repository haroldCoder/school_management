import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { useI18n } from "@common/hooks";
import { TeacherEntity } from "../../domain/entities";
import { getStatusBadge, getStatusLabel } from "../utils";

interface TeacherTableProps {
  teachers: TeacherEntity[] | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  userId?: number;
  handleEdit: (teacher: TeacherEntity) => void;
  deleteMutation: any;
}

export const TeacherTable = ({
  teachers,
  isLoading,
  isAdmin,
  userId,
  handleEdit,
  deleteMutation,
}: TeacherTableProps) => {
  const { t } = useI18n();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Listado de Profesores</CardTitle>
        <CardDescription>Total: {teachers?.length || 0} profesores</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : teachers && teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead>{t("teachers.firstName")}</TableHead>
                  <TableHead>{t("teachers.lastName")}</TableHead>
                  <TableHead>{t("teachers.email")}</TableHead>
                  <TableHead>{t("teachers.specialization")}</TableHead>
                  <TableHead>{t("teachers.status")}</TableHead>
                  {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id} className="border-b border-border/30 hover:bg-muted/50">
                    <TableCell className="font-medium">{teacher.firstName}</TableCell>
                    <TableCell>{teacher.lastName}</TableCell>
                    <TableCell className="text-muted-foreground">{teacher.email || "-"}</TableCell>
                    <TableCell>{teacher.specialization || "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(teacher.status)}`}>
                        {getStatusLabel(teacher.status, t)}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          {teacher.idUser === userId && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(teacher)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm(t("common.confirmDelete"))) {
                                    deleteMutation.mutate({ id: teacher.id });
                                  }
                                }}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">{t("teachers.noTeachers")}</div>
        )}
      </CardContent>
    </Card>
  );
};
