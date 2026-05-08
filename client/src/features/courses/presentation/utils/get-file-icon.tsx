import { FileText, Image as ImageIcon } from "lucide-react";

export const getFileIcon = (fileType: string) => {
    return fileType === "pdf" ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />;
};