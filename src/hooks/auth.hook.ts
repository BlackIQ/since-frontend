"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const useAuth = (requireAuth = true) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.token.token);

  useEffect(() => {
    if (requireAuth && !token) {
      router.replace("/auth");
    } else if (!requireAuth && token && pathname === "/auth") {
      router.replace("/panel");
    }
  }, [token, requireAuth, pathname, router]);

  return { isAuthenticated: Boolean(token) };
};

export default useAuth;
