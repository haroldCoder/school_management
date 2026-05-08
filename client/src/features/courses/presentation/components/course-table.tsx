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
import { Edit2, Trash2, Loader2, Eye, ClipboardList } from "lucide-react";
import { useI18n } from "@common/hooks";
import { CourseEntity } from "../../domain/entities";

interface CourseTableProps {
  courses: CourseEntity[] | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  handleEdit: (course: CourseEntity) => void;
  deleteMutation: any;
  handleRowClick: (course: CourseEntity, e: React.MouseEvent) => void;
  onViewDetail: (id: number) => void;
}

export const CourseTable = ({
  courses,
  isLoading,
  isAdmin,
  handleEdit,
  deleteMutation,
  handleRowClick,
  onViewDetail,
}: CourseTableProps) => {
  const { t } = useI18n();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Listado de Cursos</CardTitle>
        <CardDescription>Total: {courses?.length || 0} cursos</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : courses && courses.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead>{t("courses.code")}</TableHead>
                  <TableHead>{t("courses.name")}</TableHead>
                  <TableHead>{t("courses.teacher")}</TableHead>
                  <TableHead>{t("courses.academicYear")}</TableHead>
                  <TableHead>{t("courses.semester")}</TableHead>
                  <TableHead>{t("courses.status")}</TableHead>
                  <TableHead>{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className={`border-b border-border/30 transition-colors ${isAdmin
                      ? "hover:bg-primary/5 cursor-pointer"
                      : "hover:bg-muted/50"
                      }`}
                    onClick={(e) => handleRowClick(course, e)}
                  >
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {course.name}
                        {isAdmin && (
                          <ClipboardList className="w-3.5 h-3.5 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.teacherId ? "Asignado" : "-"}
                    </TableCell>
                    <TableCell>{course.academicYear}</TableCell>
                    <TableCell>{course.semester}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.status === "active"
                          ? "bg-green-100 text-green-800"
                          : course.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {course.status === "active"
                          ? t("common.active")
                          : course.status === "inactive"
                            ? t("common.inactive")
                            : t("common.archived")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(course.id);
                          }}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Button>
                        {isAdmin && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(course);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(t("common.confirmDelete"))) {
                                  deleteMutation.mutate({ id: course.id });
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">{t("courses.noCourses")}</div>
        )}
      </CardContent>
    </Card>
  );
};
