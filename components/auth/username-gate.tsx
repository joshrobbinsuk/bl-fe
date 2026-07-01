"use client";

import type React from "react";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/services/betting-api";

const GATE_PATH = "/welcome";

/**
 * Sits below RouteGuard (so the user is already authed). Sends anyone without a
 * username to the first-run gate, and keeps anyone who has one off it.
 */
export function UsernameGate({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useGetMeQuery();
  const pathname = usePathname();
  const router = useRouter();

  const needsUsername = !!me && me.username === null;
  const onGate = pathname === GATE_PATH;

  useEffect(() => {
    if (!me) return;
    if (needsUsername && !onGate) router.replace(GATE_PATH);
    if (!needsUsername && onGate) router.replace("/fixtures");
  }, [me, needsUsername, onGate, router]);

  // Hold rendering while we don't yet know, or while a redirect is pending, to
  // avoid flashing the wrong screen. On query error `me` is undefined and
  // isLoading is false, so we fall through to the page rather than trapping the
  // user in a blank gate — it renders its normal state (balances show
  // placeholders) until getMe recovers on the next refetch.
  if (isLoading) return null;
  if (needsUsername && !onGate) return null;
  if (me && !needsUsername && onGate) return null;

  return <>{children}</>;
}
