"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, ListChecks, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/services/betting-api";

import { cn } from "@/lib/utils";

export function AppNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();
  const { data: me, isLoading: isUserLoading } = useGetMeQuery();

  const balanceNumber =
    me?.balance !== undefined ? Number.parseFloat(me.balance) : null;
  const balanceLabel =
    balanceNumber !== null && !Number.isNaN(balanceNumber)
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(balanceNumber)
      : "Balance --";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");

    router.refresh();
  };

  const navItems = [
    { href: "/fixtures", label: "Fixtures", icon: Trophy },
    { href: "/my-bets", label: "My Bets", icon: ListChecks },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/fixtures" className="font-bold text-xl">
              BrokeLads
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground sm:px-3 sm:text-sm">
              <span className="text-muted-foreground">Balance</span>
              <span className={isUserLoading ? "text-muted-foreground" : ""}>
                {isUserLoading ? "Loading..." : balanceLabel}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleSignOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t">
        <div className="container mx-auto px-4 py-2 flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
