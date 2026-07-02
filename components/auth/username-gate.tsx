"use client";

import type React from "react";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/services/betting-api";
import { Spinner } from "@/components/ui/spinner";

const GATE_PATH = "/welcome";

function Redirecting() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}

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

  // While a redirect is pending, show a spinner rather than a blank frame — the
  // effect above owns the navigation. On query error `me` is undefined and
  // isLoading is false, so both guards fall through to the page (balances show
  // placeholders) rather than trapping the user, until getMe recovers.
  if (isLoading) return <Redirecting />;
  if (me && needsUsername && !onGate) return <Redirecting />;
  if (me && !needsUsername && onGate) return <Redirecting />;

  return <>{children}</>;
}
