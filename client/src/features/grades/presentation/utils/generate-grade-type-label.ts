export const getGradeTypeLabel = (type: string | null, t: (key: string) => string) => {
    switch (type) {
        case "midterm":
            return t("grades.midterm");
        case "final":
            return t("grades.final");
        case "assignment":
            return t("grades.assignment");
        case "participation":
            return t("grades.participation");
        case "project":
            return t("grades.project");
        default:
            return type;
    }
};