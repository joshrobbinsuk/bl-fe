"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ListChecks,
  Trophy,
  MessageCircle,
  LogOut,
  Volleyball,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wordmark } from "@/components/layout/wordmark";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/services/betting-api";
import { formatMoney } from "@/lib/money";

import { cn } from "@/lib/utils";

export function AppNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();
  const { data: me, isLoading: isUserLoading } = useGetMeQuery();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");

    router.refresh();
  };

  const navItems = [
    { href: "/fixtures", label: "Fixtures", icon: Volleyball },
    { href: "/my-bets", label: "My Bets", icon: ListChecks },
    { href: "/cup", label: "Cup", icon: Trophy },
  ];

  const mobileNavItems = [
    ...navItems,
    { href: "/pundit", label: "Pundit", icon: MessageCircle },
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/fixtures">
              <Wordmark className="text-xl md:text-2xl" />
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary-foreground transition-colors",
                      pathname === item.href ? "bg-black/15" : "hover:bg-black/10",
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
              className="flex items-center gap-2 rounded-full border border-black/20 bg-black/15 px-2.5 py-1 text-xs font-semibold tabular-nums max-md:absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 sm:px-3 sm:text-sm"
            >
              <span>{isUserLoading ? "Countin'…" : formatMoney(me?.balance)}</span>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-black/10 focus-visible:ring-[3px] focus-visible:ring-primary-foreground/50"
              >
                <span className="hidden max-w-24 truncate sm:block">
                  {me?.username ?? "…"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSignOut()}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-black/15">
        <div className="container mx-auto px-4 py-2 flex items-center justify-around">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-md text-xs font-medium text-primary-foreground transition-colors",
                  pathname === item.href && "bg-black/15",
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
