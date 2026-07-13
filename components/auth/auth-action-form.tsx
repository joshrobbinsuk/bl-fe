"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
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
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const MIN_PASSWORD_LENGTH = 6;

type Phase = "verifying" | "form" | "done" | "invalid";

function ErrorCard({ description }: { description: string }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Link not valid</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function AuthActionForm() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  if (mode !== "resetPassword" || !oobCode) {
    return (
      <ErrorCard description="This password-reset link is invalid or has expired." />
    );
  }

  return <ResetPasswordForm oobCode={oobCode} />;
}

function ResetPasswordForm({ oobCode }: { oobCode: string }) {
  const [phase, setPhase] = useState<Phase>("verifying");
  const [accountEmail, setAccountEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setAccountEmail(email);
        setPhase("form");
      })
      .catch(() => setPhase("invalid"));
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast({
        title: "Error",
        description: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setPhase("done");
    } catch (error) {
      const expired =
        error instanceof FirebaseError &&
        (error.code === "auth/expired-action-code" ||
          error.code === "auth/invalid-action-code");
      toast({
        title: "Error",
        description: expired
          ? "This reset link has expired. Request a new one."
          : "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (phase === "verifying") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Checking your link…</CardTitle>
          <CardDescription>One moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (phase === "invalid") {
    return (
      <ErrorCard description="This password-reset link is invalid or has expired." />
    );
  }

  if (phase === "done") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Password reset</CardTitle>
          <CardDescription>
            Your password has been changed. You can log in with it now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>Resetting the password for {accountEmail}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={MIN_PASSWORD_LENGTH}
              required
            />
            <p className="text-xs text-muted-foreground">At least 6 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
