import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const StudentsTab = ({ controller }: { controller: any }) => {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-2xl font-bold">Estudiantes Inscritos</h2>
      {controller.enrollments && controller.enrollments.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Número de Matrícula</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controller.enrollments.map((enrollment: any) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>Estudiante {enrollment.studentId}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${enrollment.status === "enrolled"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}>
                        {enrollment.status === "enrolled" ? "Inscrito" : enrollment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No hay estudiantes inscritos en este curso</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
