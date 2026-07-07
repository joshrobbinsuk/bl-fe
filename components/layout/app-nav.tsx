"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks, Trophy, MessageCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/services/betting-api";

import { cn } from "@/lib/utils";

function SoccerBall(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7.5 8 10.4l1.5 4.6h5L16 10.4 12 7.5Z" />
      <path d="M12 7.5V4M8 10.4 5 8.5M9.5 15 7 18M14.5 15 17 18M16 10.4 19 8.5" />
    </svg>
  );
}

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
    { href: "/fixtures", label: "Fixtures", icon: SoccerBall },
    { href: "/my-bets", label: "My Bets", icon: ListChecks },
    { href: "/cup", label: "Cup", icon: Trophy },
  ];

  const mobileNavItems = [
    ...navItems,
    { href: "/pundit", label: "Pundit", icon: MessageCircle },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
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
            <div
              data-testid="balance-pill"
              className="flex items-center gap-2 rounded-full border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 sm:px-3 sm:text-sm"
            >
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
          {mobileNavItems.map((item) => {
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
