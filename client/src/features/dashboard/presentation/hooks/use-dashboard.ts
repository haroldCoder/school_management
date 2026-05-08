import { useI18n, useAuth } from "@common/hooks";
import { trpc } from "@common/utils";

export function useDashboard() {
    const { t } = useI18n();
    const { user } = useAuth();
    const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

    const isStudent = user?.role === "user";

    return {
        t,
        user,
        stats,
        isLoading,
        isStudent,
    };
}
