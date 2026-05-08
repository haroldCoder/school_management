import { useAuth } from "@common/hooks";

export function useTeacherPermissions() {
    const { user } = useAuth();

    const isAdmin = user?.role === "admin";

    return {
        isAdmin,
        user,
    };
}
