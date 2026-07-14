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
import {
  useGetMeQuery,
  useSetShirtMutation,
  useSetUsernameMutation,
} from "@/lib/services/betting-api";
import { defaultShirtFor, type Shirt } from "@/lib/shirts";
import { ShirtPicker } from "@/components/profile/shirt-picker";

export default function WelcomePage() {
  const { data: me } = useGetMeQuery();
  const [username, setUsername] = useState("");
  const [shirt, setShirt] = useState<Shirt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setUsernameMutation, { isLoading }] = useSetUsernameMutation();
  const [setShirtMutation] = useSetShirtMutation();

  const selectedShirt = shirt ?? (me ? defaultShirtFor(me.id) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await setUsernameMutation({ username }).unwrap();
      if (selectedShirt) {
        try {
          await setShirtMutation(selectedShirt).unwrap();
        } catch {
          // Shirt failure after a successful username set is fine — the user
          // just keeps the fallback disc until they try again.
        }
      }
      // UsernameGate owns the redirect: the mutation patches getMe, so the gate
      // sees a non-null username and navigates to /fixtures on its own.
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 409) {
        setError("That username is taken — try another.");
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
          <h1 className="text-4xl font-bold tracking-tight">BrokeLads</h1>
          <p className="text-muted-foreground">A betting app by Josh Robbins</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome to BrokeLads</CardTitle>
            <CardDescription>
              A weekly betting cup. Everyone gets $1,000 of play money each week
              and the biggest balance by Monday wins. First — pick a username.
              It&apos;s how you&apos;ll show up on the leaderboard.
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
              {selectedShirt && (
                <div className="space-y-2">
                  <Label>Your shirt</Label>
                  <ShirtPicker value={selectedShirt} onChange={setShirt} />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting up..." : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
