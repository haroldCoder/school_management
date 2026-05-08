export const createFilePreview = async (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith("image") ? "image" : "pdf";

    return {
        fileUrl,
        fileType
    }
}