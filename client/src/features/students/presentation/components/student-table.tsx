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

interface StudentTableProps {
  t: (key: string) => string;
  students: any[] | undefined;
  isLoading: boolean;
  isAdmin: boolean;
  handleEdit: (student: any) => void;
  deleteMutation: any;
}

export const StudentTable = ({
  t,
  students,
  isLoading,
  isAdmin,
  handleEdit,
  deleteMutation,
}: StudentTableProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Listado de Alumnos</CardTitle>
        <CardDescription>Total: {students?.length || 0} alumnos</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : students && students.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead>{t("students.firstName")}</TableHead>
                  <TableHead>{t("students.lastName")}</TableHead>
                  <TableHead>{t("students.email")}</TableHead>
                  <TableHead>{t("students.enrollmentNumber")}</TableHead>
                  <TableHead>{t("students.status")}</TableHead>
                  {isAdmin && <TableHead>{t("common.actions")}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="border-b border-border/30 hover:bg-muted/50">
                    <TableCell className="font-medium">{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email || "-"}</TableCell>
                    <TableCell>{student.enrollmentNumber || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : student.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {student.status === "active"
                          ? t("common.active")
                          : student.status === "inactive"
                            ? t("common.inactive")
                            : "Graduado"}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(student)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(t("common.confirmDelete"))) {
                                deleteMutation.mutate({ id: student.id });
                              }
                            }}
                            disabled={deleteMutation.isPending}
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">{t("students.noStudents")}</div>
        )}
      </CardContent>
    </Card>
  );
};
