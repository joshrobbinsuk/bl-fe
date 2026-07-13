"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
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
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const RESEND_COOLDOWN_SECONDS = 30;

type Step = "request" | "done";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Don't reveal whether an account exists: an unknown email gets the same
  // done screen as a real one (firebase throws auth/user-not-found, which we
  // swallow). Other errors are surfaced.
  const sendResetEmail = async (): Promise<boolean> => {
    try {
      await resetPassword(email);
      return true;
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/user-not-found") {
        return true;
      }
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await sendResetEmail();
    setLoading(false);
    if (ok) {
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep("done");
    }
  };

  const handleResend = async () => {
    const ok = await sendResetEmail();
    if (ok) {
      setCooldown(RESEND_COOLDOWN_SECONDS);
      toast({
        title: "Email sent",
        description: `If an account exists for ${email}, a fresh link is on its way.`,
      });
    }
  };

  if (step === "done") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            If an account exists for {email}, we&apos;ve sent a link to reset your
            password. Follow it to choose a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full"
            disabled={cooldown > 0}
            onClick={handleResend}
          >
            {cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend link"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
