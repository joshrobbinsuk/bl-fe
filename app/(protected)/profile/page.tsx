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
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { UserAvatar } from "@/components/profile/user-avatar";
import { StreakBadges } from "@/components/cup/streak-badges";
import { useToast } from "@/hooks/use-toast";
import {
  useGetMeQuery,
  useSetAvatarMutation,
  useSetUsernameMutation,
} from "@/lib/services/betting-api";
import { defaultAvatarFor } from "@/lib/avatars";

export default function ProfilePage() {
  const { data: me, isLoading } = useGetMeQuery();
  const { toast } = useToast();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [setAvatarMutation, { isLoading: isSavingAvatar }] =
    useSetAvatarMutation();

  const [username, setUsername] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [setUsernameMutation, { isLoading: isSavingUsername }] =
    useSetUsernameMutation();

  if (isLoading || !me) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
        <AppNav />
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const selectedAvatar = avatar ?? me.avatar ?? defaultAvatarFor(me.id);
  const usernameValue = username ?? me.username ?? "";
  const ladSince = new Date(me.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const handleSaveAvatar = async () => {
    try {
      await setAvatarMutation({ avatar: selectedAvatar }).unwrap();
      toast({ title: "Avatar updated" });
    } catch {
      toast({
        title: "Couldn't save avatar",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);

    try {
      await setUsernameMutation({ username: usernameValue }).unwrap();
      toast({ title: "Username updated" });
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 409) {
        setUsernameError("That username is taken — try another.");
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Your identity across BrokeLads.
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center gap-4">
            <UserAvatar
              avatar={me.avatar}
              userId={me.id}
              username={me.username}
              size="lg"
            />
            <div className="space-y-1">
              <p className="text-lg font-semibold">{me.username ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{me.email}</p>
              <p className="text-sm text-muted-foreground">
                🏆 {me.cups_won} cup{me.cups_won === 1 ? "" : "s"} won
              </p>
              <StreakBadges
                participationStreak={me.participation_streak}
                profitStreak={me.profit_streak}
              />
              <p className="text-xs text-muted-foreground">
                Lad since {ladSince}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Pick an icon and colour.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarPicker value={selectedAvatar} onChange={setAvatar} />
            <Button onClick={handleSaveAvatar} disabled={isSavingAvatar}>
              {isSavingAvatar ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Username</CardTitle>
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
                {isSavingUsername ? "Saving..." : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
