import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Loader2, Download, Trash2 } from "lucide-react";
import { formatFileSize, getFileIcon } from "../../utils";

interface MaterialsTabProps {
  isAdmin: boolean;
  materials?: any[];
  materialsLoading: boolean;
  openMaterialDialog: boolean;
  setOpenMaterialDialog: (value: boolean) => void;
  materialForm: {
    title: string;
    description: string;
    file: File | null;
  };
  setMaterialForm: (value: any) => void;
  handleUploadMaterial: (e: React.FormEvent) => void;
  uploadMaterial: {
    isPending: boolean;
  };
  handleDeleteMaterial: (id: number) => void;
}

export const MaterialsTab = ({
  isAdmin,
  materials,
  materialsLoading,
  openMaterialDialog,
  setOpenMaterialDialog,
  materialForm,
  setMaterialForm,
  handleUploadMaterial,
  uploadMaterial,
  handleDeleteMaterial,
}: MaterialsTabProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Materiales del Curso</h2>
        {isAdmin && (
          <Dialog open={openMaterialDialog} onOpenChange={setOpenMaterialDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Subir Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir Nuevo Material</DialogTitle>
                <DialogDescription>Sube un PDF o imagen para este curso</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUploadMaterial} className="space-y-4">
                <div>
                  <Label htmlFor="material-title">Título</Label>
                  <Input
                    id="material-title"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    placeholder="Ej: Capítulo 1"
                  />
                </div>
                <div>
                  <Label htmlFor="material-desc">Descripción</Label>
                  <Input
                    id="material-desc"
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    placeholder="Descripción opcional"
                  />
                </div>
                <div>
                  <Label htmlFor="material-file">Archivo</Label>
                  <Input
                    id="material-file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, file: e.target.files?.[0] || null })
                    }
                  />
                </div>
                <Button type="submit" disabled={uploadMaterial.isPending} className="w-full">
                  {uploadMaterial.isPending ? (
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

      {materialsLoading ? (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : materials && materials.length > 0 ? (
        <div className="space-y-3">
          {materials.map((material: any) => (
            <Card key={material.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
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
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMaterial(material.id)}
                        disabled={uploadMaterial.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No hay materiales en este curso</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
