import { useState } from "react";
import { useI18n } from "@common/hooksuseI18n";
import { trpc } from "@common/utils";
import { useAuth } from "@common/hooks";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Download, Trash2, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface MaterialFormData {
  courseId: number;
  title: string;
  description: string;
  file: File | null;
}

export default function Materials() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MaterialFormData>({
    courseId: 0,
    title: "",
    description: "",
    file: null,
  });

  const utils = trpc.useUtils();
  const { data: courses } = trpc.courses.list.useQuery({ limit: 100 });
  const { data: materials, isLoading } = courseId
    ? trpc.materials.list.useQuery({ courseId, limit: 100 })
    : { data: [], isLoading: false };

  const uploadMutation = trpc.materials.create.useMutation({
    onSuccess: () => {
      if (courseId) {
        utils.materials.list.invalidate({ courseId });
      }
      toast.success("Material subido exitosamente");
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Error al subir material");
    },
  });

  const deleteMutation = trpc.materials.delete.useMutation({
    onSuccess: () => {
      if (courseId) {
        utils.materials.list.invalidate({ courseId });
      }
      toast.success("Material eliminado exitosamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar material");
    },
  });

  const resetForm = () => {
    setFormData({
      courseId: 0,
      title: "",
      description: "",
      file: null,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("El título es requerido");
      return;
    }

    if (!formData.file) {
      toast.error("Debe seleccionar un archivo");
      return;
    }

    if (!courseId) {
      toast.error("Debe seleccionar un curso");
      return;
    }

    // Validar tipo de archivo
    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(formData.file.type)) {
      toast.error("Solo se permiten PDFs e imágenes (JPG, PNG, GIF)");
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (formData.file.size > 10 * 1024 * 1024) {
      toast.error("El archivo no puede exceder 10MB");
      return;
    }

    // Simular carga del archivo (en producción, usar S3)
    const fileUrl = URL.createObjectURL(formData.file);
    const fileType = formData.file.type.startsWith("image") ? "image" : "pdf";

    await uploadMutation.mutateAsync({
      courseId,
      title: formData.title,
      description: formData.description || undefined,
      fileUrl,
      fileKey: `materials/${courseId}/${Date.now()}-${formData.file.name}`,
      fileType,
      fileSize: formData.file.size,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este material?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getFileIcon = (fileType: string) => {
    return fileType === "pdf" ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Materiales</h1>
        <p className="text-gray-600">Gestiona los materiales de tus cursos</p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label>Seleccionar Curso</Label>
          <select
            value={courseId || ""}
            onChange={(e) => setCourseId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Seleccionar curso --</option>
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {user?.role === "admin" && courseId && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Subir Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir Nuevo Material</DialogTitle>
                <DialogDescription>Sube un PDF o imagen para tu curso</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Capítulo 1 - Introducción"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción del material"
                  />
                </div>

                <div>
                  <Label htmlFor="file">Archivo (PDF o Imagen)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                  />
                  {formData.file && <p className="text-sm text-gray-600 mt-2">{formData.file.name}</p>}
                </div>

                <Button type="submit" disabled={uploadMutation.isPending} className="w-full">
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    "Subir Material"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!courseId ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Selecciona un curso para ver sus materiales</p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : materials && materials.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Materiales del Curso</CardTitle>
            <CardDescription>{materials.length} material(es)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(material.fileType)}
                    <div className="flex-1">
                      <p className="font-medium">{material.title}</p>
                      {material.description && <p className="text-sm text-gray-600">{material.description}</p>}
                      <p className="text-xs text-gray-500">{formatFileSize(material.fileSize || 0)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Descargar
                      </Button>
                    </a>

                    {user?.role === "admin" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No hay materiales en este curso</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
