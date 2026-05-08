import { useI18n } from "@common/hooks";

export const getStatusLabel = (status: string | null, t: (key: string) => string) => {
    switch (status) {
        case "active":
            return t("common.active");
        case "inactive":
            return t("common.inactive");
        case "on_leave":
            return t("teachers.onLeave");
        default:
            return status;
    }
};