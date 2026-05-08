export const getStatusLabel = (status: string | null, t: (key: string) => string) => {
    switch (status) {
        case "enrolled":
            return t("enrollments.enrolled");
        case "completed":
            return t("enrollments.completed");
        case "dropped":
            return t("enrollments.dropped");
        case "pending":
            return t("enrollments.pending");
        default:
            return status;
    }
};