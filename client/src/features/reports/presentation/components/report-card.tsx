import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  count: number;
  loading: boolean;
  onExportCSV: () => void;
}

export const ReportCard = ({
  title,
  description,
  count,
  loading,
  onExportCSV,
}: ReportCardProps) => (
  <Card className="border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Total de registros</p>
        <p className="text-3xl font-bold text-foreground">{loading ? "-" : count}</p>
      </div>
      <Button onClick={onExportCSV} disabled={loading || count === 0} className="w-full">
        <FileDown className="w-4 h-4 mr-2" />
        Exportar a CSV
      </Button>
    </CardContent>
  </Card>
);
