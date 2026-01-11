"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";

const AUTH_ROUTES = new Set(["/", "/login", "/signup"]);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (AUTH_ROUTES.has(pathname)) {
      setChecking(false);
      return;
    }

    const checkAuth = async () => {
      setChecking(true);
      try {
        await getCurrentUser();
        setChecking(false);
      } catch {
        setChecking(false);
        router.replace("/login");
      }
    };

    void checkAuth();
  }, [pathname, router]);

  if (checking) {
    return null;
  }

  return children;
}
