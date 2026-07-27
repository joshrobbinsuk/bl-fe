"use client";

import type React from "react";

import { useState } from "react";
import { AppNav } from "@/components/layout/app-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  useGetMeQuery,
  useSetUsernameMutation,
} from "@/lib/services/betting-api";
import { formatMoney } from "@/lib/money";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: me, isLoading } = useGetMeQuery();
  const { toast } = useToast();

  const [username, setUsername] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [setUsernameMutation, { isLoading: isSavingUsername }] =
    useSetUsernameMutation();

  if (isLoading || !me) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
        <AppNav />
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <p className="text-muted-foreground">Findin&apos; your file…</p>
        </div>
      </div>
    );
  }

  const usernameValue = username ?? me.username ?? "";
  const ladSince = new Date(me.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);

    try {
      await setUsernameMutation({ username: usernameValue }).unwrap();
      toast({ title: "Sorted, lad." });
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 409) {
        setUsernameError("Someone's nicked that one — try another.");
      } else if (status === 422) {
        setUsernameError("Use 3–20 letters, numbers or underscores.");
      } else {
        setUsernameError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNav />

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Who you are round here, son.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{me.username ?? "—"}</CardTitle>
            <CardDescription>
              {me.email} · lad since {ladSince}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Pot" value={formatMoney(me.balance)} />
            <Stat label="Cups won" value={String(me.cups_won)} />
            <Stat
              label="Weeks on the bounce"
              value={String(me.participation_streak)}
            />
            <Stat label="Weeks in profit" value={String(me.profit_streak)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Name</CardTitle>
            <CardDescription>
              How you show up on the leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveUsername} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={usernameValue}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  3–20 letters, numbers or underscores.
                </p>
                {usernameError && (
                  <p className="text-sm text-destructive">{usernameError}</p>
                )}
              </div>
              <Button type="submit" disabled={isSavingUsername}>
                {isSavingUsername ? "Savin'…" : "Save it"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
