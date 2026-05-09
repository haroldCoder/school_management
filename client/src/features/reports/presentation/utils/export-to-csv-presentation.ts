import { toast } from "sonner";
import { BrowserDownloadService } from "../../infrastructure";
import { exportToCSV } from "../../application/utils";

export const exportToCSVPresentation = <T>(data: T[], filename: string, headers: string[]) => {
  if (!data || !filename || !headers) return;
  try {
    const csv = exportToCSV(data, filename, headers);
    BrowserDownloadService.downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
    toast.success(`Reporte ${filename} exportado exitosamente`);
  } catch (error) {
    toast.error("Error al exportar reporte");
  }
};