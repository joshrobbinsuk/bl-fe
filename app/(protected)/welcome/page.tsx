"use client";

import type React from "react";

import { useState } from "react";
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
import { Wordmark } from "@/components/layout/wordmark";
import { useSetUsernameMutation } from "@/lib/services/betting-api";

export default function WelcomePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [setUsernameMutation, { isLoading }] = useSetUsernameMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await setUsernameMutation({ username }).unwrap();
      // UsernameGate owns the redirect: the mutation patches getMe, so the gate
      // sees a non-null username and navigates to /fixtures on its own.
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 409) {
        setError("Someone's nicked that one — try another.");
      } else if (status === 422) {
        setError("Use 3–20 letters, numbers or underscores.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <Wordmark className="block text-5xl text-primary" />
          <p className="text-muted-foreground">A betting app by Josh Robbins</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Awright, son</CardTitle>
            <CardDescription>
              Pick a name. It&apos;s how you&apos;ll show up on the leaderboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="e.g. josh_r"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground">
                  3–20 letters, numbers or underscores.
                </p>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Settin' you up…" : "Let's 'ave it"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
