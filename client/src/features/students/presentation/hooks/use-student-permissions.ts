import { useAuth } from "@/common/hooks";

export function useStudentPermissions() {
    const { user } = useAuth();

    const isAdmin =
        user?.role === "admin";

    return {
        isAdmin,
    };
}