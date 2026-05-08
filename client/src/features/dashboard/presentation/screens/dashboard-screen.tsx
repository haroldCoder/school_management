import { useDashboard } from "../hooks";
import { AdminDashboard, StudentDashboard } from "../components";

export const DashboardScreen = () => {
    const { t, user, stats, isLoading, isStudent } = useDashboard();

    if (isStudent) {
        return <StudentDashboard user={user} stats={stats} isLoading={isLoading} />;
    }

    return <AdminDashboard t={t} stats={stats} isLoading={isLoading} />;
};
