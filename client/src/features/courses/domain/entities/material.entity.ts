export interface MaterialEntity {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileKey: string;
  fileType: "pdf" | "image";
  fileSize: number;
  createdAt?: Date;
}
