import { useAuthStore } from "@/hooks/auth";
import { useRouter } from "next/router";
import { FC, ReactNode, useEffect } from "react";

type PrivateRouteProps = {
  protectedRoutes: string[];
  children: any;
};

// A wrapper component to protect auth-required pages
const PrivateRoute = ({ protectedRoutes, children }: PrivateRouteProps) => {
  const router = useRouter();
  const refetch = useAuthStore((state) => state.refetch);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const pathIsProtected = protectedRoutes.includes(router.pathname);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && !user && pathIsProtected) {
      router.push("/");
    }
  }, [isLoading, user, pathIsProtected, router]);

  if ((isLoading || !user) && pathIsProtected) {
    return <>Loading...</>;
  }

  return children;
};

export default PrivateRoute;
