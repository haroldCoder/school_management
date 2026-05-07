import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const cachedUser = useMemo(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem("school-user-info");
    return cached ? JSON.parse(cached) : null;
  }, []);

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    initialData: cachedUser,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem("school-user-info");
      utils.auth.me.setData(undefined, null);
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (user) => {
      if (user) {
        localStorage.setItem("school-user-info", JSON.stringify(user));
      }
      utils.auth.me.setData(undefined, user as any);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (user) => {
      if (user) {
        localStorage.setItem("school-user-info", JSON.stringify(user));
      }
      utils.auth.me.setData(undefined, user as any);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      throw error;
    } finally {
      localStorage.removeItem("school-user-info");
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    const user = meQuery.data ?? null;
    const isAuthenticated = Boolean(user);

    // Sync localStorage with latest server data
    if (meQuery.isSuccess) {
      if (user) {
        localStorage.setItem("school-user-info", JSON.stringify(user));
      }
    }

    return {
      user,
      loading: meQuery.isLoading || logoutMutation.isPending || loginMutation.isPending || registerMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? loginMutation.error ?? registerMutation.error ?? null,
      isAuthenticated,
    };
  }, [
    meQuery.data,
    meQuery.isSuccess,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    loginMutation.error,
    loginMutation.isPending,
    registerMutation.error,
    registerMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
  };
}
